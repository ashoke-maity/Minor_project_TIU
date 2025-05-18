import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../components/admin/Sidebar'
import MobileSidebar from '../components/admin/MobileSidebar'
import Header from '../components/admin/Header'

const adminRoute = import.meta.env.VITE_ADMIN_ROUTE

const AdminJobPosting = () => {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("authToken")
      
      const response = await axios.get(
        `${import.meta.env.VITE_ADMIN_API_URL}/admin/jobs`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      setJobs(response.data.jobs || [])
      setError(null)
    } catch (err) {
      console.error("Error fetching jobs:", err)
      setError("Failed to load jobs. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleAddEventClick = () => {
    navigate(`${adminRoute}/admin/dashboard/addJobs`)
  }

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return
    }
    
    try {
      const token = localStorage.getItem("authToken")
      
      await axios.delete(
        `${import.meta.env.VITE_ADMIN_API_URL}/admin/jobs/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      // Remove the job from the state
      setJobs(jobs.filter(job => job._id !== jobId))
      alert("Job deleted successfully")
    } catch (err) {
      console.error("Error deleting job:", err)
      alert("Failed to delete job. Please try again.")
    }
  }

  const handleEditJob = (jobId) => {
    navigate(`${adminRoute}/admin/dashboard/editJob/${jobId}`)
  }

  return (
    <div className="admin-layout bg-gray-50 min-h-screen flex">
      <Sidebar />
      <MobileSidebar />
      <main className="wrapper mt-5 flex-1 px-4">
        <header className="header mb-4">
          <Header 
            title="Manage Jobs Opening"
            description="Filter, sort and add new jobs"
          />
        </header>

        <div className="mb-6 rounded-xl bg-white shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-gray-800">Add Jobs</h3>
            <button
              onClick={handleAddEventClick}
              className="bg-primary-100 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-100/80 transition"
            >
              + Add a New Job
            </button>
          </div>
        </div>
        
        {/* Job Listings Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Job Listings</h3>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-100"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <p className="text-gray-600">No jobs have been posted yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map(job => (
                <div key={job._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      {job.logoUrl ? (
                        <img 
                          src={job.logoUrl} 
                          alt={`${job.companyName} logo`} 
                          className="w-12 h-12 object-contain rounded-md"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-gray-500 text-xl font-bold">
                            {job.companyName?.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">{job.jobTitle}</h3>
                        <p className="text-gray-700">{job.companyName}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {job.jobType}
                      </span>
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {job.location}
                      </span>
                      {job.salary && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {job.salary}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-gray-700 text-sm line-clamp-2">{job.description}</p>
                    </div>
                    
                    {job.deadline && (
                      <div className="mt-2 text-xs text-gray-600">
                        Application Deadline: {new Date(job.deadline).toLocaleDateString()}
                      </div>
                    )}
                    
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end gap-2">
                      <button 
                        onClick={() => handleEditJob(job._id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteJob(job._id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminJobPosting
