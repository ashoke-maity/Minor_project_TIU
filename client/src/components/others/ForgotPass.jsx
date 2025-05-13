import React, { useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";


function UserForgotPassword() {
  const [Email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_USER_API_URL}/forgot-password`,
        { Email }
      );

      if (response.status === 200) {
        setMessage(response.data.msg || "Reset link sent to your email.");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setError(
        error.response?.data?.msg || "Failed to send reset link. Try again."
      );
    }
  };

  return (
    <div className="bg-black min-h-screen flex justify-center items-center auth-layout">
      <div className="card-border lg:min-w-[566px]">
        <div className="flex flex-col card gap-6 py-14 px-10">
          <div className="flex flex-row gap-2 justify-center items-center">
            <img src="/icons/logo3.png" alt="logo" height={100} width={100} />
            <h1 className="text-white text-3xl font-medium animate-colorShift">
              AlumniConnect
            </h1>
          </div>

          <h3 className="text-primary-100">Reset your password</h3>

          <form onSubmit={handleSubmit} className="w-full space-y-6 form">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter your registered email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input w-full"
            />

            {message && <p className="text-green-500 text-sm">{message}</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full !bg-primary-100 !text-dark-100 hover:!bg-primary-200/80 !rounded-full !min-h-10 !font-bold !px-5 cursor-pointer"
            >
              Send Reset Link
            </button>

            <p className="text-center text-primary-200">
              Remember your password?{" "}
              <Link
                to="/"
                className="font-bold text-user-primary text-primary-100 ml-1"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserForgotPassword;
