import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import AdminStats from "../components/admin/AdminStats";
import RecentEvents from "../components/admin/RecentEvents";
import AlumniList from "../components/admin/AlumniList";
import axios from 'axios';

function AdminDashboard() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("Admin");

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
  }, []);

  return (
    <main className="admin-layout bg-white">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome, {adminName}
          </h1>
          <AdminStats />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecentEvents />
            <AlumniList />
          </div>
        </main>
      </div>
    </main>
  );
}

export default AdminDashboard;
