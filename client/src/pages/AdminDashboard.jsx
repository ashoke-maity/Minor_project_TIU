import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import AdminStats from "../components/admin/AdminStats";

import MobileSidebar from "../components/admin/MobileSidebar";
import Header from "../components/admin/Header";

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
    <main className="admin-layout bg-gray-50 min-h-screen">
      <Sidebar />
       <MobileSidebar />
        <main className="dashboard wrapper mt-5 content-center">
          <header className="header">
          <article>
          <Header 
            title={`Welcome ${adminName} 👋`}
            description="Track Activity, Trends and popular destinations in real time"
        />
          </article>
        </header>
        <AdminStats />
        </main>
    </main>
  );
}

export default AdminDashboard;
