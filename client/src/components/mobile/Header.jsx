import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Bell,
  User,
  Search,
  LogOut,
  X,
  Settings,
  Menu,
  Check,
  Trash2,
  Edit2,
} from "lucide-react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

function MobileHeader({ following, followers, onUserClick, onPostClick }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchDropdownRef = useRef(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const socket = io(import.meta.env.VITE_SERVER_ROUTE);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_USER_API_URL}/user/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        const { Email, FirstName, LastName, profileImage} = response.data.user;
        setEmail(Email);
        setFirstName(FirstName);
        setLastName(LastName);
        setProfileImage(profileImage);
      } catch (err) {
        console.log("Failed to fetch user info", err);
      }
    };
    fetchProfile();

    fetchNotifications();

    // Socket.io event listeners
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("newNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      toast.info(notification.message);
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  // Debounce search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setSearchError("");
      return;
    }
    setSearchLoading(true);
    setSearchError("");
    const timeout = setTimeout(async () => {
      try {
        const token = localStorage.getItem("authToken");
        const searchRes = await axios.get(
          `${
            import.meta.env.VITE_USER_API_URL
          }/search/all?query=${searchQuery}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSearchResults(searchRes.data);
        if (
          (!searchRes.data.users || searchRes.data.users.length === 0) &&
          (!searchRes.data.posts || searchRes.data.posts.length === 0)
        ) {
          setSearchError("No results found.");
        }
      } catch (error) {
        setSearchError("Search failed. Please try again.");
        setSearchResults(null);
      } finally {
        setSearchLoading(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_USER_API_URL}/notifications`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setNotifications(response.data.notifications);
      setUnreadCount(
        response.data.notifications.filter((n) => !n.isRead).length
      );
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const openSettings = () => {
    setShowMenu(false);
    navigate("/settings");
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
    if (showNotifications) setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showMenu) setShowMenu(false);
  };

  const handleAccept = async (senderId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_USER_API_URL}/accept-follow`,
        { senderId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setNotifications((prev) =>
        prev.filter((n) => n.sender?._id !== senderId)
      );
      toast.success("Connection request accepted!");
    } catch (err) {
      console.error("Failed to accept request:", err);
      toast.error("Failed to accept connection.");
    }
  };

  const handleDecline = async (senderId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_USER_API_URL}/reject-request`,
        { senderId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setNotifications((prev) =>
        prev.filter((n) => n.sender?._id !== senderId)
      );
      toast.info("Connection request declined.");
    } catch (err) {
      console.error("Failed to decline request:", err);
      toast.error("Failed to decline connection.");
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_USER_API_URL}/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_USER_API_URL}/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const initials = `${firstName?.[0] ?? ""}${
    lastName?.[0] ?? ""
  }`.toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
        <div className="px-4 py-2 flex items-center justify-between">
          <Link
            to="/home"
            className="text-xl font-bold flex items-center gap-1 text-gray-800"
          >
            Alumni<span className="text-teal-500">Connect</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              className="text-gray-600 relative"
              onClick={toggleNotifications}
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-800 transition-colors"
              aria-label="Menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-2">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search posts, people, and jobs..."
              className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 text-sm bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          </div>
        </div>
        {/* Search Dropdown */}
        {searchQuery.trim() && (
          <div
            ref={searchDropdownRef}
            className="absolute top-full left-0 mt-1 w-full max-h-60 bg-white border border-gray-200 rounded-b-xl shadow-lg z-50 overflow-y-auto transition-all"
          >
            <ul className="divide-y divide-gray-100">
              {searchLoading && (
                <li className="px-3 py-2 text-sm text-gray-400">
                  Searching...
                </li>
              )}
              {searchError && !searchLoading && (
                <li className="px-3 py-2 text-sm text-gray-400">
                  {searchError}
                </li>
              )}
              {!searchLoading &&
                !searchError &&
                searchResults?.users?.length > 0 && (
                  <>
                    {searchResults.users.map((user) => (
                      <li
                        key={user._id}
                        className="px-3 py-2 text-sm hover:bg-teal-50 transition rounded flex items-center gap-2 cursor-pointer"
                      >
                        <Link
                          to="#"
                          className="flex items-center gap-2 w-full text-gray-700"
                          onClick={() => {
                            onUserClick && onUserClick(user._id);
                            setSearchResults(null);
                            setSearchQuery(""); // Optionally clear search
                          }}
                        >
                          <span className="bg-teal-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            {user.FirstName?.[0]}
                            {user.LastName?.[0]}
                          </span>
                          <span className="truncate">
                            {user.FirstName} {user.LastName}
                          </span>
                        </Link>
                      </li>
                    ))}
                    {searchResults.posts?.length > 0 && (
                      <li className="px-3 py-1 text-xs text-gray-400 font-semibold select-none">
                        Posts
                      </li>
                    )}
                  </>
                )}
              {!searchLoading &&
                !searchError &&
                searchResults?.posts?.map((post) => (
                  <li
                    key={post._id}
                    className="px-3 py-2 text-sm hover:bg-teal-50 transition rounded flex items-center gap-2 cursor-pointer"
                  >
                    <Link
                      to="#"
                      className="flex items-center gap-2 w-full text-gray-700"
                      onClick={() => {
                        onPostClick && onPostClick(post._id); // Call the new handler
                        setSearchResults(null);
                        setSearchQuery("");
                      }}
                    >
                      <span className="text-teal-500">📝</span>
                      <span className="truncate">
                        {post.title || post.caption || post.content}
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Drawer Menu */}
        {showMenu && (
          <>
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300 ease-in-out"
              onClick={() => setShowMenu(false)}
            />
            <div
              className="fixed left-0 top-0 h-full w-[85%] max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-out rounded-r-[1rem] overflow-hidden"
              style={{
                transform: showMenu ? "translateX(0)" : "translateX(-100%)",
              }}
            >
              {/* Menu Header */}
              <div className="bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-600 h-40">
                <div className="h-full px-6 py-4 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <Link
                      to="/profile"
                      onClick={() => setShowMenu(false)}
                      className="text-white/90 hover:text-white flex items-center"
                    >
                      <Edit2 size={18} className="mr-2" />
                      <span className="text-sm">Edit Profile</span>
                    </Link>
                    <button
                      onClick={() => setShowMenu(false)}
                      className="text-white/80 hover:text-white p-1"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 pb-4">
                    <div className="bg-teal-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-semibold uppercase overflow-hidden">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-8 h-8 object-cover rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        initials || <User size={20} />
                      )}
                    </div>
                    <div className="text-left">
                      <h2 className="text-white font-semibold">
                        {firstName} {lastName}
                      </h2>
                      <p className="text-white/80 text-sm">{email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Content */}
              <div className="p-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowFollowingModal(true);
                    }}
                    className="p-4 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl hover:shadow-md transition-shadow duration-300"
                  >
                    <span className="block text-2xl font-bold text-gray-800">
                      {following?.length || 0}
                    </span>
                    <span className="text-sm text-gray-600">Following</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowFollowersModal(true);
                    }}
                    className="p-4 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl hover:shadow-md transition-shadow duration-300"
                  >
                    <span className="block text-2xl font-bold text-gray-800">
                      {followers?.length || 0}
                    </span>
                    <span className="text-sm text-gray-600">Followers</span>
                  </button>
                </div>

                {/* Menu Links */}
                <nav className="space-y-1">
                  <Link
                    to="/my-posts"
                    onClick={() => setShowMenu(false)}
                    className="flex items-center w-full py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <User size={20} className="text-gray-600 mr-3" />
                    <span className="text-gray-800">My Posts</span>
                  </Link>
                  <button
                    onClick={openSettings}
                    className="flex items-center w-full py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Settings size={20} className="text-gray-600 mr-3" />
                    <span className="text-gray-800">Settings</span>
                  </button>

                  <div className="h-px bg-gray-200 my-4"></div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full py-3 px-4 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                  >
                    <LogOut size={20} className="mr-3" />
                    <span>Logout</span>
                  </button>
                </nav>
              </div>
            </div>
          </>
        )}

        {/* Notifications Panel */}
        {showNotifications && (
          <div className="fixed inset-0 z-50 pt-16 bg-black bg-opacity-50">
            <div className="h-full bg-white rounded-t-xl overflow-hidden">
              <div className="px-4 py-3 flex justify-between items-center border-b">
                <h2 className="font-semibold text-lg">Notifications</h2>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-auto h-[calc(100%-60px)]">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No notifications yet
                  </div>
                ) : (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`px-4 py-3 hover:bg-gray-50 ${
                          !notification.isRead ? "bg-teal-50" : ""
                        }`}
                        onClick={() =>
                          !notification.isRead &&
                          handleMarkAsRead(notification._id)
                        }
                      >
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center text-white mr-3 flex-shrink-0">
                            {notification.sender?.FirstName?.[0] || "U"}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(notification.createdAt)}
                              </span>
                              {notification.type === "follow-request" && (
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAccept(notification.sender._id);
                                    }}
                                    className="bg-green-500 hover:bg-green-600 text-white p-1 rounded-full transition-all"
                                  >
                                    <Check size={16} />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDecline(notification.sender._id);
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-all"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNotification(notification._id);
                                }}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Following Modal */}
        {showFollowingModal && (
          <div className="fixed inset-0 z-50 pt-16 bg-black bg-opacity-50">
            <div className="h-full bg-white rounded-t-xl overflow-hidden">
              <div className="px-4 py-3 flex justify-between items-center border-b sticky top-0 bg-white">
                <h2 className="font-semibold text-lg">Following</h2>
                <button
                  onClick={() => setShowFollowingModal(false)}
                  className="text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-auto h-[calc(100%-60px)]">
                {following?.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <User size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-gray-600 font-medium mb-1">
                      Not following anyone yet
                    </h3>
                    <p className="text-gray-500 text-sm">
                      When you follow someone, you'll see them here
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {following?.map((user) => (
                      <div key={user._id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg mr-3">
                            {user.FirstName?.[0]}
                            {user.LastName?.[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800">
                              {user.FirstName} {user.LastName}
                            </h4>
                            <p className="text-sm text-gray-500 truncate">
                              {user.Email}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Followers Modal */}
        {showFollowersModal && (
          <div className="fixed inset-0 z-50 pt-16 bg-black bg-opacity-50">
            <div className="h-full bg-white rounded-t-xl overflow-hidden">
              <div className="px-4 py-3 flex justify-between items-center border-b sticky top-0 bg-white">
                <h2 className="font-semibold text-lg">Followers</h2>
                <button
                  onClick={() => setShowFollowersModal(false)}
                  className="text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-auto h-[calc(100%-60px)]">
                {followers?.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <User size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-gray-600 font-medium mb-1">
                      No followers yet
                    </h3>
                    <p className="text-gray-500 text-sm">
                      When people follow you, you'll see them here
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {followers?.map((user) => (
                      <div key={user._id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg mr-3">
                            {user.FirstName?.[0]}
                            {user.LastName?.[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800">
                              {user.FirstName} {user.LastName}
                            </h4>
                            <p className="text-sm text-gray-500 truncate">
                              {user.Email}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Following Modal */}
      {showFollowingModal && (
        <div className="fixed inset-0 z-50 pt-16 bg-black bg-opacity-50">
          <div className="h-full bg-white rounded-t-xl overflow-hidden">
            <div className="px-4 py-3 flex justify-between items-center border-b sticky top-0 bg-white">
              <h2 className="font-semibold text-lg">Following</h2>
              <button
                onClick={() => setShowFollowingModal(false)}
                className="text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-auto h-[calc(100%-60px)]">
              {following?.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <User size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-gray-600 font-medium mb-1">
                    Not following anyone yet
                  </h3>
                  <p className="text-gray-500 text-sm">
                    When you follow someone, you'll see them here
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {following?.map((user) => (
                    <div key={user._id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg mr-3">
                          {user.FirstName?.[0]}
                          {user.LastName?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-800">
                            {user.FirstName} {user.LastName}
                          </h4>
                          <p className="text-sm text-gray-500 truncate">
                            {user.Email}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Followers Modal */}
      {showFollowersModal && (
        <div className="fixed inset-0 z-50 pt-16 bg-black bg-opacity-50">
          <div className="h-full bg-white rounded-t-xl overflow-hidden">
            <div className="px-4 py-3 flex justify-between items-center border-b sticky top-0 bg-white">
              <h2 className="font-semibold text-lg">Followers</h2>
              <button
                onClick={() => setShowFollowersModal(false)}
                className="text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-auto h-[calc(100%-60px)]">
              {followers?.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <User size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-gray-600 font-medium mb-1">
                    No followers yet
                  </h3>
                  <p className="text-gray-500 text-sm">
                    When people follow you, you'll see them here
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {followers?.map((user) => (
                    <div key={user._id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg mr-3">
                          {user.FirstName?.[0]}
                          {user.LastName?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-800">
                            {user.FirstName} {user.LastName}
                          </h4>
                          <p className="text-sm text-gray-500 truncate">
                            {user.Email}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MobileHeader;
