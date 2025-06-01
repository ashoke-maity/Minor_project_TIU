import { React,  useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PostCard from "./PostCard";
import PostModal from "../Home/web/PostModal";
import MobileHeader from "./Header";
import MobileAdminAnnouncements from "./AdminAnnouncements";

import {
  IndianRupee,
  Users,
  Bookmark,
  Calendar,
  Plus,
  Briefcase,
  ChevronRight,
  Home as HomeIcon,
  Settings,
  Image,
  X,
  UserCheck,
} from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";

function MobileMainLayout({ loading }) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [PassoutYear, setPassoutYear] = useState("");
  const [showPostModal, setShowPostModal] = useState(false);
  const [postType, setPostType] = useState("regular");
  const socket = io(import.meta.env.VITE_SERVER_ROUTE);
  const [activeTab, setActiveTab] = useState("feed");
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  // Following and Followers state
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [followingLoading, setFollowingLoading] = useState(true);
  const [followersLoading, setFollowersLoading] = useState(true);

  // Add connectionIds and followingIds Sets
  const connectionIds = new Set(followers.map((u) => u._id));
  const followingIds = new Set(following.map((u) => u._id));

  // Posts state and loading/error for posts
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState("");

  // User's posts state
  const [userPosts, setUserPosts] = useState([]);
  const [userPostsLoading, setUserPostsLoading] = useState(true);
  const [userPostsError, setUserPostsError] = useState("");

  // Saved items state
  const [savedItems, setSavedItems] = useState([]);
  const [savedItemsLoading, setSavedItemsLoading] = useState(true);
  const [savedItemsError, setSavedItemsError] = useState("");

  // New post editing state
  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState("");

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

        const { FirstName, LastName, PassoutYear } = response.data.user;
        setFirstName(FirstName);
        setLastName(LastName);
        setPassoutYear(PassoutYear);
      } catch (err) {
        console.error("Failed to fetch profile info:", err);
      }
    };

    fetchProfile();
  }, []);

  // Fetch following and followers
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        // Fetch following
        const followingResponse = await axios.get(
          `${import.meta.env.VITE_USER_API_URL}/following`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setFollowing(followingResponse.data.following);
        setFollowingLoading(false);

        // Fetch followers
        const followersResponse = await axios.get(
          `${import.meta.env.VITE_USER_API_URL}/followers`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setFollowers(followersResponse.data.followers);
        setFollowersLoading(false);
      } catch (err) {
        console.error("Failed to fetch connections:", err);
        setFollowingLoading(false);
        setFollowersLoading(false);
      }
    };

    fetchConnections();
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

  // Fetch user's posts
  useEffect(() => {
    const fetchUserPosts = async () => {
      setUserPostsLoading(true);
      setUserPostsError("");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_USER_API_URL}/view/my/posts`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setUserPosts(response.data);
      } catch (err) {
        setUserPostsError("Failed to load your posts.");
        console.error(err);
      } finally {
        setUserPostsLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  // Fetch saved items
  useEffect(() => {
    const fetchSavedItems = async () => {
      setSavedItemsLoading(true);
      setSavedItemsError("");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_USER_API_URL}/saved-items`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setSavedItems(response.data);
      } catch (err) {
        setSavedItemsError("Failed to load saved items.");
        console.error(err);
      } finally {
        setSavedItemsLoading(false);
      }
    };

    if (activeTab === "bookmarks") {
      fetchSavedItems();
    }
  }, [activeTab]);

  // ✅ WebSocket listener for new posts
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });
    socket.on("newPost", (post) => {
      console.log("Received newPost:", post);
      setPosts((prevPosts) => [post, ...prevPosts]); // Add new post at top
    });

    // Clean up
    return () => {
      socket.off("newPost");
    };
  }, []);

  // Helper to add newly created post to feed immediately
  const handlePostCreate = (newPost) => {
    // Only add to posts if it's not already in posts
    setPosts((prevPosts) => {
      if (prevPosts.some((post) => post._id === newPost._id)) return prevPosts;
      return [newPost, ...prevPosts];
    });
    // Only add to userPosts if it's not already in userPosts
    setUserPosts((prevUserPosts) => {
      if (prevUserPosts.some((post) => post._id === newPost._id))
        return prevUserPosts;
      return [newPost, ...prevUserPosts];
    });
  };

  const openPostModal = (type = "regular") => {
    setPostType(type);
    setShowPostModal(true);
  };

  const initials = `${firstName?.[0] ?? ""}${
    lastName?.[0] ?? ""
  }`.toUpperCase();

  useEffect(() => {
    if (activeTab === "network") {
      fetchSuggestedUsers();
    }
  }, [activeTab]);

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

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `${import.meta.env.VITE_USER_API_URL}/delete/post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      alert("Failed to delete post");
    }
  };

  // handle post edit functionality
  const handleEdit = async (postId) => {
    if (!window.confirm("Are you sure you want to edit this post?")) return;
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `${import.meta.env.VITE_USER_API_URL}/user/edit/post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        // Navigate to the edit page with the post data
        setEditingPostId(postd);
        setEditContent(post.content);
      } else {
        alert("Failed to fetch post for editing");
      }
    } catch (err) {
      console.error("Error navigating to edit post:", err);
      alert("Failed to navigate to edit post");
    }
  };

  // function to save the edit after editing
  const handleSaveEdit = async (postId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `${import.meta.env.VITE_USER_API_URL}/user/edit/post/${postId}`,
        { content: editContent }, // add other fields as needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === postId ? { ...p, content: editContent } : p
          )
        );
        setEditingPostId(null);
      } else {
        alert("Failed to update post");
      }
    } catch (err) {
      alert("Failed to update post");
    }
  };

  return (
    <>
      <MobileHeader />
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans pb-16 pt-0">
        {/* Mobile Profile Banner */}
        <div className="bg-white shadow-sm border-b">
          <div className="relative">
            <div className="bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-600 h-24"></div>
            <div className="absolute left-0 right-0 -bottom-12 flex justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-teal-500 to-emerald-400 text-white flex items-center justify-center text-2xl font-bold shadow-xl">
                {initials}
              </div>
            </div>
          </div>

          <div className="pt-12 pb-4 px-4 text-center">
            <h2 className="text-xl font-bold text-gray-800">
              {firstName || ""} {lastName || ""}
            </h2>
            <p className="text-gray-500 text-sm">
              Class of {PassoutYear || ""}
            </p>

            {/* Following and Followers Count */}
            <div className="flex justify-center space-x-8 mt-4">
              <button
                onClick={() => setShowFollowingModal(true)}
                className="flex flex-col items-center"
              >
                <span className="text-lg font-semibold text-gray-800">
                  {following.length}
                </span>
                <span className="text-sm text-gray-500">Following</span>
              </button>
              <button
                onClick={() => setShowFollowersModal(true)}
                className="flex flex-col items-center"
              >
                <span className="text-lg font-semibold text-gray-800">
                  {followers.length}
                </span>
                <span className="text-sm text-gray-500">Followers</span>
              </button>
            </div>
          </div>
        </div>

        {/* Following Modal */}
        {showFollowingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">Following</h3>
                <button
                  onClick={() => setShowFollowingModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(80vh-4rem)]">
                {followingLoading ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading...</p>
                  </div>
                ) : following.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    Not following anyone yet
                  </div>
                ) : (
                  <div className="divide-y">
                    {following.map((user) => (
                      <div key={user._id} className="p-4 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-semibold text-lg mr-3">
                          {user.FirstName[0]}
                          {user.LastName[0]}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {user.FirstName} {user.LastName}
                          </h4>
                          <p className="text-sm text-gray-500">{user.Email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Followers Modal */}
        {showFollowersModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">Followers</h3>
                <button
                  onClick={() => setShowFollowersModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(80vh-4rem)]">
                {followersLoading ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading...</p>
                  </div>
                ) : followers.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No followers yet
                  </div>
                ) : (
                  <div className="divide-y">
                    {followers.map((user) => (
                      <div key={user._id} className="p-4 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-semibold text-lg mr-3">
                          {user.FirstName[0]}
                          {user.LastName[0]}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {user.FirstName} {user.LastName}
                          </h4>
                          <p className="text-sm text-gray-500">{user.Email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Create Post Button - Fixed */}
        <div className="fixed bottom-20 right-4 z-10">
          <button
            onClick={() => openPostModal("regular")}
            className="bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-4 mt-2">
          {activeTab === "feed" && (
            <div className="space-y-4">
              {/* Admin Announcements */}
              <MobileAdminAnnouncements />

              {/* Quick Access Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate("/my-posts?view=jobs")}
                  className="bg-white rounded-xl shadow-sm p-4 flex items-center hover:bg-gray-50 transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Briefcase size={20} className="text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-gray-800">
                      Available Opportunities
                    </h3>
                    <p className="text-xs text-gray-500">View job openings</p>
                  </div>
                  <ChevronRight size={16} className="ml-auto text-gray-400" />
                </button>

                <button
                  onClick={() => navigate("/my-posts?view=events")}
                  className="bg-white rounded-xl shadow-sm p-4 flex items-center hover:bg-gray-50 transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                    <Calendar size={20} className="text-amber-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-gray-800">
                      Upcoming Events
                    </h3>
                    <p className="text-xs text-gray-500">View events</p>
                  </div>
                  <ChevronRight size={16} className="ml-auto text-gray-400" />
                </button>
              </div>

              {/* Post Types Grid */}
              <div className="grid grid-cols-4 gap-2 bg-white p-3 rounded-xl shadow-sm">
                <button
                  onClick={() => openPostModal("regular")}
                  className="flex flex-col items-center py-2 px-1 text-gray-700 hover:bg-teal-50 rounded transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mb-1">
                    <Plus size={20} className="text-teal-600" />
                  </div>
                  <span className="text-xs">Post</span>
                </button>

                <button
                  onClick={() => openPostModal("event")}
                  className="flex flex-col items-center py-2 px-1 text-gray-700 hover:bg-amber-50 rounded transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-1">
                    <Calendar size={20} className="text-amber-600" />
                  </div>
                  <span className="text-xs">Event</span>
                </button>

                <button
                  onClick={() => openPostModal("job")}
                  className="flex flex-col items-center py-2 px-1 text-gray-700 hover:bg-blue-50 rounded transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                    <Briefcase size={20} className="text-blue-600" />
                  </div>
                  <span className="text-xs">Job</span>
                </button>

                <button
                  onClick={() => openPostModal("donation")}
                  className="flex flex-col items-center py-2 px-1 text-gray-700 hover:bg-purple-50 rounded transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-1">
                    <IndianRupee size={20} className="text-purple-600" />
                  </div>
                  <span className="text-xs">Donate</span>
                </button>
              </div>

              {/* Posts Feed */}
              <div className="space-y-4">
                {postsLoading ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                    </div>
                    <p className="text-gray-500 mt-4">Loading posts...</p>
                  </div>
                ) : postsError ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                    <p className="text-red-500 font-medium">{postsError}</p>
                    <button className="mt-3 text-teal-600 text-sm hover:underline">
                      Try again
                    </button>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <div className="w-16 h-16 bg-teal-50 rounded-full mx-auto flex items-center justify-center mb-4">
                      <Plus size={24} className="text-teal-500" />
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
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div
                        key={post._id}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                      >
                        <PostCard post={post} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "network" && (
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Users size={18} className="text-teal-500 mr-2" />
                People You May Know
              </h3>
              <div className="divide-y divide-gray-100">
                {suggestedUsers.slice(0, 5).map((user) => {
                  const isRequested = sentRequests.includes(user._id);
                  const isConnected =
                    connectionIds.has(user._id) || followingIds.has(user._id);
                  const isInConnectionsList = followers.some(
                    (conn) => conn._id === user._id
                  );
                  const isInFollowingList = following.some(
                    (follow) => follow._id === user._id
                  );

                  return (
                    <div
                      key={user._id}
                      className={`flex items-center py-3 hover:bg-gray-50 transition-colors duration-300 ${
                        isConnected || isInConnectionsList || isInFollowingList
                          ? "bg-teal-50"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full ${
                          isConnected ||
                          isInConnectionsList ||
                          isInFollowingList
                            ? "bg-gradient-to-br from-teal-500 to-emerald-400"
                            : "bg-gradient-to-br from-teal-400 to-emerald-500"
                        } flex items-center justify-center text-white font-semibold text-lg mr-3`}
                      >
                        {user.FirstName[0]}
                        {user.LastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-800 truncate">
                          {user.FirstName} {user.LastName}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {user.Email}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        {isConnected ||
                        isInConnectionsList ||
                        isInFollowingList ? (
                          <button
                            disabled
                            className="px-3 py-1.5 text-sm font-medium text-teal-600 bg-teal-50 rounded-md cursor-not-allowed border border-teal-200"
                          >
                            <div className="flex items-center">
                              <UserCheck size={16} className="mr-1.5" />
                              Connected
                            </div>
                          </button>
                        ) : isRequested ? (
                          <button
                            disabled
                            className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-gray-100 rounded-md cursor-not-allowed"
                          >
                            Request Sent
                          </button>
                        ) : (
                          <button
                            onClick={() => handleFollow(user._id)}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-md transition-colors duration-300"
                          >
                            Connect
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div className="pt-4 text-center">
                  <Link
                    to="/network"
                    className="text-teal-600 text-sm font-medium hover:underline"
                  >
                    View All Suggestions
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === "bookmarks" && (
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Bookmark size={18} className="text-teal-500 mr-2" />
                Your Saved Items
              </h3>
              {savedItemsLoading ? (
                <div className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                  </div>
                  <p className="text-gray-500 mt-4">Loading saved items...</p>
                </div>
              ) : savedItemsError ? (
                <div className="text-center py-8">
                  <p className="text-red-500 font-medium">{savedItemsError}</p>
                  <button className="mt-3 text-teal-600 text-sm hover:underline">
                    Try again
                  </button>
                </div>
              ) : savedItems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                    <Bookmark size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-gray-600 font-medium mb-1">
                    No saved items yet
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Items you save will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                    >
                      <PostCard post={item} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "jobs" && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Image size={18} className="text-teal-500 mr-2" />
                My Posts
              </h3>

              {userPostsLoading ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                  </div>
                  <p className="text-gray-500 mt-4">Loading your posts...</p>
                </div>
              ) : userPostsError ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                  <p className="text-red-500 font-medium">{userPostsError}</p>
                  <button className="mt-3 text-teal-600 text-sm hover:underline">
                    Try again
                  </button>
                </div>
              ) : userPosts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-4 text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                    <Image size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-gray-600 font-medium mb-1">
                    No posts yet
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Share your thoughts with your alumni network
                  </p>
                  <button
                    onClick={() => openPostModal("regular")}
                    className="bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 text-white py-2 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                  >
                    Create Post
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userPosts.map((post) => (
                    <div
                      key={post._id}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                      {editingPostId === post._id ? (
                        <div className="p-4">
                          <textarea
                            className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={3}
                          />
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => handleSaveEdit(post._id)}
                              className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors duration-200 flex items-center justify-center"
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={() => setEditingPostId(null)}
                              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <PostCard post={post} hideInteractions={editingPostId === post._id} />
                          <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
                            <button
                              onClick={() => {
                                setEditingPostId(post._id);
                                setEditContent(post.content);
                              }}
                              className="flex-1 px-4 py-2 text-teal-600 border border-teal-200 rounded-lg hover:bg-teal-50 text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                            >
                              Edit Post
                            </button>
                            <button
                              onClick={() => handleDelete(post._id)}
                              className="flex-1 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                            >
                              Delete Post
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex justify-around items-center z-20">
          <button
            onClick={() => setActiveTab("feed")}
            className={`flex flex-col items-center justify-center w-1/4 h-full ${
              activeTab === "feed" ? "text-teal-500" : "text-gray-500"
            }`}
          >
            <HomeIcon size={20} />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button
            onClick={() => setActiveTab("network")}
            className={`flex flex-col items-center justify-center w-1/4 h-full ${
              activeTab === "network" ? "text-teal-500" : "text-gray-500"
            }`}
          >
            <Users size={20} />
            <span className="text-xs mt-1">Network</span>
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`flex flex-col items-center justify-center w-1/4 h-full ${
              activeTab === "bookmarks" ? "text-teal-500" : "text-gray-500"
            }`}
          >
            <Bookmark size={20} />
            <span className="text-xs mt-1">Saved</span>
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex flex-col items-center justify-center w-1/4 h-full ${
              activeTab === "jobs" ? "text-teal-500" : "text-gray-500"
            }`}
          >
            <Image size={20} />
            <span className="text-xs mt-1">My Posts</span>
          </button>
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

export default MobileMainLayout;
