import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../layout/Header";
import ProfileSidebar from "../../layout/ProfileSidebar";
import PostCard from "../web/PostCard";
import { X, UserCheck, UserPlus } from "lucide-react";

function getEvents() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    eventPosts: [],
    loading: true,
    error: null,
    firstName: "",
    lastName: "",
    connectionStats: { connections: 0, following: 0 },
    connectionsList: [],
    followingList: [],
    showConnectionsPopup: false,
    showFollowingPopup: false,
  });

  const fetchData = async (endpoint) => {
    const token = localStorage.getItem("authToken");
    return axios.get(`${import.meta.env.VITE_USER_API_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [profileRes, eventPostsRes, followersRes, followingRes] =
          await Promise.all([
            fetchData("/user/dashboard"),
            fetchData("/user/event/posts"), // Changed endpoint to fetch event posts
            fetchData("/followers"),
            fetchData("/following"),
          ]);

        setState((prev) => ({
          ...prev,
          firstName: profileRes.data.user.FirstName,
          lastName: profileRes.data.user.LastName,
          eventPosts: eventPostsRes.data, // Changed to eventPosts
          connectionsList: followersRes.data.followers || [],
          followingList: followingRes.data.following || [],
          connectionStats: {
            connections: followersRes.data.followers?.length || 0,
            following: followingRes.data.following?.length || 0,
          },
          loading: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: "Failed to load data",
          loading: false,
        }));
      }
    };

    loadAllData();
  }, []);

  const handleUserAction = async (actionType, userId) => {
    try {
      const token = localStorage.getItem("authToken");
      const endpoint =
        actionType === "unfollow" ? "/unfollow" : "/remove-follower";

      await axios.post(
        `${import.meta.env.VITE_USER_API_URL}${endpoint}`,
        { [actionType === "unfollow" ? "followingId" : "followerId"]: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setState((prev) => ({
        ...prev,
        [actionType === "unfollow" ? "followingList" : "connectionsList"]: prev[
          actionType === "unfollow" ? "followingList" : "connectionsList"
        ].filter((u) => u._id !== userId),
        connectionStats: {
          ...prev.connectionStats,
          [actionType === "unfollow" ? "following" : "connections"]:
            prev.connectionStats[
              actionType === "unfollow" ? "following" : "connections"
            ] - 1,
        },
      }));
    } catch (err) {
      console.error(`Failed to ${actionType}:`, err);
    }
  };

  const UserPopup = ({ type, show, onClose, users, onAction }) =>
    show && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              {type === "connections" ? (
                <UserCheck size={20} className="text-teal-500 mr-2" />
              ) : (
                <UserPlus size={20} className="text-teal-500 mr-2" />
              )}
              {type === "connections" ? "My Connections" : "Following"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-4 overflow-y-auto max-h-[calc(80vh-4rem)]">
            {users.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                {type === "connections"
                  ? "No connections yet."
                  : "Not following anyone yet."}
              </p>
            ) : (
              users.map((user) => (
                <div key={user._id} className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 text-white flex items-center justify-center text-base font-semibold mr-3 overflow-hidden">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="Profile"
                        className="w-10 h-10 object-cover rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <>
                        {user.FirstName?.[0]}
                        {user.LastName?.[0]}
                      </>
                    )}
                  </div>
                  <span className="text-gray-800 font-medium">
                    {user.FirstName} {user.LastName}
                  </span>
                  <button
                    onClick={() => onAction(user._id)}
                    className="ml-auto px-3 py-1 text-red-600 text-xs font-medium border border-red-200 rounded-md hover:bg-red-50"
                  >
                    {type === "connections" ? "Remove" : "Unfollow"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );

  const {
    eventPosts,
    loading,
    error,
    firstName,
    lastName,
    connectionStats,
    connectionsList,
    followingList,
    showConnectionsPopup,
    showFollowingPopup,
  } = state;
  const initials = `${firstName?.[0] || ""}${
    lastName?.[0] || ""
  }`.toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="w-80 flex-shrink-0">
            <ProfileSidebar
              {...{ initials, firstName, lastName, connectionStats }}
              setShowConnectionsPopup={(show) =>
                setState((prev) => ({ ...prev, showConnectionsPopup: show }))
              }
              setShowFollowingPopup={(show) =>
                setState((prev) => ({ ...prev, showFollowingPopup: show }))
              }
              navigate={navigate}
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Events</h1>
            {loading ? (
              <div className="text-center py-4">Loading events...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-4">{error}</div>
            ) : eventPosts.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow">
                <div className="text-gray-500">No events yet</div>
              </div>
            ) : (
              <div className="space-y-4">
                {eventPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <UserPopup
        type="connections"
        show={showConnectionsPopup}
        onClose={() =>
          setState((prev) => ({ ...prev, showConnectionsPopup: false }))
        }
        users={connectionsList}
        onAction={(id) => handleUserAction("remove", id)}
      />

      <UserPopup
        type="following"
        show={showFollowingPopup}
        onClose={() =>
          setState((prev) => ({ ...prev, showFollowingPopup: false }))
        }
        users={followingList}
        onAction={(id) => handleUserAction("unfollow", id)}
      />
    </div>
  );
}

export default getEvents;
