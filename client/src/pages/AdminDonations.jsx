import React from 'react'
import Sidebar from '../components/admin/Sidebar'
import MobileSidebar from '../components/admin/MobileSidebar'
import Header from '../components/admin/Header'
import  Grid7  from '../components/admin/AllDonations'

const AdminDonations = () => {
  return (
    <div className="admin-layout bg-gray-50 min-h-screen flex">
    <Sidebar />
    <MobileSidebar />
    <main className='all-users wrapper mt-5 flex-1 px-4'>
      <header className='header mb-4'>
        <Header 
          title="Manage Donation's"
          description="Filter, sort and access detailed Donation's"
        />
      </header>
      <Grid7 />
    </main>
  </div>
  )
}

export default AdminDonations
