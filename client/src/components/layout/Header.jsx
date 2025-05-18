import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Bell,
  User,
  Search,
  LogOut,
  Settings,
  ShieldCheck,
  Plus,
  Users,
  Menu,
  X,
} from "lucide-react";

function Header() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const openSettings = () => {
    setDropdownOpen(false);
    navigate("/settings");
  };

  const initials = `${firstName?.[0] ?? ""}${
    lastName?.[0] ?? ""
  }`.toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/home"
            className="text-2xl font-bold flex items-center gap-2 text-gray-800"
          >
            Alumni<span className="text-teal-500">Connect</span>
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Center Search */}
          <div className="hidden md:flex flex-1 justify-center ml-8">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={16}
              />
            </div>
          </div>

          {/* Right Icons - Desktop */}
          <div className="hidden md:flex items-center gap-6 text-gray-700 text-sm font-medium">
            {/* Notification Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button
                className="flex items-center gap-1 hover:text-teal-600 transition-colors"
                title="Notifications"
                onClick={() => setNotificationOpen(!notificationOpen)}
              >
                <Bell size={20} />
                <span className="hidden lg:inline">Notification</span>
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 p-3 border text-sm overflow-hidden animation-fadeIn">
                  <div className="flex justify-between items-center border-b pb-2 mb-2">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                    <span className="text-xs text-teal-600 cursor-pointer hover:underline">Mark all as read</span>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {/* Sample notifications */}
                    <div className="py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors px-2 rounded">
                      <p className="text-sm">John Doe liked your post</p>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <div className="py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors px-2 rounded">
                      <p className="text-sm">New job opportunity posted</p>
                      <span className="text-xs text-gray-500">Yesterday</span>
                    </div>
                    <div className="py-2 hover:bg-gray-50 transition-colors px-2 rounded">
                      <p className="text-sm">Alumni meetup event next week</p>
                      <span className="text-xs text-gray-500">3 days ago</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 pt-2 text-center">
                    <a href="#" className="text-teal-600 text-sm font-medium hover:underline">
                      View All Notifications
                    </a>
                  </div>
                </div>
              )}
            </div>

            <button
              className="flex items-center gap-1 hover:text-teal-600 transition-colors"
              title="Jobs"
            >
              <Plus size={20} />
              <span className="hidden lg:inline">Jobs</span>
            </button>

            <button
              className="flex items-center gap-1 hover:text-teal-600 transition-colors"
              title="My Network"
            >
              <Users size={20} />
              <span className="hidden lg:inline">My Network</span>
            </button>

            <div className="w-px h-6 bg-gray-300"></div>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-9 h-9 flex items-center justify-center bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-full text-sm font-bold shadow-sm hover:shadow transition-shadow"
                title="User"
              >
                {initials || <User size={20} />}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 p-2 border text-sm overflow-hidden animation-fadeIn">                  
                  <button
                    onClick={openSettings}
                    className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition-colors w-full text-left"
                  >
                    <Settings size={16} /> Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded text-red-600 hover:bg-gray-100 transition-colors w-full text-left"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-2">
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400 mb-3"
              />
              <Search
                className="absolute left-7 top-[76px] text-gray-400"
                size={16}
              />
            </div>
            
            <nav className="px-4 py-2 space-y-2">
              <button className="flex items-center gap-3 w-full py-2 px-2 hover:bg-gray-100 rounded-md transition-colors">
                <Bell size={20} className="text-teal-500" />
                <span>Notifications</span>
              </button>
              
              <button className="flex items-center gap-3 w-full py-2 px-2 hover:bg-gray-100 rounded-md transition-colors">
                <Plus size={20} className="text-teal-500" />
                <span>Jobs</span>
              </button>
              
              <button className="flex items-center gap-3 w-full py-2 px-2 hover:bg-gray-100 rounded-md transition-colors">
                <Users size={20} className="text-teal-500" />
                <span>My Network</span>
              </button>
              
              <div className="h-px bg-gray-200 my-2"></div>
              
              <button 
                onClick={openSettings}
                className="flex items-center gap-3 w-full py-2 px-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Settings size={20} className="text-gray-700" />
                <span>Settings</span>
              </button>
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 w-full py-2 px-2 hover:bg-gray-100 rounded-md transition-colors text-red-600"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

export default Header;
