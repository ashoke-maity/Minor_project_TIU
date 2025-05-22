import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Shield } from "lucide-react";
import { toast } from "react-toastify";
import LoadingScreen from "../common/LoadingScreen";

function UserSettings() {
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

    if (!firstName || !lastName) {
      setError("First and Last name cannot be empty");
      toast.error("First and Last name cannot be empty");
      setLoading(false);
      return;
    }

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
      setInitialData({ firstName, lastName });
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

  const isProfileChanged =
    firstName !== initialData.firstName ||
    lastName !== initialData.lastName ||
    profileImage !== null;

  return (
    <>
      {loading && <LoadingScreen />}
      <div className="max-w-xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={imagePreview || "https://www.gravatar.com/avatar/?d=mp&f=y"}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="border rounded px-4 py-2"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="border rounded px-4 py-2"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className={`bg-blue-600 text-white px-4 py-2 rounded flex items-center ${
              loading || !isProfileChanged ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading || !isProfileChanged}
          >
            <Shield className="mr-2 h-4 w-4" />
            Save Changes
          </button>
        </form>

        <hr className="my-8" />

        <h2 className="text-xl font-semibold text-red-600 mb-2">Delete Account</h2>
        <form onSubmit={handleAccountDelete} className="space-y-4">
          <p>
            To confirm account deletion, type your email: <b>{email}</b>
          </p>
          <input
            type="email"
            placeholder="Enter your email to confirm"
            className="border rounded px-4 py-2 w-full"
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
          />
          <button
            type="submit"
            className={`bg-red-600 text-white px-4 py-2 rounded flex items-center ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete My Account
          </button>
        </form>
      </div>
    </>
  );
}

export default UserSettings;
