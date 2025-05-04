import React from 'react'
import AdminLayout from '../layout/AdminLayout'

export function DashboardPage() {
    const [activeView, setActiveView] = useState("overview")
  
    return (
      <AdminLayout activeView={activeView} setActiveView={setActiveView}>
        {activeView === "overview" && <DashboardOverview />}
        {activeView === "alumni" && <AlumniManagement />}
        {activeView === "events" && <EventManagement />}
        {activeView === "content" && <ContentModeration />}
        {activeView === "analytics" && <AnalyticsSection />}
        {activeView === "settings" && <SettingsPanel />}
        {activeView === "jobs" && <JobBoard />}
        {activeView === "mentorship" && <MentorshipMatching />}
        {activeView === "users" && <UserCrud />}
      </AdminLayout>
    )
  }
  