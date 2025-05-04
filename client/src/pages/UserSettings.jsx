import * as jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserSettings() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    profilePic: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${import.meta.env.VITE_USER_API_URL}/user/dashboard`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { FirstName, LastName, Email } = response.data;
        console.log(response.data); // debug statement
        setFormData((prev) => ({
          ...prev,
          FirstName,
          LastName,
          Email,
        }));
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission logic with API
    console.log("Form submitted:", formData);
    // if(response.status === 200){
    //     navigate("/"); //login with the updated password
    // }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-neutral-900 shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">User Settings</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.FirstName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-neutral-800 border border-neutral-700 focus:outline-none"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.LastName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-neutral-800 border border-neutral-700 focus:outline-none"
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.Email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-neutral-800 border border-neutral-700 focus:outline-none"
          />

          <div className="flex gap-4">
            <input
              type="password"
              name="password"
              placeholder="New Password"
              value={formData.Password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-neutral-800 border border-neutral-700 focus:outline-none"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.ConfirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-neutral-800 border border-neutral-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Profile Picture
            </label>
            <input
              type="file"
              name="profilePic"
              onChange={handleChange}
              accept="image/*"
              className="block w-full text-sm text-white bg-neutral-800 border border-neutral-700 rounded-lg cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black font-semibold py-2 px-4 rounded hover:bg-gray-300 transition"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserSettings;
