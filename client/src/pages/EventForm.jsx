import React, { useState } from "react";
import axios from "axios";

const EventForm = () => {
  const [eventData, setEventData] = useState({
    eventName: "",
    eventDate: "",
    eventLocation: "",
    eventDescription: "",
    // eventImage: null,
    eventSummary: "",
    // eventTrailer: null,
  });

  // const [previewImage, setPreviewImage] = useState(null);
  // const [previewVideo, setPreviewVideo] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleFileChange = (e) => {
  //   const { name, files } = e.target;
  //   const file = files[0];

  //   setEventData((prev) => ({
  //     ...prev,
  //     [name]: file,
  //   }));

  //   // if (name === "eventImage" && file) {
  //   //   setPreviewImage(URL.createObjectURL(file));
  //   // }

  //   // if (name === "eventTrailer" && file) {
  //   //   setPreviewVideo(URL.createObjectURL(file));
  //   // }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return alert("You must be logged in as admin to post a job.");
      }
      const response = await axios.post(
        `${import.meta.env.VITE_ADMIN_API_URL}/admin/event`,
        {
          eventName: eventData.eventName,
          eventDate: eventData.eventDate,
          eventLocation: eventData.eventLocation,
          eventDescription: eventData.eventDescription,
          eventSummary: eventData.eventSummary,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("event posted successfully:", response.data);
      alert("event posted successfully!");
      // refresh the form after posting the event
      setEventData({
        eventName: "",
        eventDate: "",
        eventLocation: "",
        eventDescription: "",
        eventSummary: "",
      });
    } catch (error) {
      console.log("Error posting job:", error);
      alert("Failed to post job. Check console for details.");
    }
  };

  return (
    <div className="rounded-xl bg-white shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        {/* Event Name */}
        <div className="form-item">
          <label className="text-lg font-medium text-gray-700">
            Event Name
          </label>
          <input
            type="text"
            name="eventName"
            value={eventData.eventName}
            onChange={handleInputChange}
            placeholder="Enter event name"
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Event Date */}
        <div className="form-item">
          <label className="text-lg font-medium text-gray-700">
            Event Date
          </label>
          <input
            type="date"
            name="eventDate"
            value={eventData.eventDate}
            onChange={handleInputChange}
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Event Location */}
        <div className="form-item">
          <label className="text-lg font-medium text-gray-700">
            Event Location
          </label>
          <input
            type="text"
            name="eventLocation"
            value={eventData.eventLocation}
            onChange={handleInputChange}
            placeholder="Enter event location"
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Event Description */}
        <div className="form-item">
          <label className="text-lg font-medium text-gray-700">
            Event Description
          </label>
          <textarea
            name="eventDescription"
            value={eventData.eventDescription}
            onChange={handleInputChange}
            placeholder="Enter event description"
            rows="5"
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Event Image
        <div className="form-item">
          <label className="text-lg font-medium text-gray-700">Event Image</label>
          <div className="relative">
            <input
              type="file"
              name="eventImage"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg pl-12"
            />
            <img
              src="/icons/upload.svg"
              alt="Upload Icon"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6"
            />
          </div> */}
        {/* 
          {previewImage && (
            <div className="mt-3 border border-gray-300 rounded-lg overflow-hidden w-full max-w-md">
              <img src={previewImage} alt="Event" className="w-full h-auto object-cover" />
            </div>
          )}
        </div> */}

        {/* Event Trailer
        <div className="form-item">
          <label className="text-lg font-medium text-gray-700">Event Trailer</label>
          <div className="relative">
            <input
              type="file"
              name="eventTrailer"
              accept="video/*"
              onChange={handleFileChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg pl-12"
            />
            <img
              src="/icons/upload.svg"
              alt="Upload Icon"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6"
            />
          </div> */}

        {/* {previewVideo && (
            <div className="mt-3 border border-gray-300 rounded-lg overflow-hidden w-full max-w-md">
              <video
                controls
                className="w-full h-auto object-cover"
                src={previewVideo}
              />
            </div>
          )}
        </div> */}

        {/* Event Summary */}
        <div className="form-item">
          <label className="text-lg font-medium text-gray-700">
            Event Summary
          </label>
          <textarea
            name="eventSummary"
            value={eventData.eventSummary}
            onChange={handleInputChange}
            placeholder="Enter event summary"
            rows="4"
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-6 bg-primary-100 text-white font-semibold rounded-lg shadow-md hover:bg-primary-100/80 focus:outline-none focus:ring-2 "
        >
          Add Event
        </button>
      </form>
    </div>
  );
};

export default EventForm;
