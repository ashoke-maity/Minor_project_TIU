import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import ProfileSidebar from "../components/layout/ProfileSidebar";
import axios from "axios";
import {
  Users,
  Search,
  UserPlus,
  UserCheck,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
    following: 0,
  });
  const [showConnectionsPopup, setShowConnectionsPopup] = useState(false);
  const [showFollowingPopup, setShowFollowingPopup] = useState(false);
  const [connectionsList, setConnectionsList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // "all", "connections", "following"
  const connectionIds = new Set(connectionsList.map((u) => u._id));
  const followingIds = new Set(followingList.map((u) => u._id));

  useEffect(() => {
    fetchUsers();
    fetchUserProfile();
    fetchConnectionStats();
  }, []);
  
  // Debug user profile data
  useEffect(() => {
    if (userProfile) {
      console.log("User Profile Data:", userProfile);
      console.log("Profile Image URL:", userProfile.profileImage);
    }
  }, [userProfile]);

  const fetchConnectionStats = async () => {
    try {
      const token = localStorage.getItem("authToken");

      // Fetch followers (connections)
      const followersRes = await axios.get(
        `${import.meta.env.VITE_USER_API_URL}/followers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch following
      const followingRes = await axios.get(
        `${import.meta.env.VITE_USER_API_URL}/following`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setConnectionStats({
        connections: followersRes.data.followers?.length || 0,
        following: followingRes.data.following?.length || 0,
      });
      setConnectionsList(followersRes.data.followers || []);
      setFollowingList(followingRes.data.following || []);
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

  const handleRemoveFollower = async (followerId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${import.meta.env.VITE_USER_API_URL}/remove-follower`,
        { followerId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update UI after removal
      setConnectionsList((prev) => prev.filter((u) => u._id !== followerId));
      setConnectionStats((prev) => ({
        ...prev,
        connections: prev.connections - 1,
      }));
    } catch (err) {
      console.error("Failed to remove follower:", err);
    }
  };

  const handleUnfollow = async (followingId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${import.meta.env.VITE_USER_API_URL}/unfollow`,
        { followingId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update UI after unfollow
      setFollowingList((prev) => prev.filter((u) => u._id !== followingId));
      setConnectionStats((prev) => ({
        ...prev,
        following: prev.following - 1,
      }));
    } catch (err) {
      console.error("Failed to unfollow user:", err);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.FirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.LastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFilteredUsersByTab = () => {
    switch (activeTab) {
      case "connections":
        return connectionsList;
      case "following":
        return followingList;
      default:
        return filteredUsers;
    }
  };

  // Users who follow you but you don't follow back
  const getFollowBackUsers = () => {
    return connectionsList.filter((user) => !followingIds.has(user._id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const initials = userProfile
    ? `${userProfile.FirstName?.[0] ?? ""}${
        userProfile.LastName?.[0] ?? ""
      }`.toUpperCase()
    : "";

  // Get follow back users for this render
  const followBackUsers = getFollowBackUsers();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Hidden on mobile */}
            <div className="hidden lg:block lg:col-span-1">
              <ProfileSidebar
                initials={initials}
                firstName={userProfile?.FirstName}
                lastName={userProfile?.LastName}
                connectionStats={connectionStats}
                setShowConnectionsPopup={setShowConnectionsPopup}
                setShowFollowingPopup={setShowFollowingPopup}
                navigate={navigate}
                profileImage={userProfile?.profileImage}
              />
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
                    Connect with other alumni and expand your professional
                    network
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Show Follow Back users first */}
                  {activeTab === "all" &&
                    followBackUsers.map((user) => {
                      const isRequested = sentRequests.includes(user._id);
                      return (
                        <div
                          key={user._id + "-followback"}
                          className="bg-white rounded-lg border border-yellow-200 bg-yellow-50 p-4 hover:shadow-md transition-shadow duration-300"
                        >
                          <div className="flex items-center space-x-4">
                            <div 
                              onClick={() => navigate(`/profile/${user._id}`)}
                              className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-semibold text-lg cursor-pointer hover:shadow-md overflow-hidden"
                            >
                              {user.profileImage ? (
                                <img
                                  src={user.profileImage}
                                  alt={`${user.FirstName} ${user.LastName}`}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                  crossOrigin="anonymous"
                                  onError={(e) => {
                                    console.error("Follow back user image failed to load:", user.profileImage);
                                    e.target.style.display = 'none';
                                    e.target.parentNode.innerHTML = `${user.FirstName?.[0] || ''}${user.LastName?.[0] || ''}`;
                                  }}
                                  onLoad={() => console.log("Follow back user image loaded successfully:", user._id)}
                                />
                              ) : (
                                <>
                                  {user.FirstName?.[0] || ''}
                                  {user.LastName?.[0] || ''}
                                </>
                              )}
                            </div>
                            <div 
                              className="flex-1 cursor-pointer"
                              onClick={() => navigate(`/profile/${user._id}`)}
                            >
                              <h3 className="text-lg font-semibold text-yellow-700 hover:text-yellow-600">
                                {user.FirstName} {user.LastName}
                              </h3>
                              <p className="text-sm text-yellow-600 hidden md:block">
                                {user.Email}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 flex gap-2">
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
                                className="w-full px-4 py-2 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 rounded-md transition-colors duration-300"
                              >
                                Follow Back
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
                
                {/* Mobile Profile Info - Visible only on mobile */}
                <div className="lg:hidden border-b border-gray-200 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
                      {userProfile?.profileImage ? (
                        <img
                          src={userProfile.profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            console.error("Mobile profile image failed to load:", userProfile.profileImage);
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML = initials;
                          }}
                          onLoad={() => console.log("Mobile profile image loaded successfully")}
                        />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {userProfile?.FirstName} {userProfile?.LastName}
                      </h3>
                      <div className="flex space-x-3 text-xs text-gray-600 mt-1">
                        <span>{connectionStats.connections} Connections</span>
                        <span>•</span>
                        <span>{connectionStats.following} Following</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Tabs - Visible only on mobile */}
                <div className="lg:hidden border-b border-gray-200">
                  <div className="flex space-x-4 px-4 py-2">
                    <button
                      onClick={() => setActiveTab("all")}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        activeTab === "all"
                          ? "bg-teal-50 text-teal-600"
                          : "text-gray-600 hover:text-teal-600"
                      }`}
                    >
                      All Users
                    </button>
                    <button
                      onClick={() => setActiveTab("connections")}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        activeTab === "connections"
                          ? "bg-teal-50 text-teal-600"
                          : "text-gray-600 hover:text-teal-600"
                      }`}
                    >
                      Connections
                    </button>
                    <button
                      onClick={() => setActiveTab("following")}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        activeTab === "following"
                          ? "bg-teal-50 text-teal-600"
                          : "text-gray-600 hover:text-teal-600"
                      }`}
                    >
                      Following
                    </button>
                  </div>
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
                    <Search
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={20}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {getFilteredUsersByTab()
                      // Exclude follow back users from main list in "all" tab
                      .filter(
                        (user) =>
                          !(
                            activeTab === "all" &&
                            followBackUsers.some((fb) => fb._id === user._id)
                          )
                      )
                      .map((user) => {
                        const isRequested = sentRequests.includes(user._id);
                        const isConnected =
                          connectionIds.has(user._id) ||
                          followingIds.has(user._id);
                        const isInConnectionsList = connectionsList.some(
                          (conn) => conn._id === user._id
                        );
                        const isInFollowingList = followingList.some(
                          (follow) => follow._id === user._id
                        );

                        return (
                          <div
                            key={user._id}
                            className={`bg-white rounded-lg border ${
                              isConnected ||
                              isInConnectionsList ||
                              isInFollowingList
                                ? "border-teal-200 bg-teal-50"
                                : "border-gray-200"
                            } p-4 hover:shadow-md transition-shadow duration-300`}
                          >
                            <div className="flex items-center space-x-4">
                              <div
                                onClick={() => navigate(`/profile/${user._id}`)}
                                className={`w-12 h-12 rounded-full ${
                                  isConnected ||
                                  isInConnectionsList ||
                                  isInFollowingList
                                    ? "bg-gradient-to-br from-teal-500 to-emerald-400"
                                    : "bg-gradient-to-br from-teal-400 to-emerald-500"
                                } flex items-center justify-center text-white font-semibold text-lg cursor-pointer hover:shadow-md overflow-hidden`}
                              >
                                {user.profileImage ? (
                                  <img
                                    src={user.profileImage}
                                    alt={`${user.FirstName} ${user.LastName}`}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                    crossOrigin="anonymous"
                                    onError={(e) => {
                                      console.error("Profile image failed to load:", user.profileImage);
                                      e.target.style.display = 'none';
                                      e.target.parentNode.innerHTML = `${user.FirstName?.[0] || ''}${user.LastName?.[0] || ''}`;
                                    }}
                                    onLoad={() => console.log("User image loaded successfully:", user._id)}
                                  />
                                ) : (
                                  <>
                                    {user.FirstName?.[0] || ''}
                                    {user.LastName?.[0] || ''}
                                  </>
                                )}
                              </div>
                              <div 
                                className="flex-1 cursor-pointer" 
                                onClick={() => navigate(`/profile/${user._id}`)}
                              >
                                <h3
                                  className={`text-lg font-semibold ${
                                    isConnected ||
                                    isInConnectionsList ||
                                    isInFollowingList
                                      ? "text-teal-700"
                                      : "text-gray-800"
                                  } hover:text-teal-600`}
                                >
                                  {user.FirstName} {user.LastName}
                                </h3>
                                <p
                                  className={`text-sm ${
                                    isConnected ||
                                    isInConnectionsList ||
                                    isInFollowingList
                                      ? "text-teal-600"
                                      : "text-gray-500"
                                  } hidden md:block`}
                                >
                                  {user.Email}
                                </p>
                              </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                              {isConnected ||
                              isInConnectionsList ||
                              isInFollowingList ? (
                                <>
                                  <button
                                    disabled
                                    className="flex-1 px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 rounded-md cursor-not-allowed border border-teal-200"
                                  >
                                    <div className="flex items-center justify-center">
                                      <UserCheck size={16} className="mr-2" />
                                      Connected
                                    </div>
                                  </button>
                                  {isInConnectionsList && (
                                    <button
                                      onClick={() =>
                                        handleRemoveFollower(user._id)
                                      }
                                      className="px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors duration-300"
                                    >
                                      Remove
                                    </button>
                                  )}
                                  {isInFollowingList && (
                                    <button
                                      onClick={() => handleUnfollow(user._id)}
                                      className="px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors duration-300"
                                    >
                                      Unfollow
                                    </button>
                                  )}
                                </>
                              ) : isRequested ? (
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
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                {connectionsList.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No connections yet.
                  </p>
                ) : (
                  connectionsList.map((user) => (
                    <div key={user._id} className="flex items-center mb-3">
                      <div 
                        onClick={() => navigate(`/profile/${user._id}`)}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 text-white flex items-center justify-center text-base font-semibold mr-3 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      >
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={`${user.FirstName} ${user.LastName}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                            onError={(e) => {
                              console.error("Connection popup image failed to load:", user.profileImage);
                              e.target.style.display = 'none';
                              e.target.parentNode.innerHTML = `${user.FirstName?.[0] || ''}${user.LastName?.[0] || ''}`;
                            }}
                            onLoad={() => console.log("Connection popup image loaded successfully:", user._id)}
                          />
                        ) : (
                          <>
                            {user.FirstName?.[0] || ''}
                            {user.LastName?.[0] || ''}
                          </>
                        )}
                      </div>
                      <span 
                        onClick={() => navigate(`/profile/${user._id}`)}
                        className="text-gray-800 font-medium cursor-pointer hover:text-teal-600 transition-colors"
                      >
                        {user.FirstName} {user.LastName}
                      </span>
                      <button
                        onClick={() => handleRemoveFollower(user._id)}
                        className="ml-auto px-3 py-1 text-red-600 text-xs font-medium border border-red-200 rounded-md hover:bg-red-50 transition-colors duration-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Following Popup */}
        {showFollowingPopup && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                {followingList.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Not following anyone yet.
                  </p>
                ) : (
                  followingList.map((user) => (
                    <div key={user._id} className="flex items-center mb-3">
                      <div 
                        onClick={() => navigate(`/profile/${user._id}`)}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 text-white flex items-center justify-center text-base font-semibold mr-3 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      >
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={`${user.FirstName} ${user.LastName}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                            onError={(e) => {
                              console.error("Following popup image failed to load:", user.profileImage);
                              e.target.style.display = 'none';
                              e.target.parentNode.innerHTML = `${user.FirstName?.[0] || ''}${user.LastName?.[0] || ''}`;
                            }}
                            onLoad={() => console.log("Following popup image loaded successfully:", user._id)}
                          />
                        ) : (
                          <>
                            {user.FirstName?.[0] || ''}
                            {user.LastName?.[0] || ''}
                          </>
                        )}
                      </div>
                      <span 
                        onClick={() => navigate(`/profile/${user._id}`)}
                        className="text-gray-800 font-medium cursor-pointer hover:text-teal-600 transition-colors"
                      >
                        {user.FirstName} {user.LastName}
                      </span>
                      <button
                        onClick={() => handleUnfollow(user._id)}
                        className="ml-auto px-3 py-1 text-red-600 text-xs font-medium border border-red-200 rounded-md hover:bg-red-50 transition-colors duration-300"
                      >
                        Unfollow
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Network;