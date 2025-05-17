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
} from "lucide-react";

function Header() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const initials = `${firstName?.[0] ?? ""}${
    lastName?.[0] ?? ""
  }`.toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
        {/* Logo */}
        <Link
          to="/home"
          className="text-2xl font-bold flex items-center gap-2 text-gray-800"
        >
          Alumni<span className="text-teal-500">Connect</span>
        </Link>

        {/* Center Search */}
        <div className="flex-1 flex justify-center ml-8">
          <div className="hidden md:flex items-center relative w-96">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-1.5 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-6 text-gray-700 text-sm font-medium">
          <button
            className="flex items-center gap-1 hover:text-teal-600"
            title="Notifications"
          >
            <Bell size={20} />
            <span>Notification</span>
          </button>

          <button
            className="flex items-center gap-1 hover:text-teal-600"
            title="Jobs"
          >
            <Plus size={20} />
            <span>Jobs</span>
          </button>

          <button
            className="flex items-center gap-1 hover:text-teal-600"
            title="My Network"
          >
            <Users size={20} />
            <span>My Network</span>
          </button>

          <div className="w-px h-6 bg-gray-300" />

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full text-sm font-bold"
              title="User"
            >
              {initials || <User size={20} />}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 p-3 border text-sm">
                {/* Removed name and email display here */}

                <Link
                  to="/usersetting"
                  className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-100"
                >
                  <Settings size={16} /> Settings
                </Link>
                <Link
                  to="/privacypolicy"
                  className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-100"
                >
                  <ShieldCheck size={16} /> Privacy Policy
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-2 py-2 rounded text-red-600 hover:bg-gray-100 w-full text-left"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
