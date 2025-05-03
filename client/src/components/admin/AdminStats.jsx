import React from 'react'
import StatsCard from './StatsCard'

export const dashboardStats = {
  totalUsers: 12450,
  usersJoined: {currentMonth: 218, lastMonth: 176},
  totalAdmins: 10000,
  adminsCreated: {currentMonth: 150, lastMonth: 250},
  userRole: { total: 62, currentMonth: 25, lastMonth: 15}
}

const { 
  totalUsers,
  usersJoined,
  totalAdmins,
  adminsCreated,
  userRole ,
} = dashboardStats

const AdminStats = () => {
  return (
    <section className='flex flex-col gap-6'>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <StatsCard 
          headerTitle="Total Users"
          total={totalUsers}
          
        />
      </div>
    </section>
  )
}

export default AdminStats