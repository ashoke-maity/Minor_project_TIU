import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../components/admin/Sidebar'
import MobileSidebar from '../components/admin/MobileSidebar'
import Header from '../components/admin/Header'
import StoryForm from './StoryForm'

const adminRoute = import.meta.env.VITE_ADMIN_ROUTE
const apiBaseUrl = import.meta.env.VITE_ADMIN_API_URL

const AdminStories = () => {
  const navigate = useNavigate()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editStoryId, setEditStoryId] = useState(null)
  const [editStory, setEditStory] = useState(null)

  // Listen for newly created stories from localStorage
  useEffect(() => {
    // Set up a listener to check localStorage for new stories
    const checkForNewStories = () => {
      try {
        const savedStories = localStorage.getItem('createdStories');
        if (savedStories) {
          const parsedStories = JSON.parse(savedStories);
          if (Array.isArray(parsedStories) && parsedStories.length > 0) {
            // Only update if we have stories and they're different from current state
            if (stories.length === 0 || JSON.stringify(stories) !== JSON.stringify(parsedStories)) {
              setStories(parsedStories);
            }
          }
        }
      } catch (e) {
        console.error("Error checking localStorage stories:", e);
      }
    };

    // Check immediately
    checkForNewStories();
    
    // Also set up an interval to check periodically
    const intervalId = setInterval(checkForNewStories, 2000);
    
    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [stories]);

  const fetchStories = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("authToken")
      // First check localStorage for stories
      const savedStories = localStorage.getItem('createdStories');
      if (savedStories) {
        const parsedStories = JSON.parse(savedStories);
        if (Array.isArray(parsedStories) && parsedStories.length > 0) {
          setStories(parsedStories);
          setError(null);
          setLoading(false);
          return;
        }
      }
      // Fetch from API
      const response = await axios.get(`${apiBaseUrl}/admin/view/stories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Handle different possible response structures
      let storiesData = []
      if (response.data.stories) {
        storiesData = response.data.stories
      } else if (response.data.data && Array.isArray(response.data.data)) {
        storiesData = response.data.data
      } else if (Array.isArray(response.data)) {
        storiesData = response.data
      }
      
      setStories(storiesData)
      setError(null)
    } catch (err) {
      console.error("Error fetching stories:", err)
      // Set empty array instead of error
      setStories([])
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStories()
  }, [])

  const handleAddStoryClick = () => {
    navigate(`${adminRoute}/admin/dashboard/addStories`)
  }

  const handleDeleteStory = async (storyId) => {
    if (!window.confirm("Are you sure you want to delete this story?")) {
      return
    }
    
    try {
      const token = localStorage.getItem("authToken")
      // Try to delete from API
      try {
        await axios.delete(
          `${apiBaseUrl}/admin/delete/story/${storyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
      } catch (error) {
        console.error("API delete failed, removing from local state only:", error);
        return { success: false, msg: error.message };
      }
      
      // Remove from state regardless of API success
      setStories(stories.filter(story => story._id !== storyId))
      
      // Also update localStorage
      try {
        const savedStories = JSON.parse(localStorage.getItem('createdStories') || '[]');
        const updatedStories = savedStories.filter(story => story._id !== storyId);
        localStorage.setItem('createdStories', JSON.stringify(updatedStories));
      } catch (err) {
        console.error("Error updating localStorage after deletion:", err);
      }
      
      alert("Story deleted successfully")
    } catch (err) {
      console.error("Error deleting story:", err)
      alert("Failed to delete story. Please try again.")
    }
  }

  const handleEditStory = (story) => {
    setEditStoryId(story._id || story.id);
    setEditStory(story);
  }

  const handleCancelEdit = () => {
    setEditStoryId(null);
    setEditStory(null);
  }

  const handleEditStorySuccess = (updatedStory) => {
    setStories((prevStories) => prevStories.map((s) => (s._id === updatedStory._id ? updatedStory : s)));
    setEditStoryId(null);
    setEditStory(null);
  }

  return (
    <div className="admin-layout bg-gray-50 min-h-screen flex">
      <Sidebar />
      <MobileSidebar />
      <main className="wrapper mt-5 flex-1 px-4">
        <header className="header mb-4">
          <Header 
            title="Manage Stories"
            description="Filter, sort and add new stories to the user dashboard"
          />
        </header>

        <div className="mb-6 rounded-xl bg-white shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-gray-800">Add Story</h3>
            <button
              onClick={handleAddStoryClick}
              className="bg-primary-100 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-100/80 transition"
            >
              + Add a New Story
            </button>
          </div>
        </div>

        {/* Story Listings Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Story Listings</h3>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-100"></div>
            </div>
          ) : error || stories.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <p className="text-gray-600">No stories have been posted yet.</p>
              <button
                onClick={handleAddStoryClick}
                className="mt-4 bg-primary-100 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-100/80 transition"
              >
                + Add Your First Story
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stories.map(story => (
                <div key={story._id || story.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  {(editStoryId === (story._id || story.id)) ? (
                    <StoryForm
                      story={editStory}
                      editMode
                      onSubmitSuccess={handleEditStorySuccess}
                      onCancel={handleCancelEdit}
                    />
                  ) : (
                    <>
                      {(story.mediaUrl || story.media) && (
                        <div className="w-full h-48 overflow-hidden">
                          {(story.mediaUrl && story.mediaUrl.match(/\/video\/|\.(mp4|webm|ogg)$/i)) ? (
                            <video 
                              src={story.mediaUrl || story.media}
                              className="w-full h-full object-cover"
                              controls
                            />
                          ) : (
                            <img 
                              src={story.mediaUrl || story.media} 
                              alt={story.title} 
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-800">{story.title}</h3>
                        <p className="text-gray-600 italic">By {story.author}</p>
                        
                        {story.tags && story.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {story.tags.map((tag, index) => (
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
                          <p className="text-gray-600 text-sm line-clamp-3">{story.storyBody}</p>
                        </div>
                        
                        {story.createdAt && (
                          <div className="mt-2 text-xs text-gray-500">
                            Posted on {new Date(story.createdAt).toLocaleDateString()}
                          </div>
                        )}
                        
                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end gap-2">
                          <button 
                            onClick={() => handleEditStory(story)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteStory(story._id || story.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminStories
