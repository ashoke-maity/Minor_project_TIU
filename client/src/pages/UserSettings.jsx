import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Password validation function
const validatePassword = (password) => {
  const minLength = /.{8,}/; // At least 8 characters
  const uppercase = /[A-Z]/; // At least one uppercase letter
  const lowercase = /[a-z]/; // At least one lowercase letter
  const digit = /\d/; // At least one digit
  const specialChar = /[!@#$%^&*(),.?":{}|<>]/; // At least one special character

  return {
    minLength: minLength.test(password),
    uppercase: uppercase.test(password),
    lowercase: lowercase.test(password),
    digit: digit.test(password),
    specialChar: specialChar.test(password),
  };
};

function PasswordForm() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: true,
    uppercase: true,
    lowercase: true,
    digit: true,
    specialChar: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      setSuccess(false);
      return;
    }

    // Check password validity
    const validation = validatePassword(newPassword);
    if (
      !validation.minLength ||
      !validation.uppercase ||
      !validation.lowercase ||
      !validation.digit ||
      !validation.specialChar
    ) {
      setMessage(
        "Password should have At least 8 characters, At least one uppercase letter, At least one lowercase letter and At least one special character"
      );
      setSuccess(false);
      setPasswordValidation(validation); // Update validation state
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      const response = await axios.put(
        `${import.meta.env.VITE_USER_API_URL}/user/update`,
        {
          oldPassword: currentPassword,
          newPassword: newPassword,
          confirmNewPassword: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Password updated successfully!");
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordValidation({
        minLength: true,
        uppercase: true,
        lowercase: true,
        digit: true,
        specialChar: true,
      });

      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.error("Axios error:", error);
      if (error.response) {
        alert(error.response.data.msg || "Something went wrong, try again!");
      } else {
        alert("An error occurred. Please try again later.");
      }
      setSuccess(false);
      // Reload the page to give the user a fresh start
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Confirm New Password:
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        {message && (
          <p
            className={`mt-2 text-sm ${
              success ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default PasswordForm;
