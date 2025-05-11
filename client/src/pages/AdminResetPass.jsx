import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

function AdminResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_ADMIN_API_URL}/admin/reset-password/${token}`,
        { newPassword } // Send the correct key
      );
      setMsg(response.data.msg);
      setTimeout(() => navigate(`${import.meta.env.VITE_ADMIN_ROUTE}/admin/login`), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to reset password.");
    } finally {
      setIsLoading(false); // Stop loading after the request
    }
  };

  return (
    <div className="bg-black">
      <div className="min-h-screen flex justify-center items-center bg-black auth-layout">
        <div className="card-border lg:min-w-[566px]">
          <div className="flex flex-col card gap-6 py-14 px-10">
            <div className="flex flex-row gap-2 justify-center content-center items-center mr-10">
              <img
                src="/icons/logo3.png"
                alt="logo"
                height={100}
                width={100}
                className=""
              />
              <h1 className="text-white text-3xl shadow-md font-medium mb-2 animate-colorShift">
                AlumniConnect
              </h1>
            </div>

            <h3 className="text-primary-100 text-center">Reset Your Admin Password</h3>

            {msg && <p className="text-green-600 text-center">{msg}</p>}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <form onSubmit={handleReset} className="w-full space-y-6 mt-4 form">
              <div className="w-full">
                <label htmlFor="newPassword" className="label">
                  New Password
                </label>
                <input
                  name="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="input w-full"
                />
              </div>

              <div className="w-full">
                <label htmlFor="confirmPassword" className="label">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="input w-full"
                />
              </div>

              <button
                type="submit"
                className="w-full !bg-primary-100 !text-dark-100 hover:!bg-primary-200/80 !rounded-full !min-h-10 !font-bold !px-5 cursor-pointer"
                disabled={isLoading} // Disable while loading
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>

              <div className="text-white text-center">
                <Link
                  to={`${import.meta.env.VITE_ADMIN_ROUTE}/admin/login`}
                  className="text-primary-100 hover:text-primary-200"
                >
                  Go back to login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminResetPassword;
