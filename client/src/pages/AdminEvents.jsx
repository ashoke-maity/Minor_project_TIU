import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../components/admin/Sidebar'
import MobileSidebar from '../components/admin/MobileSidebar'
import Header from '../components/admin/Header'

const adminRoute = import.meta.env.VITE_ADMIN_ROUTE
const apiBaseUrl = import.meta.env.VITE_ADMIN_API_URL

const AdminEvents = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("authToken")

      const response = await axios.get(`${apiBaseUrl}/admin/events`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const eventsData =
        response.data.events ||
        (Array.isArray(response.data.data) && response.data.data) ||
        (Array.isArray(response.data) && response.data) ||
        []

      setEvents(eventsData)
    } catch (err) {
      console.error("Failed to fetch events:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleAddEventClick = () => {
    navigate(`${adminRoute}/admin/dashboard/addEvents`)
  }

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return

    try {
      const token = localStorage.getItem("authToken")

      await axios.delete(`${apiBaseUrl}/admin/event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setEvents(events.filter(event => event._id !== eventId))
      alert("Event deleted successfully")
    } catch (err) {
      console.error("Error deleting event:", err)
      alert("Failed to delete event. Please try again.")
    }
  }

  const handleEditEvent = (eventId) => {
    navigate(`${adminRoute}/admin/dashboard/editEvent/${eventId}`)
  }

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
            <h3 className="text-base font-semibold text-gray-800">Create Events</h3>
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
              {events.map(event => (
                <div key={event._id || event.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  {(event.mediaUrl || event.media) && (
                    <div className="w-full h-48 overflow-hidden">
                      {(event.mediaType?.startsWith('video') ||
                        event.media?.type?.startsWith('video') ||
                        (typeof event.media === 'string' && event.media.includes('.mp4'))) ? (
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
                    <h3 className="text-lg font-bold text-gray-800">{event.eventName || event.name}</h3>
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
      </main>
    </div>
  )
}

export default AdminEvents
