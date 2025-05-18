import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import MobileSidebar from '../components/admin/MobileSidebar';
import Header from '../components/admin/Header';
import EventForm from '../pages/EventForm';

const adminRoute = import.meta.env.VITE_ADMIN_ROUTE;

const AdminNewEvent = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [newEvent, setNewEvent] = useState(null);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleEventSubmit = (eventData) => {
    // Store the newly created event
    setNewEvent(eventData);
    
    // Show success popup
    setShowSuccess(true);

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
      // Navigate back to the events page
      navigate(`${adminRoute}/admin/dashboard/events`);
    }, 3000);
  };

  return (
    <div className="admin-layout bg-gray-50 min-h-screen flex">
      <Sidebar />
      <MobileSidebar />
      <main className="wrapper mt-5 flex-1 px-4">
        <header className="header mb-2">
          <Header title="Add Events" description="Add New Events" />
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
        <EventForm onSubmitSuccess={handleEventSubmit} />

        {/* Display newly added event */}
        {newEvent && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Recently Added Event</h2>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {newEvent.mediaUrl && (
                  <div className="w-full md:w-1/3 lg:w-1/4">
                    {newEvent.media?.type?.startsWith('video') ? (
                      <video 
                        src={newEvent.mediaUrl}
                        controls
                        className="w-full h-auto rounded-lg object-cover"
                      />
                    ) : (
                      <img 
                        src={newEvent.mediaUrl} 
                        alt={newEvent.eventName} 
                        className="w-full h-auto rounded-lg object-cover"
                      />
                    )}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{newEvent.eventName}</h3>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <div className="flex items-center gap-1 text-gray-700">
                      <img src="/icons/calendar.svg" alt="Date" className="w-4 h-4" />
                      <span>{new Date(newEvent.eventDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-700">
                      <img src="/icons/map-pin.svg" alt="Location" className="w-4 h-4" />
                      <span>{newEvent.eventLocation}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-medium text-sm text-gray-700">Description:</h4>
                    <p className="text-gray-600 mt-1 line-clamp-3">{newEvent.eventDescription}</p>
                  </div>
                  {newEvent.eventSummary && (
                    <div className="mt-3">
                      <h4 className="font-medium text-sm text-gray-700">Summary:</h4>
                      <p className="text-gray-600 mt-1 line-clamp-2">{newEvent.eventSummary}</p>
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

export default AdminNewEvent;
