import React, { useState } from 'react';
import Sidebar from '../components/admin/Sidebar';
import MobileSidebar from '../components/admin/MobileSidebar';
import Header from '../components/admin/Header';
import { ColumnDirective, ColumnsDirective, GridComponent, Inject, Page } from "@syncfusion/ej2-react-grids";
import { cn, formatDate } from '../components/lib/utils';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AllUsers = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Jordan',
      email: 'jordan@example.com',
      joinedAt: '2024-12-01',
      status: 'user',
      imageUrl: 'https://i.pravatar.cc/150?img=1',
      permissions: { create: true, read: true, update: false, delete: false }
    },
    {
      id: 2,
      name: 'Maya',
      email: 'maya@example.com',
      joinedAt: '2024-11-12',
      status: 'admin',
      imageUrl: 'https://i.pravatar.cc/150?img=2',
      permissions: { create: true, read: true, update: true, delete: true }
    },
  ]);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPage = Number(searchParams.get('page') || '1');
  const [currentPage, setCurrentPage] = useState(initialPage);
  const pageSize = 10;

  const togglePermission = (userId, permKey) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          permissions: {
            ...user.permissions,
            [permKey]: !user.permissions[permKey]
          }
        };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  const handleRoleChange = (userId, newStatus) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, status: newStatus } : user
    );
    setUsers(updatedUsers);
  };

  const renderPermissionToggles = (permissions, userId) => {
    return (
      <div className="flex gap-2 text-xs">
        {['create', 'read', 'update', 'delete'].map((perm) => (
          <button
            key={perm}
            className={cn(
              'px-2 py-1 rounded-md border transition',
              permissions[perm] ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-100 border-gray-300 text-gray-500'
            )}
            onClick={() => togglePermission(userId, perm)}
          >
            {perm.charAt(0).toUpperCase()}
          </button>
        ))}
      </div>
    );
  };

  const handlePageChange = (args) => {
    const page = args.currentPage;
    setCurrentPage(page);
    navigate(`?page=${page}`);
  };

  return (
    <div className="admin-layout bg-gray-50 min-h-screen flex">
      <Sidebar />
      <MobileSidebar />
      <main className='all-users wrapper mt-5 flex-1 px-4'>
        <header className='header mb-4'>
          <Header 
            title="Manage Users"
            description="Filter, sort and access detailed user profiles"
          />
        </header>

        <div className="mb-4 rounded-xl bg-white shadow-md p-2">
          <GridComponent
            dataSource={users}
            gridLines='None'
            allowPaging={true}
            pageSettings={{ pageSize, currentPage }}
            actionComplete={handlePageChange}
          >
            <ColumnsDirective>
              <ColumnDirective
                field="name"
                headerText="Name"
                width="200"
                textAlign="Left"
                template={(userData) => (
                  <div className='flex items-center gap-1.5 px-4'>
                    <img
                      src={userData.imageUrl}
                      alt='user'
                      className='rounded-full size-8 aspect-square'
                      referrerPolicy='no-referrer'
                    />
                    <span>{userData.name}</span>
                  </div>
                )}
              />
              <ColumnDirective 
                field='email'
                headerText='Email Address'
                width="200"
                textAlign='Left'
              />
              <ColumnDirective 
                field='joinedAt'
                headerText='Date Joined'
                width="140"
                textAlign='Left'
                template={(data) => formatDate(data.joinedAt)}
              />
              <ColumnDirective 
                field='status'
                headerText='Type'
                width="100"
                textAlign='Left'
                template={(data) => (
                  <article className={cn('status-column', data.status === 'user' ? 'bg-success-50' : 'bg-light-300')}>
                    <div className={cn('size-1.5 rounded-full', data.status === 'user' ? 'bg-success-500' : 'bg-gray-500')} />
                    <h3 className={cn('font-inter text-xs font-medium', data.status === 'user' ? 'text-success-700' : 'text-green-500')}>
                      {data.status}
                    </h3>
                  </article>
                )}
              />
              <ColumnDirective 
                field='permissions'
                headerText='Permissions'
                width="250"
                textAlign='Left'
                template={(data) => renderPermissionToggles(data.permissions, data.id)}
              />
             <ColumnDirective
                field="roleSelector"
                headerText="Change Role"
                width="160"
                textAlign="Left"
                template={(data) => (
                  <select
                    className="text-xs px-3 py-1.5 rounded-md border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    value={data.status}
                    onChange={(e) => handleRoleChange(data.id, e.target.value)}
                  >
                    <option value="user" className="text-gray-800">User</option>
                    <option value="admin" className="text-green-800">Admin</option>
                  </select>
                )}
              />

            </ColumnsDirective>
            <Inject services={[Page]} />
          </GridComponent>
        </div>
      </main>
    </div>
  );
};

export default AllUsers;
