import React from "react";
import { Calendar, Briefcase, Heart, MessageCircle, Bookmark, MapPin, Clock, FileText, Maximize2, X, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";

function PostCard({ post, job }) {
  // Determine if we're rendering a job or a regular post
  const data = job || post;
  
  if (!data) return null;

  // Format the date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Recently";
      
      // Simple relative time function
      const now = new Date();
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
    } catch (error) {
      return "Recently";
    }
  };

  // Get the post type
  const getPostType = () => {
    if (job) return "job";
    if (post?.postType) return post.postType;
    return "regular";
  };

  const postType = getPostType();
  const postDate = formatDate(data.createdAt || data.Date || new Date());
  
  // Add state for interactions
  const [liked, setLiked] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(data?.likes?.length || 0);
  const [commentVisible, setCommentVisible] = React.useState(false);
  const [newComment, setNewComment] = React.useState("");
  const [comments, setComments] = React.useState(data?.comments || []);
  const [showMediaModal, setShowMediaModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Get user information with fallbacks
  const userInfo = data.User || data.userId || {};
  const firstName = userInfo.FirstName || "";
  const lastName = userInfo.LastName || "";
  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : "Anonymous User";
  const passoutYear = userInfo.PassoutYear;

  // Check if post is already liked/saved by current user
  React.useEffect(() => {
    const checkUserInteractions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_USER_API_URL}/user/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        const currentUserId = response.data.user._id;
        setLiked(data.likes?.includes(currentUserId) || false);
        setSaved(data.savedBy?.includes(currentUserId) || false);
      } catch (err) {
        console.error("Error checking user interactions:", err);
      }
    };
    checkUserInteractions();
  }, [data]);

  // Interaction handlers
  const handleLike = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_USER_API_URL}/user/like/post/${data._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.data.status === 1) {
        setLiked(!liked);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComments = () => {
    setCommentVisible(!commentVisible);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_USER_API_URL}/user/save/post/${data._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.data.status === 1) {
        setSaved(!saved);
      }
    } catch (error) {
      console.error("Error saving post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_USER_API_URL}/user/comment/post/${data._id}`,
        { text: newComment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.data.status === 1) {
        const newCommentObj = {
          user: fullName,
          text: newComment,
          timestamp: new Date(),
          _id: response.data.comment._id
        };
        setComments([...comments, newCommentObj]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      setIsLoading(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_USER_API_URL}/user/delete/comment/${data._id}/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.data.status === 1) {
        setComments(comments.filter(comment => comment._id !== commentId));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to render job details
  const renderJobDetails = () => {
    if (postType !== "job") return null;
    
    const jobData = data.extraData || data;
    const jobTitle = jobData.jobTitle || "";
    const companyName = jobData.companyName || "";
    const location = jobData.location || "";
    const jobType = jobData.jobType || "";
    const salary = jobData.salary || "";
    
    return (
      <div className="mt-2 space-y-1 text-sm">
        {jobTitle && companyName && (
          <div className="font-medium">{jobTitle} at {companyName}</div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {location && (
            <div className="flex items-center text-gray-600 text-xs">
              <MapPin size={12} className="mr-1"/> {location}
            </div>
          )}
          {jobType && (
            <div className="flex items-center text-gray-600 text-xs">
              <Briefcase size={12} className="mr-1"/> {jobType}
            </div>
          )}
          {salary && (
            <div className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full text-xs">
              {salary}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Helper to render event details
  const renderEventDetails = () => {
    if (postType !== "event") return null;
    
    const eventData = data.extraData || {};
    const eventName = eventData.eventName || "";
    const eventDate = eventData.eventDate || null;
    const location = eventData.location || "";
    
    return (
      <div className="mt-2 space-y-1 text-sm">
        {eventName && (
          <div className="font-medium">{eventName}</div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {eventDate && (
            <div className="flex items-center text-gray-600 text-xs">
              <Calendar size={12} className="mr-1"/> 
              {
                (() => {
                  try {
                    return new Date(eventDate).toLocaleDateString();
                  } catch (e) {
                    return "Upcoming";
                  }
                })()
              }
            </div>
          )}
          {location && (
            <div className="flex items-center text-gray-600 text-xs">
              <MapPin size={12} className="mr-1"/> {location}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
      {/* Post header with user info and date */}
      <div className="flex items-start space-x-2 mb-2">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-800 text-sm truncate">
              {fullName}
            </h3>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-1">{postDate}</span>
          </div>
          {passoutYear && (
            <p className="text-xs text-gray-500">
              Class of {passoutYear}
            </p>
          )}
        </div>
      </div>

      {/* Post type indicator */}
      {postType !== "regular" && (
        <div className="mb-2">
          {postType === "job" && (
            <span className="inline-flex items-center text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
              <Briefcase size={10} className="mr-1" /> Job
            </span>
          )}
          {postType === "event" && (
            <span className="inline-flex items-center text-xs px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full">
              <Calendar size={10} className="mr-1" /> Event
            </span>
          )}
          {postType === "media" && (
            <span className="inline-flex items-center text-xs px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full">
              <FileText size={10} className="mr-1" /> Media
            </span>
          )}
        </div>
      )}

      {/* Post content */}
      <div className="text-gray-700 whitespace-pre-line text-sm">
        {data.content || data.Content || ""}
      </div>

      {/* Media content */}
      {data.mediaUrl && (
        <div className="mt-3 rounded-lg overflow-hidden bg-gray-100 relative">
          <img 
            src={data.mediaUrl} 
            alt="Post media" 
            className="w-full h-auto object-cover"
          />
          <button
            onClick={() => setShowMediaModal(true)}
            className="absolute bottom-3 right-3 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all duration-300"
          >
            <Maximize2 size={18} />
          </button>
        </div>
      )}

      {/* Media Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={() => setShowMediaModal(false)}>
          <div className="relative w-full h-full bg-white rounded-xl overflow-hidden">
            <button 
              onClick={() => setShowMediaModal(false)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all duration-300 z-10"
            >
              <X size={24} />
            </button>
            <div className="relative w-full h-full">
              <img 
                src={data.mediaUrl} 
                alt="Post media" 
                className="w-full h-full object-contain max-h-[90vh]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Job or event details */}
      {renderJobDetails()}
      {renderEventDetails()}
      
      {/* Social interaction buttons */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
        <button
          onClick={handleLike}
          disabled={isLoading}
          className={`flex items-center text-gray-500 hover:text-teal-500 transition-all duration-300 py-1 px-2 rounded-lg ${
            liked ? 'bg-teal-50 text-teal-500 scale-110' : 'hover:bg-teal-50'
          }`}
        >
          <Heart 
            size={16} 
            className={`mr-1 transition-all duration-300 ${
              liked ? 'fill-current scale-110' : ''
            }`}
          />
          <span className="text-xs">
            {liked ? "Liked" : "Like"} ({likeCount})
          </span>
        </button>
        <button
          onClick={handleToggleComments}
          disabled={isLoading}
          className={`flex items-center text-gray-500 hover:text-teal-500 transition-all duration-300 py-1 px-2 rounded-lg ${
            commentVisible ? 'bg-teal-50 text-teal-500' : 'hover:bg-teal-50'
          }`}
        >
          <MessageCircle size={16} className="mr-1" />
          <span className="text-xs">Comment ({comments.length})</span>
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className={`flex items-center text-gray-500 hover:text-teal-500 transition-all duration-300 py-1 px-2 rounded-lg ${
            saved ? 'bg-teal-50 text-teal-500 scale-110' : 'hover:bg-teal-50'
          }`}
        >
          <Bookmark 
            size={16} 
            className={`mr-1 transition-all duration-300 ${
              saved ? 'fill-current scale-110' : ''
            }`}
          />
          <span className="text-xs">{saved ? "Saved" : "Save"}</span>
        </button>
      </div>

      {/* Comments Section */}
      {commentVisible && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="space-y-3">
            {/* Existing Comments */}
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="flex items-start space-x-2 bg-gray-50 p-3 rounded-lg"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {comment.user?.[0] || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-xs text-gray-800">
                        {comment.user || "User"}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 mt-1">{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-3 text-gray-500 text-xs">
                No comments yet. Be the first to comment!
              </div>
            )}

            {/* New Comment Input */}
            <div className="flex items-center space-x-2 mt-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  disabled={isLoading}
                  className="flex-1 border border-gray-200 rounded-full px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                />
                <button
                  onClick={handleAddComment}
                  disabled={isLoading || !newComment.trim()}
                  className="bg-teal-500 text-white px-3 py-1.5 rounded-full text-xs hover:bg-teal-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard; 