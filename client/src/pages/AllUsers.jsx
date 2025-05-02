import React from 'react'
import Sidebar from '../components/admin/Sidebar';
import AlumniList from '../components/admin/AlumniList';

const AllUsers = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <AlumniList />
      </main>
    </div>
  )
}

export default AllUsers