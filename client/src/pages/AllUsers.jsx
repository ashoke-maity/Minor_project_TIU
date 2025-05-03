import React from 'react'
import Sidebar from '../components/admin/Sidebar';
import AlumniList from '../components/admin/AlumniList';
import MobileSidebar from '../components/admin/MobileSidebar';
import Header from '../components/admin/Header';
import AdminHeader from '../components/admin/AdminHeader';

const user = { name: 'Jordan'}

const AllUsers = () => {
  return (
    <main className="admin-layout bg-gray-50 min-h-screen">
      <Sidebar />
      <MobileSidebar/>
      <main className='dashboard wrapper mt-5  content-center '>
        <header className='header'>
          <article>
          <Header 
            title="All-Users"
            description="Check out our current users in real time"
        />
          </article>
        </header>
       

        All User Page Contents
    </main>
     </main>
  )
}

export default AllUsers