import { React, useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import { getTokenData } from "../../../utils/helpers";
import {
  Calendar,
  Briefcase,
  Heart,
  MessageCircle,
  Bookmark,
  MapPin,
  Clock,
  FileText,
  X,
  Users,
  IndianRupee,
} from "lucide-react";

function PostCard({ post, job, hideInteractions }) {
  // Move all hooks to the top, before any return or conditional
  const [userId, setUserId] = useState(() => {
    const tokenData = getTokenData();
    return tokenData?.id || null;
  });
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likedUsers, setLikedUsers] = useState([]);
  const [commentVisible, setCommentVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [imgError, setImgError] = useState(false);

  // Always define data after hooks
  const data = job || post;

  // Sync state with data after mount
  useEffect(() => {
    if (!data || typeof data !== "object") return;
    setLiked(post?.isLiked || false);
    setSaved(data?.savedBy?.some((id) => String(id) === String(userId)) || false);
    setLikeCount(data?.likes?.length || 0);
    setLikedUsers(data?.likes || []);
    setComments(
      (data?.comments || []).map((comment) => ({
        _id: comment._id,
        text: comment.text,
        createdAt: comment.createdAt,
        userId: {
          _id: comment.userId?._id || comment.userId,
          FirstName: comment.userId?.FirstName || "",
          LastName: comment.userId?.LastName || "",
          profileImage: comment.userId?.profileImage || "",
        },
      }))
    );
  }, [data, post, userId]);

  // Effects
  useEffect(() => {
    const tokenData = getTokenData();
    if (tokenData?.id) {
      setUserId(tokenData.id);
    }
  }, []);

  // At the top of render, handle invalid data:
  if (!data || typeof data !== "object") return null;

  // Helper function for user comparison with improved type handling
  const isSameUser = (commentUserId) => {
    if (!commentUserId || !userId) {
      return false;
    }

    // Handle both string and object IDs
    const commentId =
      typeof commentUserId === "object" ? commentUserId._id : commentUserId;
    const isMatch = String(commentId).trim() === String(userId).trim();

    return isMatch;
  };

  // Format the date
  const getFormattedDate = (dateString) => {
    try {
      if (!dateString) return "Recently";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Recently"; // Invalid date
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
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

  const handleLike = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_USER_API_URL}/user/like/post/${data._id}`,
        { userId }, // Changed from currentUserId
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  // Add this after handleToggleComments and before the useEffect
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
          headers:
            {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
        }
      );

      if (response.data.comment) {
        const newCommentData = {
          _id: response.data.comment._id,
          text: response.data.comment.text,
          createdAt: response.data.comment.createdAt,
          userId: {
            _id: response.data.comment.userId._id,
            FirstName:
              response.data.comment.userDetails?.FirstName ||
              response.data.comment.userId.FirstName,
            LastName:
              response.data.comment.userDetails?.LastName ||
              response.data.comment.userId.LastName,
            profileImage:
              response.data.comment.userDetails?.profileImage ||
              response.data.comment.userId.profileImage ||
              "",
          },
        };
        console.log("google image from API", profileImage);
        setComments((prevComments) => [...prevComments, newCommentData]);
        setNewComment("");
      }
    } catch {
      console.error("Failed to post comment.");
      alert("Failed to post comment. Please try again.");
    }
  };

  // delete a Comment
  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `${import.meta.env.VITE_USER_API_URL}/user/delete/comment/${
          data._id
        }/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch {
      console.error("Failed to delete comment.");
      alert("Failed to delete comment. Please try again.");
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const url = saved
        ? `${import.meta.env.VITE_USER_API_URL}/user/unsave/post/${data._id}`
        : `${import.meta.env.VITE_USER_API_URL}/user/save/post/${data._id}`;

      const response = await axios.post(
        url,
        { userId }, // Add userId in request body
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.message) {
        setSaved(!saved);
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save/unsave post");
    }
  };

  // Get user information - handle both formats that might exist in the data
  const userInfo = data.User || data.userId || {};
  const firstName = userInfo.FirstName || "";
  const lastName = userInfo.LastName || "";
  const profileImage = userInfo.profileImage || ""; // <-- Add this line
  const initials = `${firstName?.[0] || ""}${
    lastName?.[0] || ""
  }`.toUpperCase();
  const fullName =
    firstName && lastName ? `${firstName} ${lastName}` : "Anonymous User";

  // Helper to render job details if it's a job post
  const renderJobDetails = () => {
    if (post.postType === "job" && post.jobDetails) {
      return (
        <div className="mt-4 space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              {post.jobDetails.jobTitle}
            </h3>
            <span className="px-3 py-1 text-sm font-medium text-teal-600 bg-teal-50 rounded-full">
              {post.jobDetails.jobType}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <Briefcase size={16} className="mr-2" />
            <span className="text-sm">{post.jobDetails.companyName}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <MapPin size={16} className="mr-2" />
            <span className="text-sm">{post.jobDetails.location}</span>
          </div>

          {post.jobDetails.salary && (
            <div className="flex items-center text-gray-600">
              <IndianRupee size={16} className="mr-2" />
              <span className="text-sm">{post.jobDetails.salary}</span>
            </div>
          )}

          {post.jobDetails.deadline && (
            <div className="flex items-center text-gray-600">
              <Calendar size={16} className="mr-2" />
              <span className="text-sm">
                Deadline:{" "}
                {new Date(post.jobDetails.deadline).toLocaleDateString()}
              </span>
            </div>
          )}

          {post.jobDetails.requirements && (
            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Requirements:
              </h4>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {post.jobDetails.requirements}
              </p>
            </div>
          )}
          {data.content && (
            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Description:
              </h4>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {data.content}
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Helper to render event details if it's an event post
  const renderEventDetails = () => {
    if (postType !== "event") return null;

    // Get event details from either post.eventDetails or data.eventDetails
    const eventDetails = post?.eventDetails || data?.eventDetails || {};

    return (
      <div className="mt-4 space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            {eventDetails.eventName}
          </h3>
        </div>

        {eventDetails.eventDate && (
          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-2" />
            <span className="text-sm">
              {new Date(eventDetails.eventDate).toLocaleDateString()}
            </span>
          </div>
        )}

        {eventDetails.location && (
          <div className="flex items-center text-gray-600">
            <MapPin size={16} className="mr-2" />
            <span className="text-sm">{eventDetails.location}</span>
          </div>
        )}

        {eventDetails.time && (
          <div className="flex items-center text-gray-600">
            <Clock size={16} className="mr-2" />
            <span className="text-sm">{eventDetails.time}</span>
          </div>
        )}

        {data.content && (
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Event Description:
            </h4>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {data.content}
            </p>
          </div>
        )}

        {eventDetails.summary && (
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Additional Information:
            </h4>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {eventDetails.summary}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderLikedUsers = () => {
    if (!likedUsers || likedUsers.length === 0) return null;

    const currentUserLiked = likedUsers.some(
      (user) => user?._id === userId // Changed from currentUserId
    );
    const otherLikedUsers = likedUsers.filter(
      (user) => user?._id !== userId // Changed from currentUserId
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
        <div className="bg-teal-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-semibold uppercase overflow-hidden">
          {profileImage && !imgError ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-10 h-10 object-cover rounded-full"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
            />
          ) : (
            initials || (typeof User !== 'undefined' ? <User size={20} /> : null)
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {fullName}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Media content - Show first */}
      {post && post.mediaUrl ? (
        <div className="mt-3">
          {/\.mp4|\.webm|\.ogg|\.mov$/i.test(post.mediaUrl) ? (
            <video
              src={post.mediaUrl}
              controls
              className="rounded-lg max-h-72 w-full"
            />
          ) : (
            <img
              src={post.mediaUrl}
              alt="Post media"
              className="rounded-lg max-h-72 w-full object-cover cursor-pointer"
              onClick={() => setShowMediaModal(true)}
            />
          )}
        </div>
      ) : (
        data.media && Array.isArray(data.media) && data.media.length > 0 && (
          <div className="mt-3">
            {data.media.map((media, index) => (
              <div key={index} className="relative">
                {media.type?.startsWith("image/") ? (
                  <img
                    src={media.url}
                    alt={`Post media ${index + 1}`}
                    className="rounded-lg w-full object-cover cursor-pointer"
                    onClick={() => setShowMediaModal(true)}
                  />
                ) : media.type?.startsWith("video/") ? (
                  <video
                    src={media.url}
                    controls
                    className="rounded-lg w-full"
                  />
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
        )
      )}
      {/* Post content - Show after media */}
      <div className="mt-3">
        {post && post.postType === "job" ? (
          renderJobDetails()
        ) : post && post.postType === "event" ? (
          renderEventDetails()
        ) : (
          <p className="text-sm text-gray-800 whitespace-pre-wrap">
            {data.content}
          </p>
        )}
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
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 text-white flex items-center justify-center text-xs font-semibold overflow-hidden">
                  {comment.userId?.profileImage ? (
                    <img
                      src={comment.userId.profileImage}
                      alt="Profile"
                      className="w-8 h-8 object-cover rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <>
                      {(comment.userId?.FirstName?.[0] || "").toUpperCase()}
                      {(comment.userId?.LastName?.[0] || "").toUpperCase()}
                    </>
                  )}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">
                      {`${comment.userId?.FirstName || ""} ${
                        comment.userId?.LastName || ""
                      }`}
                    </p>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                  </div>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {getFormattedDate(comment.createdAt)}
                    </span>
                    {comment.userId?._id &&
                      userId &&
                      isSameUser(comment.userId._id) && (
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
      {showMediaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setShowMediaModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X size={24} />
            </button>
            <img
              src={post.mediaUrl || (data.media && data.media[0]?.url)}
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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-semibold text-lg mr-3 overflow-hidden">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt="Profile"
                          className="w-10 h-10 object-cover rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <>
                          {user.FirstName[0]}
                          {user.LastName[0]}
                        </>
                      )}
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
