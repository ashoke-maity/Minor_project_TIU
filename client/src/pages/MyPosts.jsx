import { React, useState, useEffect } from "react";
import axios from "axios";
import {
  ChevronLeft,
  Image,
  Bookmark,
  Calendar,
  Briefcase,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/Home/web/PostCard";
import ProfileSidebar from "../components/layout/ProfileSidebar";
import Header from "../components/layout/Header";

function MyPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [events, setEvents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [connectionStats, setConnectionStats] = useState({
    connections: 0,
    following: 0,
  });
  const [connectionsList, setConnectionsList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [showConnectionsPopup, setShowConnectionsPopup] = useState(false);
  const [showFollowingPopup, setShowFollowingPopup] = useState(false);
  const [activeView, setActiveView] = useState("posts"); // "posts", "bookmarks", "events", or "jobs"

  useEffect(() => {
    fetchUserProfile();
    switch (activeView) {
      case "posts":
        fetchMyPosts();
        break;
      case "bookmarks":
        fetchBookmarks();
        break;
      case "events":
        fetchEvents();
        break;
      case "jobs":
        fetchJobs();
        break;
    }
    // eslint-disable-next-line
  }, [activeView]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_USER_API_URL}/admin-events`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setEvents(response.data.events);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events");
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_USER_API_URL}/jobs`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setJobs(response.data.jobs);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load jobs");
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_USER_API_URL}/bookmarks`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setBookmarks(response.data.bookmarks);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
      setError("Failed to load bookmarks");
      setLoading(false);
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

  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_USER_API_URL}/posts/my-posts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setPosts(response.data.posts);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts");
      setLoading(false);
    }
  };

  useEffect(() => {
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

    fetchConnectionStats();
  }, []);

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

  const initials = userProfile
    ? `${userProfile.FirstName?.[0] ?? ""}${
        userProfile.LastName?.[0] ?? ""
      }`.toUpperCase()
    : "";

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={() => {
              switch (activeView) {
                case "posts":
                  fetchMyPosts();
                  break;
                case "bookmarks":
                  fetchBookmarks();
                  break;
                case "events":
                  fetchEvents();
                  break;
                case "jobs":
                  fetchJobs();
                  break;
              }
            }}
            className="mt-3 text-teal-600 text-sm hover:underline"
          >
            Try again
          </button>
        </div>
      );
    }

    switch (activeView) {
      case "posts":
        if (posts.length === 0) {
          return (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center">
                  <Image size={24} className="text-teal-500" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                No posts yet
              </h3>
              <p className="text-gray-500 mt-2">
                Start sharing your thoughts with your alumni network!
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 text-white py-2 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Create Post
              </button>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-shadow duration-300"
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>
        );

      case "bookmarks":
        if (bookmarks.length === 0) {
          return (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center">
                  <Bookmark size={24} className="text-teal-500" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                No bookmarks yet
              </h3>
              <p className="text-gray-500 mt-2">
                Save posts you want to revisit later!
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 text-white py-2 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Browse Posts
              </button>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark._id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-shadow duration-300"
              >
                <PostCard post={bookmark.post} />
              </div>
            ))}
          </div>
        );

      case "events":
        if (events.length === 0) {
          return (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center">
                  <Calendar size={24} className="text-teal-500" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                No upcoming events
              </h3>
              <p className="text-gray-500 mt-2">
                Check back later for new events!
              </p>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mt-2">{event.description}</p>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <Calendar size={16} className="mr-2" />
                      <span>
                        {new Date(event.eventDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "jobs":
        if (jobs.length === 0) {
          return (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center">
                  <Briefcase size={24} className="text-teal-500" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                No job opportunities
              </h3>
              <p className="text-gray-500 mt-2">
                Check back later for new job postings!
              </p>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 mt-2">{job.description}</p>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <Briefcase size={16} className="mr-2" />
                      <span>{job.company}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileSidebar
              initials={initials}
              firstName={userProfile?.FirstName}
              lastName={userProfile?.LastName}
              connectionStats={connectionStats}
              setShowConnectionsPopup={setShowConnectionsPopup}
              setShowFollowingPopup={setShowFollowingPopup}
              navigate={(path) => {
                if (path === "/my-posts?view=bookmarks")
                  setActiveView("bookmarks");
                else if (path === "/my-posts?view=events")
                  setActiveView("events");
                else if (path === "/my-posts?view=jobs") setActiveView("jobs");
                else if (path === "/my-posts?view=posts")
                  setActiveView("posts");
                else navigate(path);
              }}
            />
          </div>
          {/* Main Content */}
          <div className="lg:col-span-3">{renderContent()}</div>
        </div>
      </div>

      {/* Connections Popup */}
      {/* Connections Popup */}
      {showConnectionsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                Connections
              </h3>
              <button
                onClick={() => setShowConnectionsPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-4rem)]">
              {connectionsList && connectionsList.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No connections yet.
                </p>
              ) : (
                connectionsList.map((user) => (
                  <div key={user._id} className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 text-white flex items-center justify-center text-base font-semibold mr-3">
                      {user.FirstName?.[0]}
                      {user.LastName?.[0]}
                    </div>
                    <span className="text-gray-800 font-medium">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
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
              {followingList && followingList.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Not following anyone yet.
                </p>
              ) : (
                followingList.map((user) => (
                  <div key={user._id} className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center text-base font-semibold mr-3">
                      {user.FirstName?.[0]}
                      {user.LastName?.[0]}
                    </div>
                    <span className="text-gray-800 font-medium">
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
  );
}

export default MyPosts;
