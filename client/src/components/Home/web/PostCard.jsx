import { React, useState } from "react";
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
  Users,
} from "lucide-react";

function PostCard({ post, job, currentUserId, hideInteractions }) {
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
  const [liked, setLiked] = useState(post.isLiked || false);
  const [saved, setSaved] = useState(data?.savedBy?.includes(currentUserId));
  const [likeCount, setLikeCount] = useState(data?.likes?.length || 0);
  const [likedUsers, setLikedUsers] = useState(data?.likes || []);
  const [commentVisible, setCommentVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(data?.comments || []);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);

  const handleLike = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_USER_API_URL}/user/like/post/${data._id}`,
        { userId: currentUserId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the like status based on the response
      setLiked(response.data.isLiked);
      setLikeCount(response.data.likeCount);
      setLikedUsers(response.data.likedUsers || []);
    } catch (err) {
      console.error("Like toggle failed", err);
    }
  };

  // Toggle comment visibility
  const handleToggleComments = () => {
    setCommentVisible(!commentVisible);
  };

  // Function to post a new comment
  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${import.meta.env.VITE_USER_API_URL}/user/comment/post/${data._id}`,
        {
          commentText: newComment.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add returned comment to state
      if (response.data.comment) {
        const updatedComments = [...comments, response.data.comment];
        setComments(updatedComments);
        setNewComment("");
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
      // Show error message to user
      alert("Failed to post comment. Please try again.");
    }
  };

  // Function to delete a comment
  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `${import.meta.env.VITE_USER_API_URL}/user/delete/comment/${
          data._id
        }/${commentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("authToken");
    const url = saved
      ? `${import.meta.env.VITE_USER_API_URL}/user/unsave/post/${data._id}`
      : `${import.meta.env.VITE_USER_API_URL}/user/save/post/${data._id}`;
    try {
      const response = await axios.post(
        url,
        { userId: currentUserId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSaved(!saved);
    } catch (err) {
      console.error("Save toggle failed", err);
    }
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
              : `${otherLikedUsers[0].FirstName} ${
                  otherLikedUsers[0].LastName
                } and ${otherLikedUsers.length - 1} others`}
          </button>
        )}
        {" liked this post"}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-4">
      {/* Post header */}
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 text-white flex items-center justify-center text-base font-semibold">
          {initials}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {fullName}
              </h3>
              <p className="text-xs text-gray-500">
                {passoutYear ? `Class of ${passoutYear}` : ""} • {postDate}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Media content - Show first */}
      {data.media && data.media.length > 0 && (
        <div className="mt-3">
          {data.media.map((media, index) => (
            <div key={index} className="relative">
              {media.type.startsWith("image/") ? (
                <img
                  src={media.url}
                  alt={`Post media ${index + 1}`}
                  className="rounded-lg w-full object-cover cursor-pointer"
                  onClick={() => setShowMediaModal(true)}
                />
              ) : media.type.startsWith("video/") ? (
                <video src={media.url} controls className="rounded-lg w-full" />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <FileText size={20} className="text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {media.name || "Document"}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Add this block for single mediaUrl support */}
      {data.mediaUrl && (
        <div className="mt-3">
          <img
            src={data.mediaUrl}
            alt="Post media"
            className="rounded-lg max-h-72 w-full object-cover"
            onClick={() => setShowMediaModal(true)}
          />
        </div>
      )}

      {/* Post content - Show after media */}
      <div className="mt-3">
        <p className="text-sm text-gray-800 whitespace-pre-wrap">
          {data.content}
        </p>
        {renderJobDetails()}
        {renderEventDetails()}
      </div>

      {/* Interaction buttons - only show if not in editing mode */}
      {!hideInteractions && (
        <div className="mt-4 border-t border-gray-100 pt-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 text-sm ${
                liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
              }`}
            >
              <Heart size={18} className={liked ? "fill-current" : ""} />
              <span>{likeCount}</span>
            </button>
            <button
              onClick={handleToggleComments}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 text-sm"
            >
              <MessageCircle size={18} />
              <span>{comments.length}</span>
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center space-x-1 text-sm ${
                saved ? "text-teal-500" : "text-gray-500 hover:text-teal-500"
              }`}
            >
              <Bookmark size={18} className={saved ? "fill-current" : ""} />
            </button>
          </div>
          {renderLikedUsers()}
        </div>
      )}

      {/* Comments section - only show if not in editing mode */}
      {!hideInteractions && commentVisible && (
        <div className="mt-4 space-y-3">
          {/* Comment input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 text-sm border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <button
              onClick={handlePostComment}
              className="px-4 py-2 bg-teal-500 text-white rounded-full text-sm font-medium hover:bg-teal-600 transition-colors duration-200"
            >
              Post
            </button>
          </div>

          {/* Comments list */}
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment._id} className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 text-white flex items-center justify-center text-xs font-semibold">
                  {comment.userId?.FirstName?.[0]}
                  {comment.userId?.LastName?.[0]}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">
                      {comment.userId?.FirstName} {comment.userId?.LastName}
                    </p>
                    <p className="text-sm text-gray-700">
                      {comment.commentText}
                    </p>
                  </div>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {getFormattedDate(comment.createdAt)}
                    </span>
                    {comment.userId?._id === currentUserId && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-xs text-red-500 hover:text-red-600"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Media modal */}
      {showMediaModal && data.media && data.media.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setShowMediaModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X size={24} />
            </button>
            <img
              src={data.media[0].url}
              alt="Post media"
              className="max-h-[80vh] w-full object-contain"
            />
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
    </div>
  );
}

export default PostCard;
