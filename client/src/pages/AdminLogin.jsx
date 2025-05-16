import React, { useState, useEffect} from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function AdminLogin() {
  const navigate = useNavigate();
  const [AdminID, setAdminID] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tempImage, setTempImage] = useState(null);

 // Load temp image (profile pic) once if it exists
  useEffect(() => {
    const image = localStorage.getItem("tempProfilePic");
    if (image) {
      setTempImage(image);
      localStorage.removeItem("tempProfilePic"); // clear after one use
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_ADMIN_API_URL}/admin/login`,
        { AdminID, Password }
      );
      if (response.status === 200) {
        localStorage.setItem("authToken", response.data.token);
        navigate(`${import.meta.env.VITE_ADMIN_ROUTE}/admin/dashboard`);
      }
    } catch (error) {
      console.log("Axios error:", error);
      let errorMessage = "An error occurred. Please try again later.";

      if (error.response) {
        console.error("Error response:", error.response.data);
        errorMessage = error.response.data.msg || errorMessage;
      } else {
        console.error("Request error:", error);
      }

      alert(errorMessage); // Show popup box
      window.location.reload(); // Then reload page
    }
  };

  return (
    <div className="bg-black">
      <div className="min-h-screen flex justify-center items-center bg-black auth-layout">
        <div className="card-border lg:min-w-[566px]">
          <div className="flex flex-col card gap-6 py-14 px-10">
            {/* 🔽 Image Preview Section */}
            {tempImage && (
              <div className="text-center">
                <img
                  src={tempImage}
                  alt="Updated Profile"
                  className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-primary-100 shadow"
                />
                <p className="text-sm text-gray-400 mt-2">Your new profile picture</p>
              </div>
            )}
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

            <h3 className="text-primary-100 text-center">Admin Access Only</h3>

            <form onSubmit={handleLogin} className="w-full space-y-6 mt-4 form">
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <div className="w-full">
                <label htmlFor="AdminID" className="label">
                  Admin ID
                </label>
                <input
                  name="AdminID"
                  type="text"
                  placeholder="Enter your Admin ID"
                  value={AdminID}
                  onChange={(e) => setAdminID(e.target.value)}
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
                <Link
                  to={`${
                    import.meta.env.VITE_ADMIN_ROUTE
                  }/admin/forgotpass`}
                  className="text-primary-100 hover:text-primary-200"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="text-white text-center">
                New to admin?{" "}
                <Link
                  to={`${import.meta.env.VITE_ADMIN_ROUTE}/admin/register`}
                  className="text-primary-100  hover:text-primary-200"
                >
                  Admin Register
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
