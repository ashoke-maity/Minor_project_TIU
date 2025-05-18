import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, MobileSidebar, Header } from "../components/admin/layout";
import { ManageUsersTable } from "../components/admin/users";
import { 
  AdminStats, 
  UserActivityChart, 
  JobOpeningsChart, 
  EventsChart,
  StoriesOverview,
  AdminAnnouncements
} from "../components/admin/dashboard";
import axios from 'axios';

function AdminDashboard() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("Admin");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(
          `${import.meta.env.VITE_ADMIN_API_URL}/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if(!token){
          return navigate(`${import.meta.env.VITE_ADMIN_ROUTE}/admin/login`);
        }

        if(res.status === 200){
          setAdminName(res.data.admin.FirstName); // fetching the firstname from the database
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setAdminName("Admin");
      }
    };

    fetchAdminData();
  }, [navigate]);

  return (
    <main className="admin-layout bg-gray-50 min-h-screen">
      {/* Desktop sidebar */}
      {!isMobile && <Sidebar />}
      
      {/* Mobile sidebar */}
      {isMobile && <MobileSidebar />}
      
      {/* Main content */}
      <main className={`dashboard wrapper mt-5 content-center space-y-6 ${isMobile ? 'px-2' : 'px-8'}`}>
        <header className="header">
          <article>
            <Header 
              title={`Welcome, ${adminName} 👋`}
              description="Track Alumni Activities, Manage Events and Jobs"
            />
          </article>
        </header>
        
        {/* Stats Overview */}
        <section>
          <AdminStats />
        </section>
        
        {/* Announcements Section */}
        <section>
          <AdminAnnouncements />
        </section>
        
        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserActivityChart />
          <div className="grid grid-cols-1 gap-6">
            <JobOpeningsChart />
          </div>
        </section>

        {/* Events and Stories Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EventsChart />
          <StoriesOverview />
        </section>
        
        {/* Users Table */}
        <section>
          <ManageUsersTable />
        </section>
      </main>
    </main>
  );
}

export default AdminDashboard;
