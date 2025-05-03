import React from 'react'
import Sidebar from '../components/admin/Sidebar';
import AlumniList from '../components/admin/AlumniList';
import MobileSidebar from '../components/admin/MobileSidebar';
import Header from '../components/admin/Header';
import AdminHeader from '../components/admin/AdminHeader';

const user = { name: 'Jordan'}

const AllUsers = () => {
  return (
    <div className="admin-layout bg-gray-50 min-h-screen flex">
      <Sidebar />
      <MobileSidebar/>
      <div className='dashboard wrapper mt-5 flex-1 px-4'>
        <header className='header mb-4'>
          <Header 
            title="All Users"
            description="Check out our current users in real time"
          />
        </header>
       

        All User Page Contents
    </div>
     </div>
  )
}

export default AllUsers