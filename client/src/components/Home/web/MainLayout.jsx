import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import PostModal from "./PostModal";
import AdminAnnouncements from "./AdminAnnouncements";
import {
  IndianRupee,
  Users,
  Bookmark,
  Calendar,
  MailPlus,
  Plus,
  Briefcase,
  ChevronRight,
  Heart,
  MessageCircle,
  Save,
  Image,
} from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";

function MainLayout({ jobs, loading }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPostModal, setShowPostModal] = useState(false);
  const [postType, setPostType] = useState("regular"); // "regular", "event", "job", "media"
  const socket = io(import.meta.env.VITE_SERVER_ROUTE);
  const [adminJobs, setAdminJobs] = useState([]);
  const [adminEvents, setAdminEvents] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  // New: posts state and loading/error for posts
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState("");

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_USER_API_URL}/all-users`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setSuggestedUsers(res.data.users);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };

    fetchSuggestedUsers();
  }, []);

  // follow request
  const handleFollow = async (targetUserId) => {
    try {
      const token = localStorage.getItem("authToken");
      console.log("Token:", token);
      console.log("Sending follow request to:", targetUserId);

      const response = await axios.post(
        `${import.meta.env.VITE_USER_API_URL}/follow-request`,
        { targetUserId }, // ensure this is an object with a key called targetUserId
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Follow request sent:", response.data);
      if (response.data.status === 1) {
        setSentRequests((prev) => [...prev, targetUserId]);
      }
    } catch (error) {
      console.error("Failed to send connection request", error);
    }
  };

  // show the profile details of the user logged in
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

        const { FirstName, LastName } = response.data.user;
        setFirstName(FirstName);
        setLastName(LastName);
      } catch (err) {
        console.error("Failed to fetch profile info:", err);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    // Fetch all posts to show in feed
    const fetchPosts = async () => {
      setPostsLoading(true);
      setPostsError("");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_USER_API_URL}/view/others`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setPosts(response.data);
      } catch (err) {
        setPostsError("Failed to load posts.");
        console.error(err);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // fetch admin job as user
  useEffect(() => {
    const fetchAdminJob = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_USER_API_URL}/jobs`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setAdminJobs(response.data.jobs);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAdminJob();
  }, []);

  // fetch admin events as user
  useEffect(() => {
    const fetchAdminEvents = async () => {
      try {
        const response = await axios(
          `${import.meta.env.VITE_USER_API_URL}/admin-events`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setAdminEvents(response.data.events);
      } catch (error) {
        console.error("Failed to fetch admin events", error);
      }
    };
    fetchAdminEvents();
  }, []);

  // ✅ WebSocket listener for new posts
useEffect(() => {
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("newPost", (post) => {
    console.log("Received newPost:", post);
    setPosts((prevPosts) => {
      // Check if the post already exists in the feed
      const exists = prevPosts.some((p) => p._id === post._id);
      if (exists) {
        return prevPosts; // If it exists, do not add it again
      }
      return [post, ...prevPosts]; // Add new post to the top of the feed
    });
  });

  // Clean up
  return () => {
    socket.off("newPost");
  };
}, []);

  // Helper to add newly created post to feed immediately
  const handlePostCreate = async (newPost) => {
    setPosts((prevPosts) => {
      // Check if the post already exists in the feed
      const exists = prevPosts.some((p) => p._id === newPost._id);
      if (exists) {
        return prevPosts; // If it exists, do not add it again
      }
      return [newPost, ...prevPosts]; // Add new post to the top of the feed
    });
  };

  const openPostModal = (type = "regular") => {
    setPostType(type);
    setShowPostModal(true);
  };

  const initials = `${firstName?.[0] ?? ""}${
    lastName?.[0] ?? ""
  }`.toUpperCase();

  return (
    <>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row py-6 gap-6">
            {/* Left Sidebar */}
            <div className="w-full lg:w-1/4 space-y-5">
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
                    {firstName || ""} {lastName || ""}
                  </h2>
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
                    >
                      My Posted Events
                    </a>
                    <a
                      href="#"
                      className="block text-sm text-teal-600 hover:underline py-1"
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
                    >
                      My Job Posts
                    </a>
                    <a
                      href="#"
                      className="block text-sm text-teal-600 hover:underline py-1"
                    >
                      Available Opportunities
                    </a>
                  </div>
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

            {/* Main Feed */}
            <div className="w-full lg:w-2/4 space-y-5">
              {/* Admin Announcements */}
              <AdminAnnouncements />

              {/* Create Post Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 text-white flex items-center justify-center text-base font-semibold flex-shrink-0 shadow-md">
                    {initials}
                  </div>
                  <button
                    onClick={() => openPostModal("regular")}
                    className="w-full text-left bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full px-4 py-2.5 border border-gray-200 hover:shadow-inner transition-all duration-300"
                  >
                    What's on your mind, {firstName}?
                  </button>
                </div>

                <div className="flex mt-4 pt-3 border-t border-gray-100 text-sm">
                  <button
                    onClick={() => openPostModal("event")}
                    className="flex items-center justify-center w-1/4 py-1.5 text-gray-700 hover:bg-teal-50 rounded transition-colors duration-300"
                  >
                    <Calendar size={18} className="text-teal-500 mr-2" />
                    Event
                  </button>
                  <button
                    onClick={() => openPostModal("job")}
                    className="flex items-center justify-center w-1/4 py-1.5 text-gray-700 hover:bg-teal-50 rounded transition-colors duration-300"
                  >
                    <Briefcase size={18} className="text-teal-500 mr-2" />
                    Job
                  </button>
                  <button
                    onClick={() => openPostModal("media")}
                    className="flex items-center justify-center w-1/4 py-1.5 text-gray-700 hover:bg-teal-50 rounded transition-colors duration-300"
                  >
                    <Image size={18} className="text-teal-500 mr-2" />
                    Media
                  </button>
                  <button
                    onClick={() => openPostModal("donation")}
                    className="flex items-center justify-center w-1/4 py-1.5 text-gray-700 hover:bg-teal-50 rounded transition-colors duration-300"
                  >
                    <IndianRupee size={18} className="text-teal-500 mr-2" />
                    Donate
                  </button>
                </div>
              </div>
              {adminEvents.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Admin Events
                  </h2>
                  {adminEvents.map((event) => (
                    <div
                      key={event._id}
                      className="bg-white rounded-xl shadow border border-gray-100 p-4"
                    >
                      <h3 className="text-lg font-bold text-teal-700">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {event.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Event Date:{" "}
                        {new Date(event.eventDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Posts Feed */}
              <div className="space-y-5">
                {postsLoading ? (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center hover:shadow-xl transition-shadow duration-300">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                    </div>
                    <p className="text-gray-500 mt-4">Loading posts...</p>
                  </div>
                ) : postsError ? (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-shadow duration-300">
                    <p className="text-red-500 font-medium">{postsError}</p>
                    <button className="mt-3 text-teal-600 text-sm hover:underline">
                      Try again
                    </button>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center hover:shadow-xl transition-shadow duration-300">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center shadow-inner">
                        <MailPlus size={24} className="text-teal-500" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      No posts yet
                    </h3>
                    <p className="text-gray-500 mt-2">
                      Be the first to share something with your alumni network!
                    </p>
                    <button
                      onClick={() => openPostModal("regular")}
                      className="mt-4 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 text-white py-2 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                    >
                      Create Post
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {posts.map((post) => (
                      <div
                        key={post._id}
                        className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-shadow duration-300"
                      >
                        <PostCard post={post} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Admin Jobs */}
              {!loading && adminJobs?.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <Briefcase size={20} className="text-teal-500 mr-2" />
                    <h2 className="text-lg font-bold text-gray-800">
                      Job Opportunities
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {adminJobs.map((job) => (
                      <div
                        key={job._id}
                        className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                      >
                        <PostCard job={job} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-1/4 space-y-5">
              {/* People You May Know */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-emerald-50">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center">
                    <Users size={18} className="text-teal-500 mr-2" />
                    People You May Know
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {suggestedUsers.slice(0, 5).map((user) => {
                    const isRequested = sentRequests.includes(user._id);

                    return (
                      <div
                        key={user._id}
                        className="flex items-center p-4 hover:bg-gray-50 transition-colors duration-300"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 mr-3 flex-shrink-0 flex items-center justify-center text-white font-medium shadow-md">
                          {user.FirstName[0]}
                          {user.LastName[0]}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-800">
                            {user.FirstName} {user.LastName}
                          </h3>
                        </div>

                        {isRequested ? (
                          <button
                            disabled
                            className="ml-auto px-3 py-1 text-gray-500 text-sm font-medium border border-gray-200 rounded-md bg-gray-100 cursor-not-allowed"
                          >
                            Requested
                          </button>
                        ) : (
                          <button
                            onClick={() => handleFollow(user._id)}
                            className="ml-auto px-3 py-1 text-teal-600 text-sm font-medium border border-teal-200 rounded-md hover:bg-teal-50 transition-colors duration-300"
                          >
                            Connect
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="p-4 bg-gradient-to-r from-teal-50 to-emerald-50 text-center">
                  <a
                    href="#"
                    className="text-teal-600 text-sm font-medium hover:underline"
                  >
                    View All Suggestions
                  </a>
                </div>
              </div>
              {/* Support & Donation */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden p-5 hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                  <MailPlus size={18} className="text-teal-500 mr-2" />
                  Support
                </h2>
                <p className="text-gray-600 text-sm">
                  Need help? Reach out to our support team at any time.
                </p>
                <div className="mt-3 p-3 bg-teal-50 rounded-lg border border-teal-100">
                  <p className="text-teal-800 text-sm font-medium">
                    support@alumniconnect.com
                  </p>
                </div>
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <IndianRupee size={18} className="text-teal-500 mr-2" />
                    Make a Donation
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    Support your alma mater by contributing to scholarships and
                    campus development.
                  </p>
                  <button
                    onClick={() => openPostModal("donation")}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 text-white py-2.5 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                  >
                    <Plus size={18} className="mr-2" /> Start a Donation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Modal */}
      <PostModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        initials={initials}
        firstName={firstName}
        lastName={lastName}
        onPostCreate={handlePostCreate}
        postType={postType}
      />
    </>
  );
}

export default MainLayout;
