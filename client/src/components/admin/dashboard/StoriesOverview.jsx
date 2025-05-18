import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Toast } from '../../../utils';

const StoriesOverview = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const adminRoute = import.meta.env.VITE_ADMIN_ROUTE;

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("authToken");
        
        // Fetch stories data
        const res = await axios.get(
          `${import.meta.env.VITE_ADMIN_API_URL}/admin/stories`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        if (res.data && res.data.stories) {
          // Show only the latest 5 stories
          const latestStories = res.data.stories
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
          
          setStories(latestStories);
        } else {
          setStories([]);
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
        setError("Failed to load stories");
        Toast.error("Failed to load stories");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  // Format date to readable string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Truncate long text
  const truncateText = (text, maxLength = 80) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Recent Alumni Stories</h3>
        <Link
          to={`${adminRoute}/admin/dashboard/stories`}
          className="text-primary-100 text-sm hover:underline flex items-center"
        >
          Manage Stories
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
          ))}
        </div>
      ) : error ? (
        <div className="h-60 flex items-center justify-center text-red-500 bg-red-50 rounded-lg">
          <p>{error}</p>
        </div>
      ) : stories.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <img 
            src="/icons/story.png" 
            alt="No stories" 
            className="w-16 h-16 mx-auto mb-4 opacity-30"
          />
          <p>No stories have been shared yet</p>
          <Link 
            to={`${adminRoute}/admin/dashboard/stories`}
            className="text-primary-100 text-sm hover:underline mt-2 inline-block"
          >
            Create the first story
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {stories.map(story => (
            <div 
              key={story._id} 
              className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-3">
                {story.coverImage ? (
                  <img 
                    src={story.coverImage.startsWith('http') ? story.coverImage : `${import.meta.env.VITE_ADMIN_API_URL}/${story.coverImage}`} 
                    alt={story.title}
                    className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                    <img src="/icons/story.png" alt="Story" className="w-8 h-8 opacity-40" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 truncate">{story.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{truncateText(story.content)}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-primary-100">{story.author?.name || 'Anonymous'}</span>
                    <span className="text-xs text-gray-400">{formatDate(story.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* View all link */}
          {stories.length > 0 && (
            <div className="text-center pt-2">
              <Link 
                to={`${adminRoute}/admin/dashboard/stories`}
                className="text-primary-100 text-sm hover:underline inline-flex items-center"
              >
                View all stories
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StoriesOverview; 