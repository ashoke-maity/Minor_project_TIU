import React, { useState } from "react";
import { useNavigate, Link} from "react-router-dom";
import axios from "axios";

function AdminLogin() {
  const navigate = useNavigate();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_ADMIN_API_URL}/admin/login`,
        { Email, Password }
      );
      if (response.status === 200) {
        const token = localStorage.setItem("authToken", response.data.token);
        console.log(token); // debug statement
        console.log(response.data.admin); // debug
        navigate(`${import.meta.env.VITE_ADMIN_ROUTE}/admin/dashboard`);
      }
    } catch (error) {
      console.log("Axios error:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(error.response.data.msg || "Something went wrong, try again!");
      } else {
        console.error("Request error:", error);
        alert("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-black auth-layout">
      <div className="card-border lg:min-w-[566px]">
        <div className="flex flex-col card gap-6 py-14 px-10">
          <div className="flex flex-row gap-2 justify-center content-center items-center mr-10">
            <img
              src="/logo2.png"
              alt="logo"
              height={100}
              width={100}
              className=""
            />
            <h1 className="text-white text-3xl shadow-md font-medium animate-colorShift">
              AlumniConnect Admin
            </h1>
          </div>

          <h3 className="text-primary-100 text-center">Admin Access Only</h3>

          <form onSubmit={handleLogin} className="w-full space-y-6 mt-4 form">
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <div className="w-full">
              <label htmlFor="Email" className="label">
                Admin Email
              </label>
              <input
                name="Email"
                type="email"
                placeholder="Enter your Admin Email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input w-full"
              />
            </div>

            <div className="w-full">
              <label htmlFor="Password" className="label">
                Password
              </label>
              <input
                name="Password"
                type="password"
                placeholder="••••••••"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input w-full"
              />
            </div>

            <button
              type="submit"
              className="w-full !bg-primary-100 !text-dark-100 hover:!bg-primary-200/80 !rounded-full !min-h-10 !font-bold !px-5 cursor-pointer"
            >
              Login
            </button>

            <div className="text-white text-center">
              New to admin?{" "}
              <Link
                to={`${import.meta.env.VITE_ADMIN_ROUTE}/admin/register`}
                className="text-primary-100 underline hover:text-primary-200"
              >
                Admin Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
