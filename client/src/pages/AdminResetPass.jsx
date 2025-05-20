import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from 'react-toastify';
import LoadingScreen from '../components/common/LoadingScreen';

function AdminResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Extract reset token from URL query string
  const queryParams = new URLSearchParams(location.search);
  const resetToken = queryParams.get("token");

  useEffect(() => {
    if (!resetToken) {
      setError("Invalid or missing reset token.");
      toast.error("Invalid or missing reset token.");
    }
  }, [resetToken]);

  // Password validation function
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
      toast.error("Passwords do not match.");
      return;
    }

    // Validate the new password against the defined rules
    if (!validatePassword(newPassword)) {
      setError(
        "Password must be at least 8 characters long, contain one special character, one uppercase letter, and one lowercase letter."
      );
      toast.error("Password must meet the requirements.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_ADMIN_API_URL}/reset-password`,
        { resetToken, newPassword, confirmNewPassword }
      );

      if (response.status === 200) {
        setMessage("Password reset successful. You can now log in.");
        toast.success("Password reset successful. You can now log in.");
        setTimeout(() => {
          navigate("/admin"); // Redirect to admin login page after success
        }, 2000);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.msg || "Failed to reset password. Try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingScreen />}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
            {/* Gradient accent at top */}
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-purple-400 via-indigo-500 to-purple-600"></div>
            
            <div className="px-8 pt-12 pb-8">
              {/* Back button */}
              <div className="mb-6">
                <Link 
                  to="/admin" 
                  className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <ArrowLeft size={20} className="mr-2" /> Back to admin login
                </Link>
              </div>

              {/* Title and description */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Admin Reset Password</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Enter your new password below.
                </p>
              </div>

              {/* Error and success messages */}
              {message && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg">
                  {message}
                </div>
              )}
              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  <div className="relative rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 8 characters with one uppercase, one lowercase, one number, and one special character.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm New Password
                  </label>
                  <div className="relative rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Reset Password
                </button>
              </form>

              {/* Additional help text */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Remember your password?{" "}
                  <Link to="/admin" className="font-medium text-purple-600 hover:text-purple-500">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminResetPassword;
