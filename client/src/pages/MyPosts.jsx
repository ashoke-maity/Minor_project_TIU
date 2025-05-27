import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, Image, Bookmark, Calendar, Briefcase, IndianRupee, ChevronRight, UserPlus, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/Home/web/PostCard";

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
    following: 0
  });
  const [activeView, setActiveView] = useState("posts"); // "posts", "bookmarks", "events", or "jobs"

  useEffect(() => {
    fetchUserProfile();
    fetchConnectionStats();
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

  const initials = userProfile ? `${userProfile.FirstName?.[0] ?? ""}${userProfile.LastName?.[0] ?? ""}`.toUpperCase() : "";

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
              <h3 className="text-lg font-semibold text-gray-800">No posts yet</h3>
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
              <h3 className="text-lg font-semibold text-gray-800">No bookmarks yet</h3>
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
              <h3 className="text-lg font-semibold text-gray-800">No upcoming events</h3>
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
                    <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
                    <p className="text-gray-600 mt-2">{event.description}</p>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <Calendar size={16} className="mr-2" />
                      <span>{new Date(event.eventDate).toLocaleDateString()}</span>
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
              <h3 className="text-lg font-semibold text-gray-800">No job opportunities</h3>
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
                    <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
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
              <h1 className="text-xl font-semibold text-gray-800">
                {activeView === "posts" && "My Posts"}
                {activeView === "bookmarks" && "Saved Bookmarks"}
                {activeView === "events" && "Upcoming Events"}
                {activeView === "jobs" && "Available Opportunities"}
              </h1>
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
              <div className="px-6 pb-6 pt-0 -mt-14 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-teal-500 to-emerald-400 text-white flex items-center justify-center text-2xl font-bold shadow-xl">
                  {initials}
                </div>
                <h2 className="text-xl font-bold text-gray-800 mt-4">
                  {userProfile?.FirstName || ""} {userProfile?.LastName || ""}
                </h2>
                
                {/* Connection Stats */}
                <div className="grid grid-cols-2 gap-6 mt-4 w-full">
                  <div className="text-center cursor-pointer hover:bg-teal-50 p-2 rounded-lg transition-colors duration-300">
                    <div className="flex items-center justify-center space-x-2 text-teal-600 mb-1">
                      <UserCheck size={18} />
                      <span className="text-lg font-semibold">{connectionStats.connections}</span>
                    </div>
                    <p className="text-sm text-gray-600">Connections</p>
                  </div>
                  <div className="text-center cursor-pointer hover:bg-teal-50 p-2 rounded-lg transition-colors duration-300">
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
                      setActiveView("bookmarks");
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
                      setActiveView("events");
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
                      setActiveView("jobs");
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
                    setActiveView("posts");
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
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPosts; 