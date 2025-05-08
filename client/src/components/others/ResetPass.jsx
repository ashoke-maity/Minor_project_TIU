import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Extract reset token from URL query string
  const queryParams = new URLSearchParams(location.search);
  const resetToken = queryParams.get("token");

  useEffect(() => {
    if (!resetToken) {
      setError("Invalid or missing reset token.");
    }
  }, [resetToken]);

  // Password validation function (at least 8 chars, 1 special char, 1 uppercase, 1 lowercase)
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Check if the passwords match
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Validate the new password against the defined rules
    if (!validatePassword(newPassword)) {
      setError(
        "Password must be at least 8 characters long, contain one special character, one uppercase letter, and one lowercase letter."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_USER_API_URL}/reset-password`,
        { resetToken, newPassword, confirmNewPassword }
      );

      if (response.status === 200) {
        setMessage("Password reset successful. You can now log in.");
        setTimeout(() => {
          navigate("/"); // Redirect to login page after success
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.msg || "Failed to reset password. Try again.");
    }

    setLoading(false);
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
            <label htmlFor="newPassword" className="label">
              New Password
            </label>
            <input
              name="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="input w-full"
            />

            <label htmlFor="confirmNewPassword" className="label">
              Confirm New Password
            </label>
            <input
              name="confirmNewPassword"
              type="password"
              placeholder="Confirm your new password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              className="input w-full"
            />

            {message && <p className="text-green-500 text-sm">{message}</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full !bg-primary-100 !text-dark-100 hover:!bg-primary-200/80 !rounded-full !min-h-10 !font-bold !px-5 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
