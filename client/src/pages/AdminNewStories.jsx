import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import MobileSidebar from '../components/admin/MobileSidebar';
import Header from '../components/admin/Header';
import StoryForm from './StoryForm';

const adminRoute = import.meta.env.VITE_ADMIN_ROUTE;

const AdminNewStories = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [newStory, setNewStory] = useState(null);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleStorySubmit = (storyData) => {
    // Store the newly created story
    setNewStory(storyData);
    
    // Show success popup
    setShowSuccess(true);

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
      // Navigate back to the stories page
      navigate(`${adminRoute}/admin/dashboard/stories`);
    }, 3000);
  };

  return (
    <div className="admin-layout bg-gray-50 min-h-screen flex">
      <Sidebar />
      <MobileSidebar />
      <main className="wrapper mt-5 flex-1 px-4">
        <header className="header mb-2">
          <Header title="Add Stories" description="Add New Stories To The User Dashboard" />
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
                <span>Story added successfully!</span>
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

        {/* Story Form Card */}
        <StoryForm onSubmitSuccess={handleStorySubmit} />

        {/* Display newly added story */}
        {newStory && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Recently Added Story</h2>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {newStory.mediaUrl && (
                  <div className="w-full md:w-1/3 lg:w-1/4">
                    {newStory.media?.type?.startsWith('video') ? (
                      <video 
                        src={newStory.mediaUrl}
                        controls
                        className="w-full h-auto rounded-lg object-cover"
                      />
                    ) : (
                      <img 
                        src={newStory.mediaUrl} 
                        alt={newStory.title} 
                        className="w-full h-auto rounded-lg object-cover"
                      />
                    )}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{newStory.title}</h3>
                  <p className="text-gray-600 italic">By {newStory.author}</p>
                  
                  {newStory.tags && newStory.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {newStory.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <p className="text-gray-700 line-clamp-4">{newStory.storyBody}</p>
                  </div>
                  
                  {newStory.createdAt && (
                    <div className="mt-3 text-xs text-gray-500">
                      Posted on {new Date(newStory.createdAt).toLocaleDateString()}
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

export default AdminNewStories;
