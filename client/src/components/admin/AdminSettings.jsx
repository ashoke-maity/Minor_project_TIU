import React, { useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminSettings() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.newPassword !== form.confirmPassword) {
      return setError("New password and confirmation do not match.");
    }

    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `${import.meta.env.VITE_ADMIN_API_URL}/admin/change-password`,
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Password updated successfully!");

      // Clear auth data and redirect after 2 seconds
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
      <div className="p-6 max-w-lg mx-auto">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              className="input w-full"
              value={form.currentPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label">New Password</label>
            <input
              type="password"
              name="newPassword"
              className="input w-full"
              value={form.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="input w-full"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-primary-100 text-white py-2 px-4 rounded-md"
          >
            Update Password
          </button>
        </form>
      </div>
    </>
  );
}
