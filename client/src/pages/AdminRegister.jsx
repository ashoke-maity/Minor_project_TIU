import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Mail, User, UserPlus, ShieldAlert } from "lucide-react";

function AdminRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_ADMIN_API_URL}/admin/register`,
        formData
      );

      if (response.status === 200) {
        alert(
          "Registration successful! A one-time password has been sent to your email."
        );
        navigate(`${import.meta.env.VITE_ADMIN_ROUTE}/admin/login`);
      }
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response?.data?.msg) {
        setError(err.response.data.msg);
      } else {
        setError("Registration failed. Try again later.");
      }
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
            {/* Logo and title */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
                <ShieldAlert className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Registration</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                Register for administrative access to AlumniConnect
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              {/* Name fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="FirstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    First Name
                  </label>
                  <div className="relative rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="FirstName"
                      name="FirstName"
                      type="text"
                      required
                      value={formData.FirstName}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      placeholder="John"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="LastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Name
                  </label>
                  <div className="relative rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="LastName"
                      name="LastName"
                      type="text"
                      required
                      value={formData.LastName}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              {/* Email field */}
              <div className="space-y-2">
                <label htmlFor="Email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Admin Email
                </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="Email"
                    name="Email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.Email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              {/* Information note */}
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  After registration, a one-time password will be sent to your email address. You will need this to complete your login.
                </p>
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
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </button>

              {/* Login link */}
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already registered?{" "}
                  <Link 
                    to={`${import.meta.env.VITE_ADMIN_ROUTE}/admin/login`} 
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
              
              {/* User login link */}
              <div className="mt-4 text-center">
                <Link to="/" className="text-xs text-gray-500 hover:text-gray-700">
                  User Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister;
