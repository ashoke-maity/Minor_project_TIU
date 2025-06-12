import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, ChevronLeft, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function UserSettings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_USER_API_URL}/user/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const { FirstName, LastName, Email, profileImage } = response.data.user;
      setFirstName(FirstName || "");
      setLastName(LastName || "");
      setEmail(Email || "");

      if (profileImage) {
        setImagePreview(profileImage);
      }
    } catch (err) {
      setError("Failed to fetch user data");
      toast.error("Failed to fetch user data");
      console.error(err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      await axios.put(
        `${import.meta.env.VITE_USER_API_URL}/user/dashboard`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("Profile updated successfully");
      toast.success("Profile updated successfully");
    } catch (err) {
      setError("Failed to update profile");
      toast.error("Failed to update profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDelete = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (deleteConfirm !== email) {
      setError("Email confirmation does not match");
      toast.error("Email confirmation does not match");
      setLoading(false);
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_USER_API_URL}/user/delete`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      localStorage.clear();
      toast.success("Account deleted successfully");
      window.location.href = "/";
    } catch (err) {
      setError("Failed to delete account");
      toast.error("Failed to delete account");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-500 to-green-500">
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-teal-500 to-green-500 backdrop-blur-sm shadow-dmd">
        <div className="px-4 py-4 flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center bg-white/20 text-white px-3 py-2 rounded-lg shadow-md mr-3 hover:bg-white/30 transition-all duration-300"
          >
            <ChevronLeft size={20} />
            <span className="ml-1 font-medium">Back</span>
            <span className="ml-1 font-medium">Back</span>
          </button>
          <h1 className="text-lg font-bold text-white">Settings</h1>
        </div>

        {/* Mobile Tabs */}
        <div className="flex overflow-x-auto scrollbar-hide bg-white shadow-md">
          <button
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "profile" 
                ? "text-green-600 bg-green-50 shadow-sm rounded-t-lg" 
                : "text-gray-600 hover:text-green-600 hover:bg-gray-50 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <User size={16} className="inline-block mr-1" />
            Profile
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "notifications" 
                ? "text-green-600 bg-green-50 shadow-sm rounded-t-lg" 
                : "text-gray-600 hover:text-green-600 hover:bg-gray-50 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell size={16} className="inline-block mr-1" />
            Notifications
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {error && (
          <div className="mb-4 p-4 bg-red-50/90 text-red-600 text-sm rounded-lg shadow-md bashadow-md backdrop-blur-sm flex items-start flex items-start">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50/90 text-green-600 text-sm rounded-lg shadow-md shadow-md backdrop-blur-sm flex items-start flex items-start">
            {success}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div>
            <form onSubmit={handleProfileUpdate}>
              <div className="mb-6 flex flex-col items-center">
                <div className="relative">
                  <div
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 mb-3 relative overflow-hidden ring-4 ring-white shadow-lg"
                    style={{
                      backgroundImage: imagePreview ? `url(${imagePreview})` : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {!imagePreview && (
                      <div className="w-full h-full flex items-center justify-center text-green-400">
                        <User size={32} />
                      </div>
                    )}
                    <input
                      type="file"
                      id="profile-image"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <label
                      htmlFor="profile-image"
                      className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      Change
                    </label>
                  </div>
                </div>
                <label
                  htmlFor="profile-image"
                  className="text-sm text-green-600 cursor-pointer"
                >
                  Upload Photo
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/80 shadow-md hover:shadow-lg transition-all duration-300 shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/80 shadow-md hover:shadow-lg transition-all duration-300 shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="mt-4 mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full rounded-lg p-3 text-sm bg-white/80 shadow-md backdrop-blur-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You cannot change your email address
                </p>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>

            <div className="border-t border-green-100/50 pt-6 mt-6">
              <h3 className="text-lg font-medium text-red-600 mb-4">Delete Account</h3>
              <p className="text-sm text-gray-600 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>

              <form onSubmit={handleAccountDelete} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm by typing your email
                  </label>
                  <input
                    type="text"
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    className="w-full border border-green-100 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                    placeholder={email}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete Account"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-sm border border-green-100/50 p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
            <p className="text-sm text-gray-600">
              Notification settings are coming soon. Stay tuned for updates!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserSettings;