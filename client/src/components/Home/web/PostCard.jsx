import React from "react";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
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
} from "lucide-react";

function PostCard({ post, job }) {
  // Determine if we're rendering a job or a regular post
  const data = job || post;

  if (!data) return null;

  // Format the date
  const getFormattedDate = (dateString) => {
    try {
      if (!dateString) return "Recently";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Recently"; // Invalid date
      return formatDistanceToNow(date, { addSuffix: true });
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
  const postDate = getFormattedDate(data.createdAt || data.Date || new Date());
  const [liked, setLiked] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(data?.likes?.length || 0);
  const [commentVisible, setCommentVisible] = React.useState(false);
  const [newComment, setNewComment] = React.useState("");
  const [comments, setComments] = React.useState(data?.comments || []);
  const [showMediaModal, setShowMediaModal] = React.useState(false);

  const handleLike = () => {
    // Temporarily remove backend call for testing animations
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleToggleComments = () => {
    setCommentVisible(!commentVisible);
  };

  const handleSave = () => {
    // Temporarily remove backend call for testing animations
    setSaved(!saved);
  };

  // Get user information - handle both formats that might exist in the data
  const userInfo = data.User || data.userId || {};
  const firstName = userInfo.FirstName || "";
  const lastName = userInfo.LastName || "";
  const initials =
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";
  const fullName =
    firstName && lastName ? `${firstName} ${lastName}` : "Anonymous User";
  const passoutYear = userInfo.PassoutYear;

  // Helper to render job details if it's a job post
  const renderJobDetails = () => {
    if (postType !== "job") return null;

    const jobData = data.extraData ? data.extraData : data;
    const jobTitle = jobData.jobTitle || data.jobTitle || "";
    const companyName = jobData.companyName || data.companyName || "";
    const location = jobData.location || data.location || "";
    const jobType = jobData.jobType || data.jobType || "";
    const salary = jobData.salary || data.salary || "";
    const deadline = jobData.deadline || data.deadline || null;
    return (
      <div className="mt-3 space-y-2 text-sm">
        {jobTitle && companyName && (
          <div className="font-medium">
            {jobTitle} at {companyName}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {location && (
            <div className="flex items-center text-gray-600">
              <MapPin size={14} className="mr-1" /> {location}
            </div>
          )}
          {jobType && (
            <div className="flex items-center text-gray-600">
              <Briefcase size={14} className="mr-1" /> {jobType}
            </div>
          )}
          {salary && (
            <div className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full text-xs font-medium">
              {salary}
            </div>
          )}
        </div>

        {deadline && (
          <div className="flex items-center text-amber-600 text-xs">
            <Clock size={14} className="mr-1" />
            Application deadline:{" "}
            {(() => {
              try {
                return new Date(deadline).toLocaleDateString();
              } catch (e) {
                return "Available";
              }
            })()}
          </div>
        )}
      </div>
    );
  };

  // Helper to render event details if it's an event post
  const renderEventDetails = () => {
    if (postType !== "event") return null;

    const eventData = data.extraData || {};
    const eventName = eventData.eventName || "";
    const eventDate = eventData.eventDate || null;
    const location = eventData.location || "";
    const summary = eventData.summary || "";

    return (
      <div className="mt-3 space-y-2 text-sm">
        {eventName && <div className="font-medium">{eventName}</div>}

        <div className="flex flex-wrap gap-3">
          {eventDate && (
            <div className="flex items-center text-gray-600">
              <Calendar size={14} className="mr-1" />
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
            <div className="flex items-center text-gray-600">
              <MapPin size={14} className="mr-1" /> {location}
            </div>
          )}
        </div>

        {summary && (
          <div className="text-gray-700 bg-gray-50 p-2 rounded-md text-xs">
            {summary}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Post header with user info and date */}
      <div className="flex items-start space-x-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-800 truncate">{fullName}</h3>
            <span className="text-xs text-gray-500">{postDate}</span>
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
            <span className="inline-flex items-center text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
              <Briefcase size={12} className="mr-1" /> Job
            </span>
          )}
          {postType === "event" && (
            <span className="inline-flex items-center text-xs px-2 py-1 bg-amber-50 text-amber-600 rounded-full">
              <Calendar size={12} className="mr-1" /> Event
            </span>
          )}
          {postType === "media" && (
            <span className="inline-flex items-center text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded-full">
              <FileText size={12} className="mr-1" /> Media
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
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-xl overflow-hidden">
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
          className={`flex items-center text-gray-500 hover:text-teal-500 transition-all duration-300 py-1 px-2 rounded-lg ${
            liked ? 'bg-teal-50 text-teal-500 scale-110' : 'hover:bg-teal-50'
          }`}
        >
          <Heart 
            size={18} 
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
          className={`flex items-center text-gray-500 hover:text-teal-500 transition-all duration-300 py-1 px-2 rounded-lg ${
            commentVisible ? 'bg-teal-50 text-teal-500' : 'hover:bg-teal-50'
          }`}
        >
          <MessageCircle size={18} className="mr-1" />
          <span className="text-xs">Comment ({comments.length})</span>
        </button>
        <button
          onClick={handleSave}
          className={`flex items-center text-gray-500 hover:text-teal-500 transition-all duration-300 py-1 px-2 rounded-lg ${
            saved ? 'bg-teal-50 text-teal-500 scale-110' : 'hover:bg-teal-50'
          }`}
        >
          <Bookmark 
            size={18} 
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
              comments.map((comment, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-2 bg-gray-50 p-3 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {comment.user?.[0] || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-gray-800">
                        {comment.user || "User"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No comments yet. Be the first to comment!
              </div>
            )}

            {/* New Comment Input */}
            <div className="flex items-center space-x-2 mt-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                />
                <button
                  onClick={() => {
                    if (newComment.trim()) {
                      setComments([
                        ...comments,
                        { 
                          user: fullName, 
                          text: newComment,
                          timestamp: new Date()
                        },
                      ]);
                      setNewComment("");
                    }
                  }}
                  className="bg-teal-500 text-white px-4 py-2 rounded-full text-sm hover:bg-teal-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
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
