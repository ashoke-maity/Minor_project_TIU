import React, { useState, useEffect} from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { User, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

function AdminLogin() {
  const navigate = useNavigate();
  const [AdminID, setAdminID] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tempImage, setTempImage] = useState(null);

  // Load temp image (profile pic) once if it exists
  useEffect(() => {
    const image = localStorage.getItem("tempProfilePic");
    if (image) {
      setTempImage(image);
      localStorage.removeItem("tempProfilePic"); // clear after one use
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_ADMIN_API_URL}/admin/login`,
        { AdminID, Password }
      );
      if (response.status === 200) {
        localStorage.setItem("authToken", response.data.token);
        navigate(`${import.meta.env.VITE_ADMIN_ROUTE}/admin/dashboard`);
      }
    } catch (error) {
      console.log("Axios error:", error);
      let errorMessage = "An error occurred. Please try again later.";

      if (error.response) {
        console.error("Error response:", error.response.data);
        errorMessage = error.response.data.msg || errorMessage;
      } else {
        console.error("Request error:", error);
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          {/* Gradient accent at top */}
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600"></div>
          
          <div className="px-8 pt-12 pb-8">
            {/* Image Preview Section */}
            {tempImage && (
              <div className="text-center mb-6">
                <img
                  src={tempImage}
                  alt="Updated Profile"
                  className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-indigo-500 shadow"
                />
                <p className="text-sm text-gray-500 mt-2">Your new profile picture</p>
              </div>
            )}
            
            {/* Logo and title */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Access</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                Sign in to manage the AlumniConnect platform
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Admin ID field */}
              <div className="space-y-2">
                <label htmlFor="AdminID" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Admin ID
                </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="AdminID"
                    name="AdminID"
                    type="text"
                    required
                    value={AdminID}
                    onChange={(e) => setAdminID(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Enter your Admin ID"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="Password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
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
              </div>

              {/* Forgot password link */}
              <div className="flex items-center justify-end">
                <Link 
                  to={`${import.meta.env.VITE_ADMIN_ROUTE}/admin/forgotpass`} 
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Register option */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                New admin? {" "}
                <Link 
                  to={`${import.meta.env.VITE_ADMIN_ROUTE}/admin/register`} 
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Register here
                </Link>
              </p>
            </div>
            
            {/* User login link */}
            <div className="mt-4 text-center">
              <Link to="/" className="text-xs text-gray-500 hover:text-gray-700">
                User Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
