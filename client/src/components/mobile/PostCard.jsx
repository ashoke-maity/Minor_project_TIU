import { React, useState, useEffect } from "react";
import {
  Calendar,
  Briefcase,
  Heart,
  MessageCircle,
  Bookmark,
  MapPin,
  Clock,
  FileText,
  Maximize2,
  X,
  Trash2,
  Users,
} from "lucide-react";
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
  const [liked, setLiked] = useState(data?.isLiked || false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(data?.likes?.length || 0);
  const [likedUsers, setLikedUsers] = useState(data?.likes || []);
  const [commentVisible, setCommentVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(data?.comments || []);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Get user information with fallbacks
  const userInfo = data.User || data.userId || {};
  const firstName = userInfo.FirstName || "";
  const lastName = userInfo.LastName || "";
  const initials =
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";
  const fullName =
    firstName && lastName ? `${firstName} ${lastName}` : "Anonymous User";
  const passoutYear = userInfo.PassoutYear;

  // Check if post is already liked/saved by current user
  useEffect(() => {
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
        const userId = response.data.user._id;
        setCurrentUserId(userId);
        setSaved(
          data.savedBy
            ?.map((id) => String(id))
            .includes(String(userId)) || false
        );
        setLiked(data?.isLiked || false);
      } catch (err) {
        console.error("Error checking user interactions:", err);
      }
    };
    checkUserInteractions();
  }, [data.savedBy, data.isLiked]);

  // Interaction handlers
  const handleLike = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_USER_API_URL}/user/like/post/${data._id}`,
        { userId: currentUserId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      // Update the like status based on the response
      setLiked(response.data.isLiked);
      setLikeCount(response.data.likeCount);
      setLikedUsers(response.data.likedUsers || []);
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
          _id: response.data.comment._id,
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
        `${import.meta.env.VITE_USER_API_URL}/user/delete/comment/${
          data._id
        }/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.data.status === 1) {
        setComments(comments.filter((comment) => comment._id !== commentId));
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
          <div className="font-medium">
            {jobTitle} at {companyName}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {location && (
            <div className="flex items-center text-gray-600 text-xs">
              <MapPin size={12} className="mr-1" /> {location}
            </div>
          )}
          {jobType && (
            <div className="flex items-center text-gray-600 text-xs">
              <Briefcase size={12} className="mr-1" /> {jobType}
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
        {eventName && <div className="font-medium">{eventName}</div>}

        <div className="flex flex-wrap gap-2">
          {eventDate && (
            <div className="flex items-center text-gray-600 text-xs">
              <Calendar size={12} className="mr-1" />
              {(() => {
                try {
                  return new Date(eventDate).toLocaleDateString();
                } catch (e) {
                  return "Upcoming";
                }
              })()}
            </div>
          )}
          {location && (
            <div className="flex items-center text-gray-600 text-xs">
              <MapPin size={12} className="mr-1" /> {location}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderLikedUsers = () => {
    if (!likedUsers || likedUsers.length === 0) return null;
    
    const currentUserLiked = likedUsers.some(
      (user) => user?._id === currentUserId
    );
    const otherLikedUsers = likedUsers.filter(
      (user) => user?._id !== currentUserId
    );
    
    return (
      <div className="mt-2 text-sm text-gray-600">
        {currentUserLiked && <span className="font-medium">You</span>}
        {currentUserLiked && otherLikedUsers.length > 0 && " and "}
        {otherLikedUsers.length > 0 && (
          <button
            onClick={() => setShowLikesModal(true)}
            className="text-teal-600 hover:text-teal-700 hover:underline"
          >
            {otherLikedUsers.length === 1
              ? `${otherLikedUsers[0].FirstName} ${otherLikedUsers[0].LastName}`
              : `${otherLikedUsers[0].FirstName} ${otherLikedUsers[0].LastName} and ${otherLikedUsers.length - 1} others`}
          </button>
        )}
        {" liked this post"}
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
            <span className="text-xs text-gray-500 flex-shrink-0 ml-1">
              {postDate}
            </span>
          </div>
          {passoutYear && (
            <p className="text-xs text-gray-500">Class of {passoutYear}</p>
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

      {/* Media content - Show first for media posts */}
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

      {/* Post content - Show after media */}
      <div className="text-gray-700 whitespace-pre-line text-sm mt-3">
        {data.content || data.Content || ""}
      </div>

      {/* Job or event details */}
      {renderJobDetails()}
      {renderEventDetails()}

      {/* Social interaction buttons */}
      <div className="mt-4 border-t border-gray-100 pt-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            disabled={isLoading}
            className={`flex items-center space-x-1 text-sm ${
              liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
          >
            <Heart size={18} className={liked ? "fill-current" : ""} />
            <span>{likeCount}</span>
          </button>
          <button
            onClick={handleToggleComments}
            disabled={isLoading}
            className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 text-sm"
          >
            <MessageCircle size={18} />
            <span>{comments.length}</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`flex items-center space-x-1 text-sm ${
              saved ? "text-teal-500" : "text-gray-500 hover:text-teal-500"
            }`}
          >
            <Bookmark size={18} className={saved ? "fill-current" : ""} />
          </button>
        </div>
        {renderLikedUsers()}
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
                          {new Date(comment.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
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

      {/* Likes Modal */}
      {showLikesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center">
                <Users size={20} className="mr-2 text-teal-500" />
                Liked by
              </h3>
              <button
                onClick={() => setShowLikesModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(80vh-4rem)]">
              <div className="divide-y">
                {likedUsers.map((user) => (
                  <div key={user._id} className="p-4 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-semibold text-lg mr-3">
                      {user.FirstName[0]}
                      {user.LastName[0]}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {user.FirstName} {user.LastName}
                      </h4>
                      <p className="text-sm text-gray-500">{user.Email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Modal */}
      {showMediaModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setShowMediaModal(false)}
        >
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
    </div>
  );
}

export default PostCard;
