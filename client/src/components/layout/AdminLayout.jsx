// src/layouts/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      MobileSidebar
      <aside className='w-full max-w-[270px] hidden lg:block'>
        <SidebarComponent></SidebarComponent>
      </aside>
      <aside className='children'>
        <Outlet/>
      </aside>
    </div>
  );
};

export default AdminLayout;
