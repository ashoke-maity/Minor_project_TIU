import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import {
  Bell,
  User,
  Search,
  LogOut,
  Settings,
  Users,
  Menu,
  X,
  Trash2,
  Check,
} from "lucide-react";

function Header({ onUserClick, onPostClick }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchDropdownRef = useRef(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [profileImage, setProfileImage] = useState(""); // Add this state

  const initials = `${firstName?.[0] ?? ""}${
    lastName?.[0] ?? ""
  }`.toUpperCase();

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const notifRes = await axios.get(
        `${import.meta.env.VITE_USER_API_URL}/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(notifRes.data.notifications);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${import.meta.env.VITE_USER_API_URL}/user/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { Email, FirstName, LastName, profileImage } = response.data.user;
      setEmail(Email);
      setFirstName(FirstName);
      setLastName(LastName);
      setProfileImage(profileImage);
    } catch (err) {
      console.log("Failed to fetch user info", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchProfile();

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setNotificationOpen(false);
      }
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target)
      ) {
        setSearchResults(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAccept = async (senderId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${import.meta.env.VITE_USER_API_URL}/accept-follow`,
        { senderId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications((prev) =>
        prev.filter((n) => n.sender?._id !== senderId)
      );
      toast.success("Connection request accepted!");
    } catch (err) {
      console.error("Failed to accept request", err);
      toast.error("Failed to accept connection.");
    }
  };

  const handleDecline = async (senderId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${import.meta.env.VITE_USER_API_URL}/reject-request`,
        { senderId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications((prev) =>
        prev.filter((n) => n.sender?._id !== senderId)
      );
      toast.info("Connection request declined.");
    } catch (err) {
      console.error("Failed to decline request", err);
      toast.error("Failed to decline connection.");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const markAll = notifications.map((notif) =>
        axios.put(
          `${import.meta.env.VITE_USER_API_URL}/${notif._id}/read`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      await Promise.all(markAll);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${import.meta.env.VITE_USER_API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const openSettings = () => {
    setDropdownOpen(false);
    navigate("/settings");
  };

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

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/home"
          className="text-2xl font-bold flex items-center gap-2 text-gray-800"
        >
          Alumni<span className="text-teal-500">Connect</span>
        </Link>

        <button
          className="md:hidden flex items-center text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 justify-center ml-8">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all"
              // onClick={handleSearch}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // handleSearch();
                }
              }}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400 pointer-events-none"
              size={16}
            />
          </div>
        </div>

        {/* notification */}
        <div className="hidden md:flex items-center gap-6 text-gray-700 text-sm font-medium">
          <div className="relative" ref={notificationRef}>
            <button
              className="relative flex items-center gap-1 hover:text-teal-600 transition-colors"
              title="Notifications"
              onClick={() => setNotificationOpen(!notificationOpen)}
            >
              <Bell size={20} />
              {notifications.some((n) => !n.isRead) && (
                <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
              )}
              <span className="hidden lg:inline">Notification</span>
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 p-3 border text-sm overflow-hidden">
                <div className="flex justify-between items-center border-b pb-2 mb-2">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  <span
                    className="text-xs text-teal-600 cursor-pointer hover:underline"
                    onClick={handleMarkAllAsRead}
                  >
                    Mark all as read
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-center text-sm text-gray-500">
                      No new notifications
                    </p>
                  ) : (
                    notifications.map((notif, index) => (
                      <div
                        key={notif._id || index}
                        className="py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors px-2 rounded flex justify-between items-start"
                      >
                        <div>
                          <p className="text-sm">{notif.message}</p>
                          <span className="text-xs text-gray-500">
                            {notif.timeAgo || notif.createdAt}
                          </span>

                          {/* Only show buttons for pending follow requests */}
                          {notif.type === "follow-request" && notif.sender && (
                            <div className="mt-2 flex gap-2">
                              <button
                                onClick={() => handleAccept(notif.sender._id)}
                                className="bg-green-500 hover:bg-green-600 text-white p-1 rounded-full transition-all"
                                title="Accept"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={() => handleDecline(notif.sender._id)}
                                className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-all"
                                title="Decline"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteNotification(notif._id)}
                          title="Delete"
                          className="text-gray-400 hover:text-red-500 ml-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-2 pt-2 text-center">
                  <Link
                    to="/notifications"
                    className="text-teal-600 text-sm font-medium hover:underline"
                  >
                    View All Notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* my metworks */}
          <div className="w-px h-6 bg-gray-300"></div>

          <Link
            to="/network"
            className="flex items-center gap-1 hover:text-teal-600 transition-colors"
          >
            <Users size={20} />
            <span className="hidden lg:inline">My Network</span>
          </Link>

          {/* my profile */}
          <div className="w-px h-6 bg-gray-300"></div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 text-gray-700 rounded-full border border-gray-300 hover:border-teal-500 transition-colors px-2 py-1 text-sm cursor-pointer"
            >
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
              <span className="hidden lg:inline">{firstName}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-30 bg-white rounded-md shadow-lg border text-sm z-50">
                <button
                  onClick={openSettings}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                >
                  <Settings size={16} />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-red-600"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Display Search Results */}
        {searchQuery.trim() && (
          <div
            ref={searchDropdownRef}
            className="absolute left-[41.25rem] -translate-x-1/2 mt-1 w-110 max-h-60 bg-white border border-gray-200 rounded-b-xl shadow-lg z-50 overflow-y-auto transition-all"
            style={{ top: "73%" }}
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

        {/* Mobile view */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-2 bg-white border rounded-md shadow p-4 text-sm space-y-3">
            <Link
              to="/profile"
              className="block hover:text-teal-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              to="/notifications"
              className="block hover:text-teal-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Notifications
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
