import React, { useState } from "react";
import axios from "axios";

function PostModal({ isOpen, onClose, initials, firstName, lastName, onPostCreate }) {
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("Please enter some content or media.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_USER_API_URL}/create/post`,
        {
          postType,
          content,
          mediaUrl: "", // later add support
          extraData: {},
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (typeof onPostCreate === "function") {
        onPostCreate(response.data.post);
      } else {
        console.warn("onPostCreate prop is not a function");
      }
      
      setContent("");
      setPostType("general"); // reset
      onClose();
    } catch (err) {
      setError("Failed to create post. Please try again.");
      console.error("Failed to create post:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeSelect = (type) => {
    setPostType(type);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-5 relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-lg"
          onClick={onClose}
          disabled={loading}
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-bold mr-3">
            {initials}
          </div>
          <div className="text-sm font-medium text-gray-800">
            {firstName} {lastName}
          </div>
        </div>

        {/* Textarea */}
        <textarea
          placeholder="What do you want to talk about?"
          className="w-full border border-gray-300 rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-teal-500"
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
        />

        {/* Post Type Selector */}
        <div className="flex justify-between items-center mt-4 mb-3">
          <div className="flex gap-4 text-teal-600 flex-wrap text-sm">
            <button
              className={`flex items-center gap-1 ${
                postType === "video" ? "text-teal-800 font-semibold" : "hover:text-teal-700"
              }`}
              onClick={() => handleTypeSelect("video")}
              disabled={loading}
            >
              📹 <span>Add Video</span>
            </button>
            <button
              className={`flex items-center gap-1 ${
                postType === "job" ? "text-teal-800 font-semibold" : "hover:text-teal-700"
              }`}
              onClick={() => handleTypeSelect("job")}
              disabled={loading}
            >
              💼 <span>Post Job</span>
            </button>
            <button
              className={`flex items-center gap-1 ${
                postType === "event" ? "text-teal-800 font-semibold" : "hover:text-teal-700"
              }`}
              onClick={() => handleTypeSelect("event")}
              disabled={loading}
            >
              📅 <span>Create Event</span>
            </button>
            <button
              className={`flex items-center gap-1 ${
                postType === "donation" ? "text-teal-800 font-semibold" : "hover:text-teal-700"
              }`}
              onClick={() => handleTypeSelect("donation")}
              disabled={loading}
            >
              💰 <span>Create Donation</span>
            </button>
            <button
              className={`flex items-center gap-1 ${
                postType === "image" ? "text-teal-800 font-semibold" : "hover:text-teal-700"
              }`}
              onClick={() => handleTypeSelect("image")}
              disabled={loading}
            >
              🖼️ <span>Add Image</span>
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        {/* Post Button */}
        <div className="flex justify-end">
          <button
            className={`bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-md text-sm font-medium ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostModal;
