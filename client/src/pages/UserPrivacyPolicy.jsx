import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserPrivacyPolicy() {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
        await axios.delete(`${import.meta.env.VITE_USER_API_URL}/user/delete`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
      
        localStorage.removeItem("authToken");
        alert("Your account has been deleted.");
        navigate("/"); // Redirect here instead of home
      } catch (error) {
        console.error("Failed to delete account:", error);
        alert("An error occurred while deleting your account.");
      }finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        At Alumni Connect, your privacy is important to us. This privacy policy
        outlines how we collect, use, and safeguard your personal data.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <p className="mb-4">
        We collect personal information such as your name, email address, and
        any other information you voluntarily provide during registration or profile updates.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc list-inside mb-4">
        <li>To provide and maintain our services</li>
        <li>To personalize your experience</li>
        <li>To communicate with you</li>
        <li>To improve our platform</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Security</h2>
      <p className="mb-4">
        We use reasonable administrative, technical, and physical security
        measures to protect your personal information.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Your Rights</h2>
      <p className="mb-4">
        You have the right to access, update, or delete your personal information.
        You may also delete your account entirely using the option below.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Contact Us</h2>
      <p className="mb-4">
        If you have any questions about this Privacy Policy, please contact us
        at support@alumniconnect.com.
      </p>

      <div className="mt-10 border-t pt-6">
        <h3 className="text-lg font-semibold mb-3 text-red-600">
          Delete My Account
        </h3>
        <p className="mb-4">
          If you wish to permanently delete your account and all associated data,
          you can do so below. This action is irreversible.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          className={`px-5 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition ${
            isDeleting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isDeleting ? "Deleting..." : "Delete My Account"}
        </button>
      </div>
    </div>
  );
}

export default UserPrivacyPolicy;
