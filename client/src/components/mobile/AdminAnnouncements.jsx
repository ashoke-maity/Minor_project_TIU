import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, MegaphoneIcon } from 'lucide-react';

const MobileAdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        
        // Fetch announcements from the API
        const res = await axios.get(
          `${import.meta.env.VITE_USER_API_URL}/view/admin/announcements`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        if (res.data && (res.data.announcements || res.data.data)) {
          setAnnouncements(res.data.announcements || res.data.data);
        } else {
          setAnnouncements([]);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setError("Could not load announcements");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Format date to show how long ago
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes} min ago`;
      }
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 animate-pulse mb-4">
        <div className="flex items-center mb-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full"></div>
          <div className="ml-2 h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
        <div className="text-red-500 text-center text-sm">{error}</div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return null; // Don't show anything if there are no announcements
  }

  return (
    <div className="mb-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-2 px-4">
          <h2 className="text-white text-sm font-semibold flex items-center">
            <Bell size={16} className="mr-2" />
            Announcements
          </h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {announcements.slice(0, 3).map((announcement) => (
            <div key={announcement._id} className="p-3 hover:bg-blue-50 transition-colors">
              <div className="flex items-start">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0">
                  <MegaphoneIcon size={14} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-800 text-sm">{announcement.title}</h3>
                    <span className="text-xs text-gray-500 ml-1">{formatTimeAgo(announcement.createdAt)}</span>
                  </div>
                  <p className="text-gray-600 text-xs mt-1">{announcement.content}</p>
                  {announcement.link && (
                    <a 
                      href={announcement.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 text-xs mt-1 inline-block hover:underline"
                    >
                      Read more
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {announcements.length > 3 && (
          <div className="px-4 py-2 text-center border-t border-gray-100">
            <button className="text-blue-600 text-xs font-medium hover:underline">
              View all announcements
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileAdminAnnouncements;