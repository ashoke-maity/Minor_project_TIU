import React from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/admin/Sidebar'
import MobileSidebar from '../components/admin/MobileSidebar'
import Header from '../components/admin/Header'

const adminRoute = import.meta.env.VITE_ADMIN_ROUTE

const AdminJobPosting = () => {
  const navigate = useNavigate()

  const handleAddEventClick = () => {
    navigate(`${adminRoute}/admin/dashboard/addJobs`)
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

        <div className="mb-4 rounded-xl bg-white shadow-md p-4">
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
      </main>
    </div>
  )
}

export default AdminJobPosting
