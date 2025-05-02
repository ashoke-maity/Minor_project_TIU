import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [PassoutYear, setPassoutYear] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmedPassword, setConfirmedPassword] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
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
      console.log(error); // This will log the error
      alert("Something went wrong, please try again later.");
    }
  };
  return (
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
            <h1 className="text-white text-3xl shadow-md font-medium animate-colorShift">AlumniConnect</h1>
          </div>

          <h3 className="text-primary-100">Get connected with us</h3>

          <form onSubmit={handleSubmit} className="w-full space-y-6 mt-4 form">
            {/* First and Last Name inputs horizontally */}
            <div className="flex gap-4">
              <div className="w-full">
                <label htmlFor="FirstName" className="label">
                  First Name
                </label>
                <input
                  id="FirstName"
                  name="FirstName"
                  type="text"
                  placeholder="First Name"
                  value={FirstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="input w-full"
                />
              </div>

              <div className="w-full">
                <label htmlFor="LastName" className="label">
                  Last Name
                </label>
                <input
                  name="LastName"
                  type="text"
                  placeholder="Last Name"
                  value={LastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="input w-full"
                />
              </div>
            </div>

            {/* Passout Year and Email inputs horizontally */}
            <div className="flex gap-4">
              <div className="w-full">
                <label htmlFor="PassoutYear" className="label">
                  Passout Year
                </label>
                <input
                  name="PassoutYear"
                  type="text"
                  placeholder="Passout Year"
                  value={PassoutYear}
                  onChange={(e) => setPassoutYear(e.target.value)}
                  required
                  className="input w-full"
                />
              </div>

              <div className="w-full">
                <label htmlFor="Email" className="label">
                  Email
                </label>
                <input
                  name="Email"
                  type="email"
                  placeholder="Email"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input w-full"
                />
              </div>
            </div>

            {/* Password and Confirm Password inputs horizontally */}
            <div className="flex gap-4">
              <div className="w-full">
                <label htmlFor="Password" className="label">
                  Password
                </label>
                <input
                  name="Password"
                  type="password"
                  placeholder="Password"
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input w-full"
                />
              </div>

              <div className="w-full">
                <label htmlFor="ConfirmedPassword" className="label">
                  Confirm Password
                </label>
                <input
                  name="ConfirmedPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={ConfirmedPassword}
                  onChange={(e) => setConfirmedPassword(e.target.value)}
                  required
                  className="input w-full"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full !bg-primary-100 !text-dark-100 hover:!bg-primary-200/80 !rounded-full !min-h-10 !font-bold !px-5 cursor-pointer"
            >
              Register
            </button>

            <p className="text-center text-primary-200">
              Already have an account?{" "}
              <Link to="/" className="font-bold text-user-primary text-primary-100 ml-1">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
