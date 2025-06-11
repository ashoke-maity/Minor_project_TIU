import React, { useState, useEffect } from 'react';
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
  Inject,
  Page,
} from "@syncfusion/ej2-react-grids";
import { cn, formatDate } from "../../components/lib/utils";
import LoadingOverlay from "../shared/LoadingOverlay";
import Toast from "../../services/toast";
import axios from "axios";

export default function ManageUsersTable() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const pageSize = 5;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
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
          profilePic: user.profileImage && user.profileImage.trim() !== ''
            ? (user.profileImage.startsWith('http')
                ? user.profileImage
                : `${import.meta.env.VITE_ADMIN_API_URL.replace(/\/$/, '')}/${user.profileImage.replace(/^\//, '')}`)
            : null,
        }));
        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
      } else {
        Toast.error("Error fetching users: " + response.data.msg);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      Toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      const result = users.filter(
        (user) =>
          user.email.toLowerCase().includes(query.toLowerCase()) ||
          user.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(result);
    } else {
      setFilteredUsers(users);
    }
  };

  const handlePageChange = (args) => {
    setCurrentPage(args.currentPage);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setIsLoading(true);
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
        const updatedUsers = users.filter((user) => user.id !== userId);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        Toast.success("User deleted successfully");
      } else {
        Toast.error("Failed to delete user: " + response.data.msg);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      Toast.error("An error occurred while deleting the user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (userId) => {
    const selectedUser = users.find((user) => user.id === userId);
    if (!selectedUser) return;

    const nameParts = selectedUser.name.split(" ");
    const firstName = prompt(
      `Enter new First Name (current: ${nameParts[0]})`,
      nameParts[0]
    );

    if (!firstName) return;

    const lastName = prompt(
      `Enter new Last Name (current: ${nameParts[1] || ""})`,
      nameParts[1] || ""
    );

    if (!lastName) return;

    const email = prompt(
      `Enter new Email (current: ${selectedUser.email})`,
      selectedUser.email
    );

    if (!email) return;

    // Check if anything changed
    if (
      firstName === nameParts[0] &&
      lastName === (nameParts[1] || "") &&
      email === selectedUser.email
    ) {
      Toast.info("No changes were made");
      return;
    }

    setIsLoading(true);
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
        const updatedUsers = users.map((user) =>
          user.id === userId
            ? { ...user, name: `${firstName} ${lastName}`, email: email }
            : user
        );
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        Toast.success("User updated successfully");
      } else {
        Toast.error("Failed to update user: " + response.data.msg);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      Toast.error("An error occurred while updating the user");
    } finally {
      setIsLoading(false);
    }
  };

  // Mobile card view
  const renderMobileView = () => (
    <div className="grid grid-cols-1 gap-4">
      {filteredUsers.map((user) => (
        <div
          key={user.id}
          className="bg-white p-3 rounded-lg shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs font-bold border border-gray-200">
                  {user.name ? user.name.charAt(0) : "?"}
                </div>
              )}
              <h4 className="font-medium">{user.name}</h4>
            </div>
            <span
              className={cn(
                "text-xs py-1 px-2 rounded",
                user.status === "user"
                  ? "bg-success-50 text-success-700"
                  : "bg-gray-100 text-gray-700"
              )}
            >
              {user.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{user.email}</p>

          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
            <div>
              <p className="text-gray-500">Passout Year</p>
              <p className="font-medium">{user.passoutYear}</p>
            </div>
            <div>
              <p className="text-gray-500">Joined</p>
              <p className="font-medium">{formatDate(user.createdAt)}</p>
            </div>
            <div>
              <p className="text-gray-500">Last Update</p>
              <p className="font-medium">
                {user.updatedAt ? formatDate(user.updatedAt) : "—"}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => handleEdit(user.id)}
              className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-xs font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(user.id)}
              className="px-3 py-1.5 bg-red-500 text-white rounded-md text-xs font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="bg-white p-3 sm:p-4 rounded-lg shadow-sm mt-4 sm:mt-6">
      <LoadingOverlay loading={isLoading} message="Processing..." />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-lg sm:text-xl font-semibold">Manage Users</h3>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={handleSearch}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Mobile view */}
      {isMobile ? (
        renderMobileView()
      ) : (
        /* Desktop view - SyncFusion Grid */
        <div className="rounded-lg overflow-hidden border border-gray-200">
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
                width="180"
                textAlign="Left"
                template={(data) => (
                  <div className="flex items-center gap-2">
                    {data.profilePic ? (
                      <img
                        src={data.profilePic}
                        alt={data.name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs font-bold border border-gray-200">
                        {data.name ? data.name.charAt(0) : "?"}
                      </div>
                    )}
                    <span>{data.name}</span>
                  </div>
                )}
              />
              <ColumnDirective
                field="email"
                headerText="Email"
                width="200"
                textAlign="Left"
              />
              <ColumnDirective
                field="createdAt"
                headerText="Joined"
                width="120"
                textAlign="Left"
                template={(data) => formatDate(data.createdAt)}
              />
              <ColumnDirective
                field="status"
                headerText="Type"
                width="100"
                textAlign="Left"
                template={(data) => (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                      data.status === "user"
                        ? "bg-success-50 text-success-700"
                        : "bg-gray-100 text-gray-700"
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        data.status === "user"
                          ? "bg-success-500"
                          : "bg-gray-500"
                      )}
                    ></span>
                    {data.status}
                  </span>
                )}
              />
              <ColumnDirective
                field="actions"
                headerText="Actions"
                width="150"
                textAlign="Left"
                template={(data) => (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(data.id)}
                      className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(data.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs"
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
      )}

      <div className="mt-4 text-sm text-gray-500">
        {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
      </div>
    </section>
  );
}
