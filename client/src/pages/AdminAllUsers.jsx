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
            id: user._id,
            name: `${user.FirstName} ${user.LastName}`,
            email: user.Email,
            passoutYear: user.PassoutYear,
            joinedAt: new Date(user.createdAt).toISOString().split("T")[0],
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
              ? new Date(user.updatedAt).toISOString()
              : null,
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

  // page change limit
  const handlePageChange = (args) => {
    const page = args.currentPage;
    setCurrentPage(page);
    navigate(`?page=${page}`);
  };

  // user delete
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_ADMIN_API_URL}/delete/user`,
        {
          data: { userID: userId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.data.status === 1) {
        // Update user list in UI
        const updatedUsers = users.filter((user) => user.id !== userId);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        alert("User deleted successfully");
      } else {
        console.error("Delete failed:", response.data.msg);
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user.");
    }
  };

  // user update
  const handleEdit = async (userId) => {
    const selectedUser = users.find((user) => user.id === userId);

    // Prompt for first name, last name, and email
    const firstName = prompt(
      `Enter new First Name for ${selectedUser.name} (current: ${
        selectedUser.name.split(" ")[0]
      })`,
      selectedUser.name.split(" ")[0]
    );

    const lastName = prompt(
      `Enter new Last Name for ${selectedUser.name} (current: ${
        selectedUser.name.split(" ")[1]
      })`,
      selectedUser.name.split(" ")[1]
    );

    const email = prompt(
      `Enter new Email for ${selectedUser.name} (current: ${selectedUser.email})`,
      selectedUser.email
    );

    // If any of the fields are unchanged, skip the update
    if (
      !firstName ||
      !lastName ||
      !email ||
      (firstName === selectedUser.name.split(" ")[0] &&
        lastName === selectedUser.name.split(" ")[1] &&
        email === selectedUser.email)
    ) {
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_ADMIN_API_URL}/update/user`,
        {
          userID: userId,
          firstName: firstName,
          lastName: lastName,
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.data.status === 1) {
        // Update the user list in the state with the new details
        const updatedUsers = users.map((user) =>
          user.id === userId
            ? { ...user, name: `${firstName} ${lastName}`, email: email }
            : user
        );
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        alert("User details updated successfully.");
      } else {
        console.error("Update failed:", response.data.msg);
        alert("Failed to update user.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred while updating the user.");
    }
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
                    **hashed**
                  </span>
                )}
              />
              <ColumnDirective
                field="joinedAt"
                headerText="Date Joined"
                width="180"
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
                field="updatedAt"
                headerText="Last Admin Update"
                width="180"
                textAlign="Left"
                template={(data) => {
                  console.log("updatedAt:", data.updatedAt);
                  return data.updatedAt ? formatDate(data.updatedAt) : "—";
                }}
              />
              <ColumnDirective
                field="permissions"
                headerText="Permissions"
                width="250"
                textAlign="Left"
                template={(data) => (
                  <div className="flex gap-2 text-xs">
                    {/* Update Button */}
                    <button
                      className={cn(
                        "px-4 py-2 rounded-md border transition",
                        data.permissions.update
                          ? "bg-blue-500 border-blue-600 text-white"
                          : "bg-blue-500 border-blue-600 text-white"
                      )}
                      onClick={() => handleEdit(data.id)}
                    >
                      Update
                    </button>

                    {/* Delete Button */}
                    <button
                      className={cn(
                        "px-4 py-2 rounded-md border transition",
                        data.permissions.delete
                          ? "bg-red-500 border-red-600 text-white"
                          : "bg-red-500 border-red-600 text-white"
                      )}
                      onClick={() => handleDelete(data.id)}
                    >
                      Delete
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
