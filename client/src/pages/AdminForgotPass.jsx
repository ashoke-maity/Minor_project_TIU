import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from 'react-toastify';
import LoadingScreen from '../components/common/LoadingScreen';

function AdminForgotPassword() {
  const [Email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_ADMIN_API_URL}/forgot-password`,
        { Email }
      );

      if (response.status === 200) {
        setMessage(response.data.msg || "Reset link sent to your email.");
        toast.success("Reset link sent to your email.");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      const errorMsg = error.response?.data?.msg || "Failed to send reset link. Try again.";
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
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Forgot Password?</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Enter your admin email address and we'll send you a link to reset your password.
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
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Admin Email Address
                  </label>
                  <div className="relative rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={Email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                      placeholder="admin@example.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Send Reset Link
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

export default AdminForgotPassword;
