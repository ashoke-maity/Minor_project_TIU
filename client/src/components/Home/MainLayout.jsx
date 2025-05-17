import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import PostModal from "./PostModal"; 
import { IndianRupee } from "lucide-react";
import axios from "axios";

function MainLayout({ jobs, loading }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [PassoutYear, setPassoutYear] = useState("");
  const [showPostModal, setShowPostModal] = useState(false);

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

  // Helper to add newly created post to feed immediately
  const handlePostCreate = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <>
      <div className="flex p-4 bg-gray-100 min-h-screen font-sans">
        {/* Left Sidebar */}
        <div className="w-[25rem] pr-4 space-y-3">
          {/* Profile Card */}
          <div className="bg-white rounded-md border border-gray-200 p-5 shadow-sm flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-teal-500 text-white mb-3 flex items-center justify-center text-3xl font-bold">
              {initials || "JD"}
            </div>
            <div className="text-gray-800 font-semibold text-sm">
              {firstName || ""} {lastName || ""}
            </div>
            <div className="text-xs text-gray-500">
              Batch of {PassoutYear || ""}
            </div>
          </div>

          {/* Bookmarks Section */}
          <div className="bg-white rounded-md border border-gray-200 p-3 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">Bookmarks</h2>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="hover:text-teal-600 cursor-pointer">Saved Bookmarks</li>
              <li className="hover:text-teal-600 cursor-pointer">My posts</li>
            </ul>
          </div>

          {/* Events Section */}
          <div className="bg-white rounded-md border border-gray-200 p-3 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">Events</h2>
            <ul className="text-sm text-gray-600 space-y-1 mb-2">
              <li className="hover:text-teal-600 cursor-pointer">Saved Events</li>
              <li className="hover:text-teal-600 cursor-pointer">My Events</li>
            </ul>
            <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 rounded text-lg">
              + Add an Event
            </button>
          </div>
        </div>

        {/* Main Feed */}
        <div className="w-3/5 px-4">
          {/* Start Post Input */}
          <div className="bg-white border border-gray-200 rounded-md p-3 mb-5 w-145 shadow-sm hover:shadow-md flex justify-center items-center text-gray-700 font-medium">
            <div className="w-9 h-9 rounded-full bg-gray-300 flex-shrink-0 mr-3 flex items-center justify-center text-sm font-bold text-gray-700">
              {initials}
            </div>
            <input
              type="text"
              placeholder="Start a Post"
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
              onClick={() => setShowPostModal(true)}
            />
          </div>

          {/* User Posts Feed */}
          {postsLoading ? (
            <p className="text-gray-500">Loading posts...</p>
          ) : postsError ? (
            <p className="text-red-600">{postsError}</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-500">No posts found.</p>
          ) : (
            posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          )}

          {/* Admin Jobs */}
          <div className="flex flex-col gap-5 items-center mt-8">
            {loading ? (
              <p className="text-gray-500">Loading jobs...</p>
            ) : jobs?.length > 0 ? (
              jobs.map((job) => <PostCard key={job._id} job={job} />)
            ) : (
              <p className="text-gray-500">No jobs posted by admin yet.</p>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-[25rem] pl-4 space-y-3">
          {/* Support Section */}
          <div className="bg-white rounded-md border border-gray-200 p-3 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">Support</h2>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">Our Mail:</span>{" "}
              support@alumniconnect.com
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Feel free to contact us at any time if you face any issues. We’re here to help!
            </p>
          </div>

          {/* Donations Section */}
          <div className="bg-white rounded-md border border-gray-200 p-3 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-800">My Donations</h2>
              <IndianRupee size={20} className="text-teal-600" />
            </div>
            <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 rounded text-lg">
              + Create a Donation
            </button>
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
        onPostCreate={handlePostCreate} // pass the handler to update posts
      />
    </>
  );
}

export default MainLayout;