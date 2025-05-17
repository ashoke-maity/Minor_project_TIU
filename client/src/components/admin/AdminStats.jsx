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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <StatsCard 
          headerTitle="Total Users"
          total={totalUsers}
          currentMonthCount={usersJoined.currentMonth}
          lastMonthCount={usersJoined.lastMonth}
        />
        <StatsCard 
          headerTitle="Total Admins"
          total={totalUsers}
          currentMonthCount={adminsCreated.currentMonth}
          lastMonthCount={adminsCreated.lastMonth}
        />
        <StatsCard 
          headerTitle="Active Users"
          total={totalUsers}
          currentMonthCount={usersJoined.currentMonth}
          lastMonthCount={usersJoined.lastMonth}
        />
      </div>
    </section>
  )
}

export default AdminStats