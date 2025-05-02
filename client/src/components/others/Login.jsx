import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_USER_API_URL}/user/login`,
        { Email, Password }
      );
      if (response.status === 200) {
        localStorage.setItem("authToken", response.data.token);
        navigate("/home");
      }
    } catch (error) {
      console.log('Axios error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        alert(error.response.data.msg || "Something went wrong, try again!");
      } else {
        console.error('Request error:', error);
        alert("An error occurred. Please try again later.");
      }
    }
  };
  
  return (
    <div className="min-h-screen flex justify-center items-center bg-black auth-layout ">
      <div className="card-border lg:min-w-[566px] ">
        <div className="flex flex-col card gap-6 py-14 px-10 ">
          <div className="flex flex-row gap-2 justify-center content-center items-center">
            <img
              src="/logo2.png"
              alt="logo"
              height={100}
              width={100}

            />
            <h1 className="text-white text-3xl shadow-md font-medium animate-colorShift">AlumniConnect</h1>
          </div>

          <h3 className="text-primary-100">Get connected with us</h3>

          <form onSubmit={handleSubmit} className="w-full space-y-6 mt-4 form">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input w-full"
            />

            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input w-full"
            />

            <button
              type="submit"
              className="w-full !bg-primary-100 !text-dark-100 hover:!bg-primary-200/80 !rounded-full !min-h-10 !font-bold !px-5 cursor-pointer"
            >
              Login
            </button>

            <p className="text-center text-primary-200">
              Don't have an account?{" "}
              <Link to="/register" className="font-bold text-user-primary text-primary-100 ml-1">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
