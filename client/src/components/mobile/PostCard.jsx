import React from "react";
import { Calendar, Briefcase, Heart, MessageCircle, Save, MapPin, Clock, FileText } from "lucide-react";

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
  
  // Get user information with fallbacks
  const userInfo = data.User || data.userId || {};
  const firstName = userInfo.FirstName || "";
  const lastName = userInfo.LastName || "";
  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : "Anonymous User";
  const passoutYear = userInfo.PassoutYear;

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
    <div>
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
        <div className="mt-2 rounded-lg overflow-hidden bg-gray-100">
          <img 
            src={data.mediaUrl} 
            alt="Post media" 
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Job or event details */}
      {renderJobDetails()}
      {renderEventDetails()}
      
      {/* Social interaction buttons */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
        <button className="flex items-center text-gray-500 hover:text-teal-500 transition-colors py-1 px-2">
          <Heart size={16} className="mr-1" />
          <span className="text-xs">Like</span>
        </button>
        <button className="flex items-center text-gray-500 hover:text-teal-500 transition-colors py-1 px-2">
          <MessageCircle size={16} className="mr-1" />
          <span className="text-xs">Comment</span>
        </button>
        <button className="flex items-center text-gray-500 hover:text-teal-500 transition-colors py-1 px-2">
          <Save size={16} className="mr-1" />
          <span className="text-xs">Save</span>
        </button>
      </div>
    </div>
  );
}

export default PostCard; 