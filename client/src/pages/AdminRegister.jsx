import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function AdminRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_ADMIN_API_URL}/admin/register`,
        formData
      );

      if (response.status === 200) {
        alert("Registration successful! A one-time password has been sent to your email.");
        navigate(`${import.meta.env.VITE_ADMIN_ROUTE}/admin/login`);
      }
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response?.data?.msg) {
        setError(err.response.data.msg);
      } else {
        setError("Registration failed. Try again later.");
      }
    }
  };

  return (
    <div className="bg-black">
      <div className="min-h-screen flex justify-center items-center bg-black auth-layout">
        <div className="card-border lg:min-w-[566px]">
          <div className="flex flex-col card gap-6 py-14 px-10">
            <div className="flex flex-row gap-2 justify-center items-center mr-10">
              <img src="/icons/logo3.png" alt="logo" height={100} width={100} />
              <h1 className="text-white text-3xl mb-2 shadow-md font-medium animate-colorShift">
                Admin Registration
              </h1>
            </div>

            <h3 className="text-primary-100 text-center">Only for New Admins</h3>

            <form onSubmit={handleRegister} className="w-full space-y-6 mt-4 form">
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <div className="flex flex-col md:flex-row gap-4 w-full">
                <div className="w-full">
                  <label htmlFor="FirstName" className="label">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="FirstName"
                    placeholder="Enter First Name"
                    value={formData.FirstName}
                    onChange={handleChange}
                    required
                    className="input w-full"
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="LastName" className="label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="LastName"
                    placeholder="Enter Last Name"
                    value={formData.LastName}
                    onChange={handleChange}
                    required
                    className="input w-full"
                  />
                </div>
              </div>

              <div className="w-full">
                <label htmlFor="Email" className="label">
                  Admin Email
                </label>
                <input
                  type="email"
                  name="Email"
                  placeholder="Enter your Admin Email"
                  value={formData.Email}
                  onChange={handleChange}
                  required
                  className="input w-full"
                />
              </div>

              <button
                type="submit"
                className="w-full !bg-primary-100 !text-dark-100 hover:!bg-primary-200/80 !rounded-full !min-h-10 !font-bold !px-5 cursor-pointer"
              >
                Register
              </button>

              <div className="text-white text-center">
                Already registered?{" "}
                <Link
                  to={`${import.meta.env.VITE_ADMIN_ROUTE}/admin/login`}
                  className="text-primary-100 hover:text-primary-200"
                >
                  Admin Login
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
