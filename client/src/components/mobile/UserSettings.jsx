import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      const { FirstName, LastName, Email } = response.data.user;
      setFirstName(FirstName || "");
      setLastName(LastName || "");
      setEmail(Email || "");
    } catch (err) {
      setError("Failed to fetch user data");
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
      await axios.put(
        `${import.meta.env.VITE_USER_API_URL}/user/profile`,
        {
          firstName,
          lastName,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError("Failed to update profile");
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
      setLoading(false);
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_USER_API_URL}/user/account`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      localStorage.clear();
      window.location.href = "/";
    } catch (err) {
      setError("Failed to delete account");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans">
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <div className="px-4 py-3 flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-2 text-gray-600"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Settings</h1>
        </div>

        {/* Mobile Tabs */}
        <div className="flex border-b overflow-x-auto scrollbar-hide">
          <button
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "profile" 
                ? "text-teal-600 border-b-2 border-teal-500" 
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "privacy" 
                ? "text-teal-600 border-b-2 border-teal-500" 
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("privacy")}
          >
            Privacy
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-md border border-green-200">
            {success}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div>
            <form onSubmit={handleProfileUpdate}>
              <div className="mb-6 flex flex-col items-center">
                <div
                  className="w-20 h-20 rounded-full bg-gray-200 mb-3 relative overflow-hidden"
                  style={{
                    backgroundImage: imagePreview ? `url(${imagePreview})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {!imagePreview && (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
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
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    Change
                  </label>
                </div>
                <label
                  htmlFor="profile-image"
                  className="text-sm text-teal-600 cursor-pointer"
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
                    className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
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
                    className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
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
                  className="w-full border border-gray-300 rounded-md p-3 text-sm bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You cannot change your email address
                </p>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 text-white py-3 rounded-md text-sm font-medium"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === "privacy" && (
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
              <h4 className="text-base font-medium text-gray-700 mb-2">Privacy Policy</h4>
              <p className="text-sm text-gray-600 mb-4">
                Our Privacy Policy describes how we handle your data, your privacy rights, and how the law protects you.
              </p>
              <a
                href="/privacypolicy"
                className="text-teal-600 hover:underline text-sm font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Privacy Policy
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mt-5">
              <h4 className="text-base font-medium text-red-600 mb-2">Delete Account</h4>
              <p className="text-sm text-gray-600 mb-4">
                Warning: This action cannot be undone. All your data will be permanently deleted.
              </p>

              <form onSubmit={handleAccountDelete}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm by typing your email address
                  </label>
                  <input
                    type="text"
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                    placeholder={email}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-3 rounded-md text-sm font-medium"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Delete My Account"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserSettings;