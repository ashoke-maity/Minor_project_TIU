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
  Trash2
} from "lucide-react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

function MobileHeader() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
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
        const { Email, FirstName, LastName } = response.data.user;
        setEmail(Email);
        setFirstName(FirstName);
        setLastName(LastName);
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
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      toast.info(notification.message);
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

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
      setUnreadCount(response.data.notifications.filter(n => !n.isRead).length);
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
      setNotifications(prev => prev.filter(n => n.sender?._id !== senderId));
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
      setNotifications(prev => prev.filter(n => n.sender?._id !== senderId));
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
      setNotifications(prev =>
        prev.map(n =>
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
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
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      setUnreadCount(prev => Math.max(0, prev - 1));
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

  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
        <div className="px-4 py-2 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/home"
            className="text-xl font-bold flex items-center gap-1 text-gray-800"
          >
            Alumni<span className="text-teal-500">Connect</span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button 
              className="text-gray-600 relative"
              onClick={toggleNotifications}
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            
            <button
              onClick={toggleMenu}
              className="text-gray-600"
            >
              {showMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-2">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-9 pr-4 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
          </div>
        </div>

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
                        className={`px-4 py-3 hover:bg-gray-50 ${!notification.isRead ? 'bg-teal-50' : ''}`}
                        onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
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

        {/* Menu Panel */}
        {showMenu && (
          <div className="fixed inset-0 z-50 pt-16 bg-black bg-opacity-50">
            <div className="h-full bg-white rounded-t-xl overflow-hidden">
              <div className="px-4 py-3 flex justify-between items-center border-b">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-teal-500 text-white flex items-center justify-center mr-3 text-sm font-bold shadow-sm">
                    {initials || <User size={20} />}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {firstName} {lastName}
                    </h3>
                    <p className="text-xs text-gray-500">{email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowMenu(false)}
                  className="text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="px-4 py-4 space-y-1">
                <button 
                  onClick={openSettings}
                  className="flex items-center w-full py-3 px-2 rounded-lg hover:bg-gray-100"
                >
                  <Settings size={20} className="text-gray-600 mr-3" />
                  <span className="text-gray-800">Settings</span>
                </button>
                
                <div className="h-px bg-gray-200 my-2"></div>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full py-3 px-2 rounded-lg hover:bg-gray-100 text-red-600"
                >
                  <LogOut size={20} className="mr-3" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default MobileHeader; 