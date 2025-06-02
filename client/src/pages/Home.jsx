import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/Home/web/MainLayout";
import MobileMainLayout from "../components/mobile/MainLayout";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    // Fetch jobs posted by admin
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_ADMIN_API_URL}/view/jobs`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

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
        <MobileMainLayout jobs={jobs} loading={loading} />
      ) : (
        <MainLayout jobs={jobs} loading={loading} />
      )}
    </div>
  );
}

export default Home;