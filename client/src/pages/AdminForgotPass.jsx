import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      // Call forgot password API
      const response = await axios.post(
        `${import.meta.env.VITE_ADMIN_API_URL}/admin/forgot-password`,
        { email }
      );
      setMsg(response.data.msg);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to send reset email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen flex justify-center items-center auth-layout">
      <div className="card-border lg:min-w-[566px]">
        <div className="flex flex-col card gap-6 py-14 px-10">
          <div className="flex flex-row gap-2 justify-center content-center items-center mr-10">
            <img src="/icons/logo3.png" alt="logo" height={100} width={100} />
            <h1 className="text-white text-3xl shadow-md font-medium mb-2 animate-colorShift">
              AlumniConnect
            </h1>
          </div>

          <h3 className="text-primary-100 text-center">Reset Admin Password</h3>

          {msg && <p className="text-green-500 text-center">{msg}</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <label className="label text-white">Registered Email</label>
            <input
              type="email"
              className="input w-full text-white bg-black border border-white focus:outline-none focus:ring-2 focus:ring-primary-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Allow user to change email
              required
              placeholder="admin@example.com"
            />
            <button
              type="submit"
              className="w-full !bg-primary-100 !text-dark-100 hover:!bg-primary-200/80 !rounded-full !min-h-10 !font-bold !px-5 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          {/* Link to go back to the login page */}
          <div className="text-center text-white mt-4">
            <Link
              to={`${import.meta.env.VITE_ADMIN_ROUTE}/admin/login`} // Link to the login page
              className="text-primary-100 hover:text-primary-200"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminForgotPassword;
