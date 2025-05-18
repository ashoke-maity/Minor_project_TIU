import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, User, Calendar, Eye, EyeOff, UserPlus } from "lucide-react";

function Register() {
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [PassoutYear, setPassoutYear] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmedPassword, setConfirmedPassword] = useState("");
  const [errors, setErrors] = useState({}); // Added errors state
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // Password validation function
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate passwords before submission
    const newErrors = {};

    // Check password policy
    if (!validatePassword(Password)) {
      newErrors.Password =
        "Password must be at least 8 characters, include one special character, one uppercase, and one lowercase letter";
    }

    // Check if passwords match
    if (Password !== ConfirmedPassword) {
      newErrors.ConfirmedPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    // If there are errors, don't submit the form
    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_USER_API_URL}/user/register`,
        {
          FirstName,
          LastName,
          PassoutYear,
          Email,
          Password,
          ConfirmedPassword,
        }
      );
      console.log(response);
      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        newErrors.general = error.response.data.msg || "Registration failed. Please try again.";
      } else {
        newErrors.general = "Something went wrong, please try again later.";
      }
      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 50; year--) {
      years.push(year);
    }
    return years;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          {/* Gradient accent at top */}
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-600"></div>
          
          <div className="px-8 pt-12 pb-8">
            {/* Logo and title */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-600 flex items-center justify-center mb-4 shadow-lg">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Create Your Account</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                Join the alumni network and reconnect with your peers
              </p>
            </div>

            {/* General error message */}
            {errors.general && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                      value={FirstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
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
                      value={LastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              {/* Email and Passout Year fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="Email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
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
                      value={Email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="PassoutYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Passout Year
                  </label>
                  <div className="relative rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="PassoutYear"
                      name="PassoutYear"
                      required
                      value={PassoutYear}
                      onChange={(e) => setPassoutYear(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm appearance-none"
                    >
                      <option value="">Select Year</option>
                      {getYearOptions().map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Password fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="Password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="Password"
                      name="Password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={Password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`block w-full pl-10 pr-10 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm ${
                        errors.Password ? "border-red-300" : "border-gray-300"
                      }`}
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
                  {errors.Password && (
                    <p className="text-red-500 text-xs mt-1">{errors.Password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="ConfirmedPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm Password
                  </label>
                  <div className="relative rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="ConfirmedPassword"
                      name="ConfirmedPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={ConfirmedPassword}
                      onChange={(e) => setConfirmedPassword(e.target.value)}
                      className={`block w-full pl-10 pr-10 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm ${
                        errors.ConfirmedPassword ? "border-red-300" : "border-gray-300"
                      }`}
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
                  {errors.ConfirmedPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.ConfirmedPassword}</p>
                  )}
                </div>
              </div>

              {/* Password requirements */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>Password requirements:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>At least 8 characters</li>
                  <li>At least one uppercase letter</li>
                  <li>At least one lowercase letter</li>
                  <li>At least one number</li>
                  <li>At least one special character (@$!%*?&)</li>
                </ul>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Login link */}
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link to="/" className="font-medium text-teal-600 hover:text-teal-500">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
