import React, { useState } from "react";
import axios from "axios";

const EventForm = () => {
  const [eventData, setEventData] = useState({
    eventName: "",
    eventDate: "",
    eventLocation: "",
    eventDescription: "",
    eventSummary: "",
    media: null,
  });

  const [previewMedia, setPreviewMedia] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setEventData((prev) => ({
      ...prev,
      media: file,
    }));

    setPreviewMedia(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) return alert("You must be logged in as admin to post an event.");

    try {
      const formData = new FormData();
      formData.append("eventName", eventData.eventName);
      formData.append("eventDate", eventData.eventDate);
      formData.append("eventLocation", eventData.eventLocation);
      formData.append("eventDescription", eventData.eventDescription);
      formData.append("eventSummary", eventData.eventSummary);
      if (eventData.media) {
        formData.append("media", eventData.media);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_ADMIN_API_URL}/admin/event`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Event posted successfully:", response.data);
      alert("Event posted successfully!");

      // Reset
      setEventData({
        eventName: "",
        eventDate: "",
        eventLocation: "",
        eventDescription: "",
        eventSummary: "",
        media: null,
      });
      setPreviewMedia(null);
    } catch (error) {
      console.error("Error posting event:", error);
      alert("Failed to post event. Check console for details.");
    }
  };

  return (
    <div className="rounded-xl bg-white shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        {/* Name */}
        <div className="form-item">
          <label className="text-lg font-medium text-gray-700">Event Name</label>
          <input
            type="text"
            name="eventName"
            value={eventData.eventName}
            onChange={handleInputChange}
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Date */}
        <div className="form-item">
          <label className="text-lg font-medium text-gray-700">Event Date</label>
          <input
            type="date"
            name="eventDate"
            value={eventData.eventDate}
            onChange={handleInputChange}
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Location */}
        <div className="form-item">
          <label className="text-lg font-medium text-gray-700">Event Location</label>
          <input
            type="text"
            name="eventLocation"
            value={eventData.eventLocation}
            onChange={handleInputChange}
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Description */}
        <div className="form-item">
          <label className="text-lg font-medium text-gray-700">Event Description</label>
          <textarea
            name="eventDescription"
            value={eventData.eventDescription}
            onChange={handleInputChange}
            rows="4"
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Summary */}
        <div className="form-item">
          <label className="text-lg font-medium text-gray-700">Event Summary</label>
          <textarea
            name="eventSummary"
            value={eventData.eventSummary}
            onChange={handleInputChange}
            rows="3"
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Media (Image/Video) */}
        <div className="form-item">
          <label className="text-lg font-medium text-gray-700">Event Media (optional)</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
          />
          {previewMedia && (
            <div className="mt-3">
              {eventData.media?.type.startsWith("image") ? (
                <img
                  src={previewMedia}
                  alt="Preview"
                  className="rounded-md border w-full max-w-md"
                />
              ) : (
                <video
                  src={previewMedia}
                  controls
                  className="rounded-md border w-full max-w-md"
                />
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-6 bg-primary-100 text-white font-semibold rounded-lg hover:bg-primary-100/80"
        >
          Add Event
        </button>
      </form>
    </div>
  );
};

export default EventForm;
