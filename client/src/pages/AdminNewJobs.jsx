import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import MobileSidebar from '../components/admin/MobileSidebar';
import Header from '../components/admin/Header';
import JobForm from './JobForm';

const adminRoute = import.meta.env.VITE_ADMIN_ROUTE;

const AdminNewJobs = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [newJob, setNewJob] = useState(null);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleJobSubmit = (jobData) => {
    // Store the newly created job
    setNewJob(jobData);
    
    // Show success popup
    setShowSuccess(true);

    // Auto-hide after 3 seconds and navigate back to job listings
    setTimeout(() => {
      setShowSuccess(false);
      // Navigate back to the job listings page
      navigate(`${adminRoute}/admin/dashboard/jobs`);
    }, 3000);
  };

  return (
    <div className="admin-layout bg-gray-50 min-h-screen flex">
      <Sidebar />
      <MobileSidebar />
      <main className="wrapper mt-5 flex-1 px-4">
        <header className="header mb-2">
          <Header title="Add Jobs" description="Add New Job Openings" />
        </header>

        {/* 🔙 Go Back Button with Icon */}
        <div className="mb-4">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 shadow-md transition"
          >
            <img src="/icons/arrow-left.svg" alt="Back" className="w-4 h-4" />
            Go Back
          </button>
        </div>

        {/* ✅ Success Popup */}
        {showSuccess && (
          <div className="fixed top-6 right-6 z-50">
            <div className="bg-green-100 text-green-800 px-6 py-4 rounded-lg shadow-md flex items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-2">
                <img src="/icons/check-circle.svg" alt="Success" className="w-5 h-5" />
                <span>Job added successfully!</span>
              </div>
              <button
                onClick={() => setShowSuccess(false)}
                className="text-green-800 hover:text-green-600 focus:outline-none"
              >
                <img src="/icons/close.svg" alt="Close" className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 🧾 Job Form Card */}
        <JobForm onSubmitSuccess={handleJobSubmit} />

        {/* Display newly added job */}
        {newJob && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Recently Added Job</h2>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start gap-4">
                {newJob.logoUrl ? (
                  <img 
                    src={newJob.logoUrl} 
                    alt={`${newJob.companyName} logo`} 
                    className="w-16 h-16 object-contain rounded-md"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                    <span className="text-gray-500 text-xl font-bold">
                      {newJob.companyName?.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{newJob.jobTitle}</h3>
                  <p className="text-gray-700">{newJob.companyName}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {newJob.jobType}
                    </span>
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {newJob.location}
                    </span>
                    {newJob.salary && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {newJob.salary}
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <h4 className="font-medium text-sm">Description:</h4>
                    <p className="text-gray-700 text-sm mt-1 line-clamp-2">{newJob.description}</p>
                  </div>
                  {newJob.deadline && (
                    <div className="mt-2 text-xs text-gray-600">
                      Application Deadline: {new Date(newJob.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminNewJobs;
