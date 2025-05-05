import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import MobileSidebar from '../components/admin/MobileSidebar';
import Header from '../components/admin/Header';
import JobForm from './JobForm';
import StoryForm from './StoryForm';


const AdminNewStories = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleStorySubmit = () => {
    // Show success popup
    setShowSuccess(true);

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="admin-layout bg-gray-50 min-h-screen flex">
      <Sidebar />
      <MobileSidebar />
      <main className="wrapper mt-5 flex-1 px-4">
        <header className="header mb-2">
          <Header title="Add Stories" description="Add New Stories To The User Dasboard" />
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
                <span>Event added successfully!</span>
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

        {/* 🧾 Event Form Card */}
        <StoryForm onSubmitSuccess={handleStorySubmit} />
      </main>
    </div>
  );
};

export default AdminNewStories;
