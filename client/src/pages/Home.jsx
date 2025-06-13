import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/Home/web/MainLayout";
import MobileMainLayout from "../components/mobile/MainLayout";


function Home() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/");
      return;
    }
  }, [navigate]);

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      {isMobile ? (
        <MobileMainLayout />
      ) : (
        <MainLayout />
      )}
    </div>
  );
}

export default Home;