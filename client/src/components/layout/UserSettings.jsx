import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Lock, Shield, Save, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function UserSettings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      // In a real implementation, you'd use FormData to handle file uploads
      await axios.put(
        `${import.meta.env.VITE_USER_API_URL}/user/profile`,
        {
          firstName,
          lastName,
          // The actual implementation would include the profile image
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

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_USER_API_URL}/user/password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setSuccess("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("Failed to update password");
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
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-gray-600 hover:text-teal-600 transition-colors"
          >
            <X size={20} className="mr-2" /> Back to home
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
            <p className="text-gray-600 text-sm mt-1">Manage your profile and account preferences</p>
          </div>
          
          <div className="flex flex-col sm:flex-row min-h-[600px]">
            {/* Sidebar */}
            <div className="w-full sm:w-1/3 bg-gray-50 p-4 border-r border-gray-200">
              <div className="space-y-1">
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                    activeTab === "profile"
                      ? "bg-teal-50 text-teal-600"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  <User size={18} className={activeTab === "profile" ? "text-teal-500" : "text-gray-500"} />
                  <span className="ml-2">Profile Settings</span>
                </button>
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                    activeTab === "privacy"
                      ? "bg-teal-50 text-teal-600"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("privacy")}
                >
                  <Shield size={18} className={activeTab === "privacy" ? "text-teal-500" : "text-gray-500"} />
                  <span className="ml-2">Privacy & Account</span>
                </button>
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                    activeTab === "password"
                      ? "bg-teal-50 text-teal-600"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("password")}
                >
                  <Lock size={18} className={activeTab === "password" ? "text-teal-500" : "text-gray-500"} />
                  <span className="ml-2">Password</span>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="w-full sm:w-2/3 p-6 overflow-y-auto">
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

              {/* Profile Settings */}
              {activeTab === "profile" && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Profile Settings</h3>
                  <form onSubmit={handleProfileUpdate}>
                    <div className="mb-6 flex flex-col items-center">
                      <div
                        className="w-24 h-24 rounded-full bg-gray-200 mb-3 relative overflow-hidden"
                        style={{
                          backgroundImage: imagePreview ? `url(${imagePreview})` : "none",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        {!imagePreview && (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <User size={40} />
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
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
                          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full border border-gray-300 rounded-md p-2 text-sm bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        You cannot change your email address
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium"
                        disabled={loading}
                      >
                        {loading ? (
                          "Saving..."
                        ) : (
                          <>
                            <Save size={16} className="mr-2" /> Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Privacy & Account */}
              {activeTab === "privacy" && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Privacy & Account</h3>
                  
                  <div className="mb-6">
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

                  <div className="border-t border-gray-200 pt-6">
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
                          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                          placeholder={email}
                        />
                      </div>

                      <button
                        type="submit"
                        className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        disabled={loading}
                      >
                        {loading ? (
                          "Processing..."
                        ) : (
                          <>
                            <Trash2 size={16} className="mr-2" /> Delete Account
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Password */}
              {activeTab === "password" && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Update Password</h3>
                  <form onSubmit={handlePasswordUpdate}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                        placeholder="Enter your current password"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                        placeholder="Enter new password"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                        placeholder="Confirm new password"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium"
                        disabled={loading}
                      >
                        {loading ? (
                          "Updating..."
                        ) : (
                          <>
                            <Save size={16} className="mr-2" /> Update Password
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSettings; 