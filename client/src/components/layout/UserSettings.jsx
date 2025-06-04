import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Bell, ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../common/LoadingScreen";

function UserSettings() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [initialData, setInitialData] = useState({});
  const [activeTab, setActiveTab] = useState("profile");

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
      const { FirstName, LastName, Email, profileImage } = response.data.user;
      setFirstName(FirstName || "");
      setLastName(LastName || "");
      setEmail(Email || "");
      setInitialData({ firstName: FirstName || "", lastName: LastName || "" });

      if (profileImage) {
        setImagePreview(profileImage);
      }
    } catch (err) {
      setError("Failed to fetch user data");
      toast.error("Failed to fetch user data");
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
      const token = localStorage.getItem("authToken");
      const response = await axios.delete(`${import.meta.env.VITE_USER_API_URL}/user/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.clear();
      if (response.data.status === 1) {
        toast.success("Account deleted successfully");
        navigate("/");
      }
    } catch (err) {
      setError("Failed to delete account");
      toast.error("Failed to delete account");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isProfileChanged =
    firstName !== initialData.firstName ||
    lastName !== initialData.lastName ||
    profileImage !== null;

  return (
    <>
      {loading && <LoadingScreen />}
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100/50 overflow-hidden">
            {/* Header */}
            <div className="border-b border-green-100/50 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500">
              <div className="flex items-center">
                <button
                  onClick={() => {
                    if (window.history.length > 2) {
                      navigate(-1);
                    } else {
                      navigate("/dashboard"); // or your preferred default page
                    }
                  }}
                  className="mr-4 text-white hover:text-green-100 transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Account Centre
                  </h1>
                  <p className="text-green-100 mt-1">
                    Manage your profile
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50/80 text-red-600 text-sm rounded-lg border border-red-200 backdrop-blur-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-green-50/80 text-green-600 text-sm rounded-lg border border-green-200 backdrop-blur-sm">
                  {success}
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Check which button was clicked
                    if (
                      e.nativeEvent.submitter &&
                      e.nativeEvent.submitter.name === "delete"
                    ) {
                      handleAccountDelete(e);
                    } else {
                      // handle save changes if needed
                    }
                  }}
                >
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100 ring-4 ring-white shadow-lg">
                        <img
                          src={
                            imagePreview ||
                            "https://www.gravatar.com/avatar/?d=mp&f=y"
                          }
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <label
                        htmlFor="profile-image"
                        className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-green-50 transition-colors"
                      >
                        <User size={16} className="text-green-600" />
                        <input
                          type="file"
                          id="profile-image"
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Profile Photo
                      </h3>
                      <p className="text-sm text-gray-500">
                        profile photo will be same as <br /> in your google account
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        disabled
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-2 border border-green-100 rounded-lg bg-green-50/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm text-gray-500"
                        placeholder="Enter your first name"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        You cannot change your first name
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        disabled
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-2 border border-green-100 rounded-lg bg-green-50/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm text-gray-500"
                        placeholder="Enter your last name"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        You cannot change your last name
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full px-4 py-2 border border-green-100 rounded-lg bg-green-50/50 text-gray-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      You cannot change your email address
                    </p>
                  </div>

                  {isProfileChanged && (
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        name="save"
                        className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  )}

                  {/* account deletion */}
                  <div className="border-t border-green-100/50 pt-6">
                    <h3 className="text-lg font-medium text-red-600 mb-4">
                      Delete Account
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm by typing your email
                        </label>
                        <input
                          type="text"
                          value={deleteConfirm}
                          onChange={(e) => setDeleteConfirm(e.target.value)}
                          className="w-full px-4 py-2 border border-green-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                          placeholder={email}
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          name="delete"
                          className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
                          disabled={loading}
                        >
                          {loading ? "Deleting..." : "Delete Account"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserSettings;