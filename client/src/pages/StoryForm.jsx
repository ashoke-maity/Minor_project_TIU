import React, { useState } from "react";

const StoryForm = () => {
  const [storyData, setStoryData] = useState({
    title: "",
    author: "",
    storyBody: "",
    media: null,
  });

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [previewMedia, setPreviewMedia] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setStoryData((prev) => ({
      ...prev,
      media: file,
    }));

    if (file) {
      setPreviewMedia(URL.createObjectURL(file));
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Example form data handling
    const formData = new FormData();
    formData.append("title", storyData.title);
    formData.append("author", storyData.author);
    formData.append("storyBody", storyData.storyBody);
    formData.append("tags", JSON.stringify(tags));
    if (storyData.media) {
      formData.append("media", storyData.media);
    }

    // Simulate submission
    console.log("Submitted Story Data:", {
      ...storyData,
      tags,
    });

    // Reset form
    setStoryData({
      title: "",
      author: "",
      storyBody: "",
      media: null,
    });
    setTags([]);
    setTagInput("");
    setPreviewMedia(null);
  };

  return (
    <div className="rounded-xl bg-white shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        {/* Story Title */}
        <div>
          <label className="text-lg font-medium text-gray-700">Story Title</label>
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
          <label className="text-lg font-medium text-gray-700">Upload Image/Video (Optional)</label>
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
              {storyData.media?.type?.startsWith("video") ? (
                <video controls src={previewMedia} className="w-full h-auto object-cover" />
              ) : (
                <img src={previewMedia} alt="Media Preview" className="w-full h-auto object-cover" />
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-6 bg-primary-100 text-white font-semibold rounded-lg shadow-md hover:bg-primary-100/80 focus:outline-none focus:ring-2"
        >
          Upload Story
        </button>
      </form>
    </div>
  );
};

export default StoryForm;
