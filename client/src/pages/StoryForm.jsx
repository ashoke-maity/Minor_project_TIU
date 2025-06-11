import React, { useState, useEffect } from "react";
import axios from "axios";

const StoryForm = ({ story, editMode, onSubmitSuccess, onCancel }) => {
  const [storyData, setStoryData] = useState({
    title: story?.title || "",
    author: story?.author || "",
    storyBody: story?.storyBody || "",
  });
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(story?.tags || []);
  const [media, setMedia] = useState(null);
  const [previewMedia, setPreviewMedia] = useState(
    story?.mediaUrl || story?.media || null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editMode && story) {
      setStoryData({
        title: story.title || "",
        author: story.author || "",
        storyBody: story.storyBody || "",
      });
      setTags(story.tags || []);
      setPreviewMedia(story.mediaUrl || story.media || null);
      setMedia(null);
    }
  }, [editMode, story]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setMedia(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewMedia(previewUrl);
    } else if (editMode && story && (story.mediaUrl || story.media)) {
      setPreviewMedia(story.mediaUrl || story.media);
    } else {
      setPreviewMedia(null);
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("title", storyData.title);
      formData.append("author", storyData.author);
      formData.append("storyBody", storyData.storyBody);
      formData.append("tags", JSON.stringify(tags));
      if (media) {
        formData.append("media", media);
      }
      let response;
      if (editMode && story && story._id) {
        response = await axios.put(
          `${import.meta.env.VITE_ADMIN_API_URL}/admin/edit/story/${story._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Story updated successfully!");
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_ADMIN_API_URL}/admin/write/stories`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Story posted successfully!");
      }
      const newStory = response.data.story || {
        ...storyData,
        _id: story?._id || Date.now(),
        tags,
        mediaUrl: previewMedia,
        createdAt: new Date().toISOString(),
      };
      if (onSubmitSuccess) onSubmitSuccess(newStory);
      setStoryData({ title: "", author: "", storyBody: "" });
      setTags([]);
      setTagInput("");
      setMedia(null);
      setPreviewMedia(null);
    } catch {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-white shadow-md p-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-6"
        encType="multipart/form-data"
      >
        {/* Story Title */}
        <div>
          <label className="text-lg font-medium text-gray-700">
            Story Title
          </label>
          <input
            type="text"
            name="title"
            value={storyData.title}
            onChange={handleInputChange}
            placeholder="Enter story title"
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Author */}
        <div>
          <label className="text-lg font-medium text-gray-700">Author</label>
          <input
            type="text"
            name="author"
            value={storyData.author}
            onChange={handleInputChange}
            placeholder="Your name or alias"
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tags Input */}
        <div>
          <label className="text-lg font-medium text-gray-700">Tags</label>
          <div className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="ml-2 text-blue-600 hover:text-red-500"
                  >
                    &times;
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Press Enter to add tag"
                className="flex-grow min-w-[120px] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Story Body */}
        <div>
          <label className="text-lg font-medium text-gray-700">Story</label>
          <textarea
            name="storyBody"
            value={storyData.storyBody}
            onChange={handleInputChange}
            placeholder="Write your story here..."
            rows="6"
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Media Upload (optional) */}
        <div>
          <label className="text-lg font-medium text-gray-700">
            Upload Image/Video (Optional)
          </label>
          <div className="relative">
            <input
              type="file"
              name="media"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg pl-12"
            />
            <img
              src="/icons/upload.svg"
              alt="Upload Icon"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6"
            />
          </div>
          {previewMedia && (
            <div className="mt-3 border border-gray-300 rounded-lg overflow-hidden w-full max-w-md">
              {media?.type?.startsWith("video") ||
              (typeof previewMedia === "string" &&
                /\/video\/|\.(mp4|webm|ogg)$/i.test(previewMedia)) ? (
                <video
                  key={previewMedia}
                  controls
                  src={previewMedia}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <img
                  key={previewMedia}
                  src={previewMedia}
                  alt="Media Preview"
                  className="w-full h-auto object-cover"
                />
              )}
            </div>
          )}
        </div>
        <div className="flex gap-3">
          {editMode && (
            <button
              type="button"
              onClick={onCancel}
              className="py-3 px-6 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2"
              disabled={loading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-primary-100 text-white font-semibold rounded-lg shadow-md hover:bg-primary-100/80 focus:outline-none focus:ring-2"
            disabled={loading}
          >
            {loading
              ? editMode
                ? "Saving..."
                : "Uploading..."
              : editMode
              ? "Save Changes"
              : "Upload Story"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoryForm;