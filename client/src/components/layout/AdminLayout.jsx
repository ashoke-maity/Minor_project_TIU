// src/layouts/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { MobileSidebar, Sidebar } from "../admin/MobileSidebar"

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <MobileSidebar />
      <aside className='w-full max-w-[270px] hidden lg:block'>
      </aside>
      <aside className='children'>
        <Outlet/>
      </aside>
    </div>
  );
};

export default AdminLayout;
