import React, { useEffect, useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import MobileSidebar from "../components/admin/MobileSidebar";
import Header from "../components/admin/Header";
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
  Inject,
  Page,
} from "@syncfusion/ej2-react-grids";
import { cn, formatDate } from "../components/lib/utils";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importing icons

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Track search input
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered users based on search
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPage = Number(searchParams.get("page") || "1");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const pageSize = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_ADMIN_API_URL}/users`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (response.data.status === 1) {
          const formattedUsers = response.data.users.map((user) => ({
            name: `${user.FirstName} ${user.LastName}`,
            email: user.Email,
            passoutYear: user.PassoutYear,
            joinedAt: new Date(user.createdAt).toISOString().split("T")[0],
            createdAt: user.createdAt,
            status: user.Role || "user",
            permissions: user.permissions || {
              create: false,
              read: true,
              update: false,
              delete: false,
            },
          }));

          setUsers(formattedUsers);
          setFilteredUsers(formattedUsers); // Initialize filtered users
        } else {
          console.error("Error:", response.data.msg);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      const result = users.filter((user) =>
        user.email.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(result);
    } else {
      setFilteredUsers(users); // Reset when search is cleared
    }
  };

  const handlePageChange = (args) => {
    const page = args.currentPage;
    setCurrentPage(page);
    navigate(`?page=${page}`);
  };

  const handleDelete = (userId) => {
    console.log(`Delete user with ID: ${userId}`);
  };

  const handleEdit = (userId) => {
    console.log(`Edit user with ID: ${userId}`);
  };

  return (
    <div className="admin-layout bg-gray-50 min-h-screen flex">
      <Sidebar />
      <MobileSidebar />
      <main className="all-users wrapper mt-5 flex-1 px-4">
        <header className="header mb-4">
          <Header
            title="Manage Users"
            description="Filter, sort and access detailed user profiles"
          />
        </header>
        {/* Search Bar */}
        <div className="mb-4 flex justify-between items-center bg-white shadow-md p-2 rounded-lg">
          <input
            type="text"
            placeholder="Search by Email..."
            value={searchQuery}
            onChange={handleSearch}
            className="p-2 border rounded-md w-full"
          />
        </div>
        <div className="mb-4 rounded-xl bg-white shadow-md p-2">
          <GridComponent
            dataSource={filteredUsers}
            gridLines="None"
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
                  <div className="flex items-center gap-1.5 px-4">
                    <img
                      src={userData.imageUrl}
                      alt="user"
                      className="rounded-full size-8 aspect-square"
                      referrerPolicy="no-referrer"
                    />
                    <span>{userData.name}</span>
                  </div>
                )}
              />
              <ColumnDirective
                field="email"
                headerText="Email Address"
                width="200"
                textAlign="Left"
              />
              <ColumnDirective
                field="PassoutYear"
                headerText="Passout Year"
                width="140"
                textAlign="Left"
              />
              <ColumnDirective
                field="createdAt"
                headerText="Account Created"
                width="180"
                textAlign="Left"
                template={(data) => formatDate(data.createdAt)}
              />
              <ColumnDirective
                field="Password"
                headerText="Password"
                width="180"
                textAlign="Left"
                template={() => (
                  <span className="font-mono text-gray-600 text-xs italic">
                    **Password is securely hashed**
                  </span>
                )}
              />
              <ColumnDirective
                field="joinedAt"
                headerText="Date Joined"
                width="140"
                textAlign="Left"
                template={(data) => formatDate(data.joinedAt)}
              />
              <ColumnDirective
                field="status"
                headerText="Type"
                width="100"
                textAlign="Left"
                template={(data) => (
                  <article
                    className={cn(
                      "status-column",
                      data.status === "user" ? "bg-success-50" : "bg-light-300"
                    )}
                  >
                    <div
                      className={cn(
                        "size-1.5 rounded-full",
                        data.status === "user"
                          ? "bg-success-500"
                          : "bg-gray-500"
                      )}
                    />
                    <h3
                      className={cn(
                        "font-inter text-xs font-medium",
                        data.status === "user"
                          ? "text-success-700"
                          : "text-green-500"
                      )}
                    >
                      {data.status}
                    </h3>
                  </article>
                )}
              />
              <ColumnDirective
                field="permissions"
                headerText="Permissions"
                width="250"
                textAlign="Left"
                template={(data) => (
                  <div className="flex gap-2 text-xs">
                    <button
                      className={cn(
                        "px-2 py-1 rounded-md border transition",
                        data.permissions.update
                          ? "bg-green-100 border-green-500 text-green-700"
                          : "bg-gray-100 border-gray-300 text-gray-500"
                      )}
                      onClick={() => handleEdit(data.id)}
                    >
                      <FaEdit className="text-sm" />
                    </button>
                    <button
                      className={cn(
                        "px-2 py-1 rounded-md border transition",
                        data.permissions.delete
                          ? "bg-red-100 border-red-500 text-red-700"
                          : "bg-gray-100 border-gray-300 text-gray-500"
                      )}
                      onClick={() => handleDelete(data.id)}
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
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
