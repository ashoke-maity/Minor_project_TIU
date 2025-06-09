import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LogIn } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import LoadingScreen from "../common/LoadingScreen";
import LoginTransition from "../animations/LoginTransition";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showTransition, setShowTransition] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_USER_API_URL}/user/google-signin`,
        { tokenId: credentialResponse.credential }
      );
      if (!credentialResponse.credential) {
        toast.error("login failed: Token ID missing");
        setLoading(false);
        return;
      }
      if (response.status === 200) {
        localStorage.setItem("authToken", response.data.token);
        toast.success("login successful!");
        
        // Show animation transition instead of immediate navigation
        setLoading(false);
        setShowTransition(true);
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(error.response?.data?.msg || "login failed");
      setLoading(false);
    }
  };

  const handleTransitionComplete = () => {
    navigate("/home");
  };

  return (
    <>
      {loading && <LoadingScreen />}
      {showTransition && (
        <LoginTransition onComplete={handleTransitionComplete} />
      )}
      
      {!showTransition && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-12">
          <div className="w-full max-w-md">
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
              {/* Gradient accent at top */}
              <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-600"></div>

              <div className="px-8 pt-12 pb-8">
                {/* Logo and title */}
                <div className="flex flex-col items-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-600 flex items-center justify-center mb-4 shadow-lg">
                    <LogIn className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Welcome to AlumniConnect
                  </h1>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                    Sign in with Google to reconnect with your alumni network
                  </p>
                </div>

                {/* Google Sign-In Button */}
                <div className="GoogleSignIn mt-6">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error("login failed")}
                    useOneTap
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;