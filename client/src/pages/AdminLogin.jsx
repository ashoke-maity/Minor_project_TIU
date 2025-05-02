import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // TODO: Replace with real admin authentication later
    if (Email === "admin@alumni.com" && Password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");
    } else {
      setError("Invalid admin credentials. Please try again.");
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
            <h1 className="text-white text-3xl shadow-md font-medium animate-colorShift">AlumniConnect Admin</h1>
          </div>

          <h3 className="text-primary-100 text-center">Admin Access Only</h3>

          <form onSubmit={handleLogin} className="w-full space-y-6 mt-4 form">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div className="w-full">
              <label htmlFor="Email" className="label">Admin Email</label>
              <input
                name="Email"
                type="email"
                placeholder="admin@alumni.com"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input w-full"
              />
            </div>

            <div className="w-full">
              <label htmlFor="Password" className="label">Password</label>
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
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
