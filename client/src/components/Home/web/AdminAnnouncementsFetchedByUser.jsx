import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, MegaphoneIcon } from 'lucide-react';

const AdminAnnouncements = () => {
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
        
        if (res.data && res.data.data) {
          setAnnouncements(res.data.data);
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
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 animate-pulse">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-teal-100 rounded-full"></div>
          <div className="ml-3 h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return null; // Don't show anything if there are no announcements
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 mb-5">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-3 px-5">
        <h2 className="text-white font-semibold flex items-center">
          <Bell size={18} className="mr-2" />
          Announcements from Admin
        </h2>
      </div>
      
      <div className="divide-y divide-gray-100">
        {announcements.map((announcement) => (
          <div key={announcement._id} className="p-4 hover:bg-blue-50 transition-colors">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                <MegaphoneIcon size={16} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-800">{announcement.title}</h3>
                  <span className="text-xs text-gray-500">{formatTimeAgo(announcement.createdAt)}</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">{announcement.content}</p>
                {announcement.link && (
                  <a 
                    href={announcement.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 text-xs mt-2 inline-block hover:underline"
                  >
                    Read more
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAnnouncements;