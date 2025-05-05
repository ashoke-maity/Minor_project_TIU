import React from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/admin/Sidebar'
import MobileSidebar from '../components/admin/MobileSidebar'
import Header from '../components/admin/Header'

const adminRoute = import.meta.env.VITE_ADMIN_ROUTE

const AdminEvents = () => {
  const navigate = useNavigate()

  const handleAddEventClick = () => {
    navigate(`${adminRoute}/admin/dashboard/addEvents`)
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

        <div className="mb-4 rounded-xl bg-white shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-gray-800">Create Events</h3>
            <button
              onClick={handleAddEventClick}
              className="bg-primary-100 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-100/80 transition"
            >
              + Add a New Event
            </button>
          </div>

          {/* You can list events or add a search/filter component here */}
        </div>
      </main>
    </div>
  )
}

export default AdminEvents
