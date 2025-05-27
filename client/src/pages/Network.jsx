import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, Search, User, Link2, ChevronLeft, UserPlus, UserCheck, Bookmark, Calendar, Briefcase, IndianRupee, ChevronRight, X, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Network() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [connectionStats, setConnectionStats] = useState({
    connections: 0,
    following: 0
  });
  const [showConnectionsPopup, setShowConnectionsPopup] = useState(false);
  const [showFollowingPopup, setShowFollowingPopup] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchUserProfile();
    fetchConnectionStats();
  }, []);

  const fetchConnectionStats = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_USER_API_URL}/user/connections`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setConnectionStats({
        connections: response.data.connections?.length || 0,
        following: response.data.following?.length || 0
      });
    } catch (err) {
      console.error("Error fetching connection stats:", err);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_USER_API_URL}/user/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setUserProfile(response.data.user);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_USER_API_URL}/all-users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setUsers(response.data.users);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setLoading(false);
    }
  };

  const handleFollow = async (targetUserId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${import.meta.env.VITE_USER_API_URL}/follow-request`,
        { targetUserId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 1) {
        setSentRequests((prev) => [...prev, targetUserId]);
      }
    } catch (error) {
      console.error("Failed to send connection request", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.FirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.LastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const initials = userProfile ? `${userProfile.FirstName?.[0] ?? ""}${userProfile.LastName?.[0] ?? ""}`.toUpperCase() : "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button 
                onClick={() => navigate(-1)} 
                className="mr-4 text-gray-600 hover:text-teal-600"
              >
                <ChevronLeft size={24} />
              </button>
              <h1 className="text-xl font-semibold text-gray-800">Network</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-600 h-24 relative">
                <div className="absolute inset-0 bg-black opacity-10"></div>
              </div>
              <div className="px-6 pb-6 pt-0 -mt-12 relative z-10">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-teal-500 to-emerald-400 text-white flex items-center justify-center text-2xl font-bold shadow-xl mx-auto">
                  {initials}
                </div>
                <h2 className="text-xl font-bold text-gray-800 mt-4 text-center">
                  {userProfile?.FirstName || ""} {userProfile?.LastName || ""}
                </h2>
                
                {/* Connection Stats */}
                <div className="grid grid-cols-2 gap-6 mt-4 w-full">
                  <div 
                    className="text-center cursor-pointer hover:bg-teal-50 p-2 rounded-lg transition-colors duration-300"
                    onClick={() => setShowConnectionsPopup(true)}
                  >
                    <div className="flex items-center justify-center space-x-2 text-teal-600 mb-1">
                      <UserCheck size={18} />
                      <span className="text-lg font-semibold">{connectionStats.connections}</span>
                    </div>
                    <p className="text-sm text-gray-600">Connections</p>
                  </div>
                  <div 
                    className="text-center cursor-pointer hover:bg-teal-50 p-2 rounded-lg transition-colors duration-300"
                    onClick={() => setShowFollowingPopup(true)}
                  >
                    <div className="flex items-center justify-center space-x-2 text-teal-600 mb-1">
                      <UserPlus size={18} />
                      <span className="text-lg font-semibold">{connectionStats.following}</span>
                    </div>
                    <p className="text-sm text-gray-600">Following</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden p-5 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Quick Links
              </h2>
              <div className="space-y-3">
                <a
                  href="#"
                  className="flex items-center py-2 px-3 hover:bg-teal-50 rounded-lg transition-colors duration-300"
                >
                  <Bookmark size={18} className="text-teal-500 mr-3" />
                  <span className="text-gray-700">Bookmarks</span>
                  <ChevronRight size={16} className="ml-auto text-gray-400" />
                </a>
                <div className="pl-8 space-y-1">
                  <a
                    href="#"
                    className="block text-sm text-teal-600 hover:underline py-1"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/my-posts?view=bookmarks");
                    }}
                  >
                    View Saved Bookmarks
                  </a>
                </div>
                <a
                  href="#"
                  className="flex items-center py-2 px-3 hover:bg-teal-50 rounded-lg transition-colors duration-300"
                >
                  <Calendar size={18} className="text-teal-500 mr-3" />
                  <span className="text-gray-700">Events</span>
                  <ChevronRight size={16} className="ml-auto text-gray-400" />
                </a>
                <div className="pl-8 space-y-1">
                  <a
                    href="#"
                    className="block text-sm text-teal-600 hover:underline py-1"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/my-posts?view=events");
                    }}
                  >
                    Upcoming Events
                  </a>
                </div>
                <a
                  href="#"
                  className="flex items-center py-2 px-3 hover:bg-teal-50 rounded-lg transition-colors duration-300"
                >
                  <Briefcase size={18} className="text-teal-500 mr-3" />
                  <span className="text-gray-700">Jobs</span>
                  <ChevronRight size={16} className="ml-auto text-gray-400" />
                </a>
                <div className="pl-8 space-y-1">
                  <a
                    href="#"
                    className="block text-sm text-teal-600 hover:underline py-1"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/my-posts?view=jobs");
                    }}
                  >
                    Available Opportunities
                  </a>
                </div>
                <a
                  href="#"
                  className="flex items-center py-2 px-3 hover:bg-teal-50 rounded-lg transition-colors duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/my-posts?view=posts");
                  }}
                >
                  <Image size={18} className="text-teal-500 mr-3" />
                  <span className="text-gray-700">My Posts</span>
                  <ChevronRight size={16} className="ml-auto text-gray-400" />
                </a>
                <a
                  href="#"
                  className="flex items-center py-2 px-3 hover:bg-teal-50 rounded-lg transition-colors duration-300"
                >
                  <IndianRupee size={18} className="text-teal-500 mr-3" />
                  <span className="text-gray-700">Donations</span>
                  <ChevronRight size={16} className="ml-auto text-gray-400" />
                </a>
              </div>

              {/* Footer for credits */}
              <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400">
                <p className="mb-1">© 2024 AlumniConnect</p>
                <div className="flex space-x-2">
                  <a
                    href="#"
                    className="hover:text-teal-500 transition-colors"
                  >
                    About
                  </a>
                  <span>•</span>
                  <a
                    href="#"
                    className="hover:text-teal-500 transition-colors"
                  >
                    Terms
                  </a>
                  <span>•</span>
                  <a
                    href="#"
                    className="hover:text-teal-500 transition-colors"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Users size={24} className="text-teal-500 mr-2" />
                  My Network
                </h2>
                <p className="mt-1 text-gray-600">
                  Connect with other alumni and expand your professional network
                </p>
              </div>

              <div className="p-6">
                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="Search alumni..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredUsers.map((user) => {
                    const isRequested = sentRequests.includes(user._id);
                    return (
                      <div
                        key={user._id}
                        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-semibold text-lg">
                            {user.FirstName[0]}
                            {user.LastName[0]}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {user.FirstName} {user.LastName}
                            </h3>
                            <p className="text-sm text-gray-500">{user.Email}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          {isRequested ? (
                            <button
                              disabled
                              className="w-full px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-md cursor-not-allowed"
                            >
                              Request Sent
                            </button>
                          ) : (
                            <button
                              onClick={() => handleFollow(user._id)}
                              className="w-full px-4 py-2 text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-md transition-colors duration-300"
                            >
                              Connect
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connections Popup */}
      {showConnectionsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <UserCheck size={20} className="text-teal-500 mr-2" />
                My Connections
              </h3>
              <button
                onClick={() => setShowConnectionsPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-4rem)]">
              <p className="text-gray-500 text-center py-4">Coming soon...</p>
            </div>
          </div>
        </div>
      )}

      {/* Following Popup */}
      {showFollowingPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <UserPlus size={20} className="text-teal-500 mr-2" />
                Following
              </h3>
              <button
                onClick={() => setShowFollowingPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-4rem)]">
              <p className="text-gray-500 text-center py-4">Coming soon...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Network; 