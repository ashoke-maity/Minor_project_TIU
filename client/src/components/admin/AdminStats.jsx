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
  userRole,
} = dashboardStats

const AdminStats = () => {
  return (
    <section className='flex flex-col gap-4 lg:gap-6'>
      <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Overview</h2>
      <div className="stats-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5">
        <StatsCard 
          headerTitle="Total Users"
          total={totalUsers}
          currentMonthCount={usersJoined.currentMonth}
          lastMonthCount={usersJoined.lastMonth}
        />
        <StatsCard 
          headerTitle="Total Admins"
          total={totalAdmins}
          currentMonthCount={adminsCreated.currentMonth}
          lastMonthCount={adminsCreated.lastMonth}
        />
        <StatsCard 
          headerTitle="Active Users"
          total={userRole.total}
          currentMonthCount={userRole.currentMonth}
          lastMonthCount={userRole.lastMonth}
        />
      </div>
    </section>
  )
}

export default AdminStats