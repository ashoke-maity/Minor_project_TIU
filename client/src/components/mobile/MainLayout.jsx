import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  Settings
} from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";

function MobileMainLayout({ jobs, loading }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [PassoutYear, setPassoutYear] = useState("");
  const [showPostModal, setShowPostModal] = useState(false);
  const [postType, setPostType] = useState("regular");
  const socket = io(import.meta.env.VITE_SERVER_ROUTE);
  const [activeTab, setActiveTab] = useState("feed");

  // New: posts state and loading/error for posts
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState("");

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

  useEffect(() => {
    // Fetch all posts to show in feed
    const fetchPosts = async () => {
      setPostsLoading(true);
      setPostsError("");
      try {
        const response = await axios.get(`${import.meta.env.VITE_USER_API_URL}/view/others`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
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
const handlePostCreate = async (newPost) => {
  setPosts((prevPosts) => [newPost, ...prevPosts]);
};

  const openPostModal = (type = "regular") => {
    setPostType(type);
    setShowPostModal(true);
  };

  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

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
          </div>
        </div>

        {/* Create Post Button - Fixed */}
        <div className="fixed bottom-20 right-4 z-10">
          <button 
            onClick={() => openPostModal('regular')}
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
              
              {/* Post Types Grid */}
              <div className="grid grid-cols-4 gap-2 bg-white p-3 rounded-xl shadow-sm">
                <button 
                  onClick={() => openPostModal('regular')}
                  className="flex flex-col items-center py-2 px-1 text-gray-700 hover:bg-teal-50 rounded transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mb-1">
                    <Plus size={20} className="text-teal-600" />
                  </div>
                  <span className="text-xs">Post</span>
                </button>
                
                <button 
                  onClick={() => openPostModal('event')}
                  className="flex flex-col items-center py-2 px-1 text-gray-700 hover:bg-amber-50 rounded transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-1">
                    <Calendar size={20} className="text-amber-600" />
                  </div>
                  <span className="text-xs">Event</span>
                </button>
                
                <button 
                  onClick={() => openPostModal('job')}
                  className="flex flex-col items-center py-2 px-1 text-gray-700 hover:bg-blue-50 rounded transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                    <Briefcase size={20} className="text-blue-600" />
                  </div>
                  <span className="text-xs">Job</span>
                </button>
                
                <button 
                  onClick={() => openPostModal('donation')}
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
                    <h3 className="text-lg font-semibold text-gray-800">No posts yet</h3>
                    <p className="text-gray-500 mt-2">
                      Be the first to share something with your alumni network!
                    </p>
                    <button 
                      onClick={() => openPostModal('regular')}
                      className="mt-4 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 text-white py-2 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                    >
                      Create Post
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div key={post._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
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
                {[1, 2, 3, 4, 5].map((_, idx) => (
                  <div key={idx} className="flex items-center py-3">
                    <div>
                      <h3 className="text-base font-semibold text-gray-800">
                        {['John Doe', 'Alice Kim', 'Sam Reed', 'Mark Peters', 'Ben Katz'][idx]}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Class of {['2018', '2020', '2019', '2015', '2022'][idx]}
                      </p>
                    </div>
                    <button className="ml-auto px-3 py-1 text-teal-600 text-sm font-medium border border-teal-200 rounded-md hover:bg-teal-50 transition-colors duration-300">
                      Connect
                    </button>
                  </div>
                ))}
                <div className="pt-4 text-center">
                  <Link to="/network" className="text-teal-600 text-sm font-medium hover:underline">
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
              {/* Sample Empty State */}
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                  <Bookmark size={24} className="text-gray-400" />
                </div>
                <h3 className="text-gray-600 font-medium mb-1">No saved items yet</h3>
                <p className="text-gray-500 text-sm">
                  Items you save will appear here
                </p>
              </div>
            </div>
          )}

          {activeTab === "jobs" && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Briefcase size={18} className="text-teal-500 mr-2" /> 
                Job Opportunities
              </h3>
              
              {!loading && jobs?.length > 0 ? (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                      <PostCard job={job} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-4 text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                    <Briefcase size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-gray-600 font-medium mb-1">No job opportunities yet</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Check back later for new openings
                  </p>
                  <button 
                    onClick={() => openPostModal('job')}
                    className="bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 text-white py-2 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                  >
                    Post a Job
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex justify-around items-center z-20">
          <button 
            onClick={() => setActiveTab('feed')}
            className={`flex flex-col items-center justify-center w-1/4 h-full ${activeTab === 'feed' ? 'text-teal-500' : 'text-gray-500'}`}
          >
            <HomeIcon size={20} />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button 
            onClick={() => setActiveTab('network')}
            className={`flex flex-col items-center justify-center w-1/4 h-full ${activeTab === 'network' ? 'text-teal-500' : 'text-gray-500'}`}
          >
            <Users size={20} />
            <span className="text-xs mt-1">Network</span>
          </button>
          <button 
            onClick={() => setActiveTab('bookmarks')}
            className={`flex flex-col items-center justify-center w-1/4 h-full ${activeTab === 'bookmarks' ? 'text-teal-500' : 'text-gray-500'}`}
          >
            <Bookmark size={20} />
            <span className="text-xs mt-1">Saved</span>
          </button>
          <button 
            onClick={() => setActiveTab('jobs')}
            className={`flex flex-col items-center justify-center w-1/4 h-full ${activeTab === 'jobs' ? 'text-teal-500' : 'text-gray-500'}`}
          >
            <Briefcase size={20} />
            <span className="text-xs mt-1">Jobs</span>
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