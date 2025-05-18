import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Bell,
  User,
  Search,
  LogOut,
  X,
  Settings,
  Menu
} from "lucide-react";

function MobileHeader() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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
  }, []);

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
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
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
                <div className="divide-y">
                  {/* Sample notifications */}
                  <div className="px-4 py-3 hover:bg-gray-50">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 flex-shrink-0">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-800">
                          <span className="font-medium">John Doe</span> liked your post
                        </p>
                        <span className="text-xs text-gray-500">2 hours ago</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-4 py-3 hover:bg-gray-50">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 flex-shrink-0">
                        <Bell size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-800">
                          New job opportunity posted by <span className="font-medium">ABC Company</span>
                        </p>
                        <span className="text-xs text-gray-500">Yesterday</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-4 py-3 hover:bg-gray-50">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3 flex-shrink-0">
                        <Bell size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-800">
                          Alumni meetup event next week
                        </p>
                        <span className="text-xs text-gray-500">3 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>
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