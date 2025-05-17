import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminSettings() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Profile info state
  const [profile, setProfile] = useState({
    FirstName: "",
    LastName: "",
    ProfileImage: "", // URL or base64 preview
  });

  // Original profile for change detection
  const [originalProfile, setOriginalProfile] = useState({
    FirstName: "",
    LastName: "",
    ProfileImage: "",
  });

  // For new file upload
  const [selectedFile, setSelectedFile] = useState(null);

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Fetch admin data on mount to prefill profile info
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(
          `${import.meta.env.VITE_ADMIN_API_URL}/admin/dashboard`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.status === 200 && res.data.admin) {
          setProfile({
            FirstName: res.data.admin.FirstName || "",
            LastName: res.data.admin.LastName || "",
            ProfileImage: res.data.admin.ProfileImage || "",
          });
          setOriginalProfile({
            FirstName: res.data.admin.FirstName || "",
            LastName: res.data.admin.LastName || "",
            ProfileImage: res.data.admin.ProfileImage || "",
          });
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };
    fetchAdminData();
  }, []);

  // Profile input change handler
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Profile image select
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfile((prev) => ({
        ...prev,
        ProfileImage: URL.createObjectURL(file),
      }));
    }
  };

  const [removingImage, setRemovingImage] = useState(false);
  const handleRemoveProfileImage = async () => {
    if (!profile.ProfileImage) return;

    setRemovingImage(true);
    setProfileError("");
    setProfileSuccess("");

    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `${import.meta.env.VITE_ADMIN_API_URL}/admin/profile-image`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProfile((prev) => ({ ...prev, ProfileImage: "" }));
      setSelectedFile(null);
      setProfileSuccess("Profile image removed successfully.");
    } catch (err) {
      setProfileError(err.response?.data?.msg || "Failed to remove profile image.");
    } finally {
      setRemovingImage(false);
    }
  };

  // handle logout
  const handleLogout = () => {
    localStorage.clear();
    navigate(`${import.meta.env.VITE_ADMIN_ROUTE}/admin/login`);
  };

  // Password form change handler
  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  // Detect if profile has changes to enable Save button
  const profileChanged =
    profile.FirstName !== originalProfile.FirstName ||
    profile.LastName !== originalProfile.LastName ||
    selectedFile !== null;

  // Handle profile save
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setUploading(true);

    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("FirstName", profile.FirstName);
      formData.append("LastName", profile.LastName);
      if (selectedFile) {
        formData.append("profilePic", selectedFile);
      }

      await axios.put(
        `${import.meta.env.VITE_ADMIN_API_URL}/admin/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfileSuccess("Profile updated successfully!");
      setOriginalProfile({
        FirstName: profile.FirstName,
        LastName: profile.LastName,
        ProfileImage: profile.ProfileImage,
      });
      setSelectedFile(null);
    } catch (err) {
      setProfileError(err.response?.data?.msg || "Failed to update profile.");
    } finally {
      setUploading(false);
    }
  };

  // Handle password submit (your original function)
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setError("New password and confirmation do not match.");
    }

    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("currentPassword", passwordForm.currentPassword);
      formData.append("newPassword", passwordForm.newPassword);

      await axios.put(
        `${import.meta.env.VITE_ADMIN_API_URL}/admin/change-password`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("Password updated successfully!");

      setTimeout(() => {
        localStorage.removeItem("authToken");
        navigate(`${import.meta.env.VITE_ADMIN_ROUTE}/admin/login`);
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.msg || "Failed to change password. Try again."
      );
    }
  };

  return (
    <>
      <Sidebar />
      <div className="p-6 sm:p-10 max-w-3xl mx-auto space-y-10">
        {/* Profile Update Section */}
        <section className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
            Profile Settings
          </h2>

          {profileError && <p className="text-red-500 mb-4">{profileError}</p>}
          {profileSuccess && (
            <p className="text-green-600 mb-4">{profileSuccess}</p>
          )}

          <div className="flex justify-center mb-6">
            <div className="relative">
              <div
                className="w-32 h-32 rounded-full overflow-hidden group cursor-pointer border-4 border-primary-100 shadow-md"
                onClick={() => fileInputRef.current.click()}
              >
                <img
                  src={
                    profile.ProfileImage ||
                    "https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
                  {uploading ? "Uploading..." : "Upload Photo"}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  ref={fileInputRef}
                  hidden
                />
              </div>

              {/* Trash icon button */}
              {profile.ProfileImage && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the file input click
                    handleRemoveProfileImage();
                  }}
                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition"
                  aria-label="Remove profile picture"
                  title="Remove profile picture"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-5">
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                First Name
              </label>
              <input
                type="text"
                name="FirstName"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
                value={profile.FirstName}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Last Name
              </label>
              <input
                type="text"
                name="LastName"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
                value={profile.LastName}
                onChange={handleProfileChange}
                required
              />
            </div>

            {profileChanged && (
              <div className="pt-4">
                <button
                  type="submit"
                  className="bg-primary-100 hover:bg-primary-200 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                  disabled={uploading}
                >
                  {uploading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </section>

        {/* Password Change Section */}
        <section className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
            Change Password
          </h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-600 mb-4">{success}</p>}

          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="bg-primary-100 hover:bg-primary-200 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
              >
                Update Password
              </button>
            </div>
          </form>
          {/* logout */}
          <div className="flex mt-10 mb-6">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            >
              <img src="/icons/logout.svg" alt="Logout" className="w-5 h-5" />
              Logout
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

export default AdminSettings;