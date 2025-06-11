import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/admin/Sidebar";
import MobileSidebar from "../components/admin/MobileSidebar";
import Header from "../components/admin/Header";

const adminRoute = import.meta.env.VITE_ADMIN_ROUTE;
const apiBaseUrl = import.meta.env.VITE_ADMIN_API_URL;

const AdminEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [editForm, setEditForm] = useState({
    eventName: "",
    eventDate: "",
    eventLocation: "",
    eventDescription: "",
    eventSummary: "",
    mediaUrl: "",
  });
  const [editMediaFile, setEditMediaFile] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      const response = await axios.get(`${apiBaseUrl}/admin/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const eventsData =
        response.data.events ||
        (Array.isArray(response.data.data) && response.data.data) ||
        (Array.isArray(response.data) && response.data) ||
        [];

      setEvents(eventsData);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEventClick = () => {
    navigate(`${adminRoute}/admin/dashboard/addEvents`);
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const token = localStorage.getItem("authToken");

      await axios.delete(`${apiBaseUrl}/admin/event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents(events.filter((event) => event._id !== eventId));
      alert("Event deleted successfully");
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event. Please try again.");
    }
  };

  const openEditModal = (event) => {
    setEditEvent(event);
    setEditForm({
      eventName: event.eventName || "",
      eventDate: event.eventDate ? event.eventDate.slice(0, 10) : "",
      eventLocation: event.eventLocation || "",
      eventDescription: event.eventDescription || "",
      eventSummary: event.eventSummary || "",
      mediaUrl: event.mediaUrl || "",
    });
    setEditMediaFile(null);
    setEditError(null);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditEvent(null);
    setEditError(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditMediaChange = (e) => {
    setEditMediaFile(e.target.files[0] || null);
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (editMediaFile) {
        const formData = new FormData();
        Object.entries(editForm).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append("media", editMediaFile);
        await axios.put(
          `${apiBaseUrl}/admin/event/${editEvent._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.put(
          `${apiBaseUrl}/admin/event/${editEvent._id}`,
          editForm,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      await fetchEvents();
      closeEditModal();
    } catch {
      setEditError("Failed to update event. Please try again.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditEvent = (eventId) => {
    const event = events.find((ev) => ev._id === eventId);
    if (event) openEditModal(event);
  };

  return (
    <div className="admin-layout bg-gray-50 min-h-screen flex">
      <Sidebar />
      <MobileSidebar />
      <main className="wrapper mt-5 flex-1 px-4">
        <header className="header mb-4">
          <Header
            title="Manage Events"
            description="Filter, sort and access homescreen events"
          />
        </header>

        <div className="mb-6 rounded-xl bg-white shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-gray-800">
              Create Events
            </h3>
            <button
              onClick={handleAddEventClick}
              className="bg-primary-100 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-100/80 transition"
            >
              + Add a New Event
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Event Listings
          </h3>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-100"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <div
                  key={event._id || event.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  {(event.mediaUrl || event.media) && (
                    <div className="w-full h-48 overflow-hidden">
                      {event.mediaType?.startsWith("video") ||
                      event.media?.type?.startsWith("video") ||
                      (typeof event.media === "string" &&
                        event.media.includes(".mp4")) ? (
                        <video
                          src={event.mediaUrl || event.media}
                          className="w-full h-full object-cover"
                          controls
                        />
                      ) : (
                        <img
                          src={event.mediaUrl || event.media}
                          alt={event.eventName || event.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800">
                      {event.eventName || event.name}
                    </h3>
                    <div className="mt-2 text-gray-700 text-sm">
                      <div>
                        <span className="font-semibold">Date:</span>{" "}
                        {event.eventDate
                          ? new Date(event.eventDate).toLocaleDateString()
                          : "N/A"}
                      </div>
                      <div>
                        <span className="font-semibold">Location:</span>{" "}
                        {event.eventLocation || "N/A"}
                      </div>
                      <div>
                        <span className="font-semibold">Summary:</span>{" "}
                        {event.eventSummary || "N/A"}
                      </div>
                      <div>
                        <span className="font-semibold">Description:</span>{" "}
                        {event.eventDescription || "N/A"}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-3">
                      <button
                        onClick={() => handleEditEvent(event._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={closeEditModal}
                disabled={editLoading}
              >
                &times;
              </button>
              <h2 className="text-lg font-semibold mb-4">Edit Event</h2>
              {editError && (
                <div className="bg-red-100 text-red-700 p-2 rounded mb-2 text-sm">
                  {editError}
                </div>
              )}
              <form onSubmit={handleEditFormSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium">
                    Event Name
                  </label>
                  <input
                    type="text"
                    name="eventName"
                    value={editForm.eventName}
                    onChange={handleEditFormChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={editForm.eventDate}
                    onChange={handleEditFormChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Location</label>
                  <input
                    type="text"
                    name="eventLocation"
                    value={editForm.eventLocation}
                    onChange={handleEditFormChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    name="eventDescription"
                    value={editForm.eventDescription}
                    onChange={handleEditFormChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                    rows={2}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Summary</label>
                  <textarea
                    name="eventSummary"
                    value={editForm.eventSummary}
                    onChange={handleEditFormChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                    rows={2}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Media URL</label>
                  <input
                    type="text"
                    name="mediaUrl"
                    value={editForm.mediaUrl}
                    onChange={handleEditFormChange}
                    className="w-full border rounded px-3 py-2 mt-1 mb-2"
                    placeholder="Paste image/video URL or upload below"
                  />
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleEditMediaChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                    disabled={editLoading}
                  />
                  {editMediaFile ? (
                    <div className="mt-2">
                      {editMediaFile.type.startsWith("video") ? (
                        <video
                          src={URL.createObjectURL(editMediaFile)}
                          controls
                          className="w-32 h-20 object-contain rounded"
                          type={editMediaFile.type}
                        />
                      ) : (
                        <img
                          src={URL.createObjectURL(editMediaFile)}
                          alt="Preview"
                          className="w-20 h-20 object-contain rounded"
                        />
                      )}
                    </div>
                  ) : (
                    editForm.mediaUrl && (
                      <div className="mt-2">
                        {(() => {
                          // Robust check for Cloudinary video URLs or video extensions
                          const url = editForm.mediaUrl;
                          const isVideo =
                            /\.(mp4|webm|ogg)$/i.test(url) ||
                            /\/video\/upload\//.test(url) ||
                            (url.includes("cloudinary") &&
                              url.includes("/video/"));
                          return isVideo ? (
                            <video
                              src={url}
                              controls
                              className="w-32 h-20 object-contain rounded"
                            />
                          ) : (
                            <img
                              src={url}
                              alt="Current Media"
                              className="w-20 h-20 object-contain rounded"
                            />
                          );
                        })()}
                      </div>
                    )
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-primary-100 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-100/80 transition disabled:opacity-60"
                    disabled={editLoading}
                  >
                    {editLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminEvents;
