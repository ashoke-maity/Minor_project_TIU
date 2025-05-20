import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Lock, Shield, Save, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingScreen from "../common/LoadingScreen";

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
    setLoading(true);
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
      toast.error("Failed to fetch user data");
      console.error(err);
    } finally {
      setLoading(false);
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
        `${import.meta.env.VITE_USER_API_URL}/user/dashboard`,
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
      toast.success("Profile updated successfully");
    } catch (err) {
      setError("Failed to update profile");
      toast.error("Failed to update profile");
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
      toast.error("New passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_USER_API_URL}/user/update`,
        {
          oldPassword: currentPassword,
          newPassword,
          confirmNewPassword: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setSuccess("Password updated successfully");
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
    // LOGOUT - Clear token and redirect
    localStorage.removeItem("authToken");
    navigate("/");  // or wherever your login route is

    } catch (err) {
      setError("Failed to update password");
      toast.error("Failed to update password");
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
    <>
      {loading && <LoadingScreen />}
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
              <h1 className="text-2xl font-bold text-gray-800">
                Account Settings
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage your profile and account preferences
              </p>
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
                    <User
                      size={18}
                      className={
                        activeTab === "profile"
                          ? "text-teal-500"
                          : "text-gray-500"
                      }
                    />
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
                    <Shield
                      size={18}
                      className={
                        activeTab === "privacy"
                          ? "text-teal-500"
                          : "text-gray-500"
                      }
                    />
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
                    <Lock
                      size={18}
                      className={
                        activeTab === "password"
                          ? "text-teal-500"
                          : "text-gray-500"
                      }
                    />
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
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Profile Settings
                    </h3>
                    <form onSubmit={handleProfileUpdate}>
                      <div className="mb-6 flex flex-col items-center">
                        <div
                          className="w-24 h-24 rounded-full bg-gray-200 mb-3 relative overflow-hidden"
                          style={{
                            backgroundImage: imagePreview
                              ? `url(${imagePreview})`
                              : "none",
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
                            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <span className="text-white text-sm">
                              Change Photo
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label
                            htmlFor="firstName"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            First Name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="lastName"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                      >
                        <Save size={18} className="mr-2" />
                        Save Changes
                      </button>
                    </form>
                  </div>
                )}

                {/* Password Settings */}
                {activeTab === "password" && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Change Password
                    </h3>
                    <form onSubmit={handlePasswordUpdate}>
                      <div className="mb-4">
                        <label
                          htmlFor="currentPassword"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="newPassword"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                      >
                        <Lock size={18} className="mr-2" />
                        Update Password
                      </button>
                    </form>
                  </div>
                )}

                {/* Privacy & Account Settings */}
                {activeTab === "privacy" && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Privacy & Account
                    </h3>
                    <div className="mb-8">
                      <h4 className="text-lg font-medium text-gray-800 mb-2">
                        Delete Account
                      </h4>
                      <p className="text-gray-600 text-sm mb-4">
                        Once you delete your account, there is no going back.
                        Please be certain.
                      </p>
                      <form onSubmit={handleAccountDelete}>
                        <div className="mb-4">
                          <label
                            htmlFor="deleteConfirm"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Type your email to confirm
                          </label>
                          <input
                            type="email"
                            id="deleteConfirm"
                            value={deleteConfirm}
                            onChange={(e) => setDeleteConfirm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            placeholder={email}
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        >
                          <Trash2 size={18} className="mr-2" />
                          Delete Account
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserSettings;
