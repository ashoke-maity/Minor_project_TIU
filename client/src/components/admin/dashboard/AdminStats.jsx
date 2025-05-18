import React, { useState, useEffect } from "react";
import StatsCard from "./StatsCard";
import axios from "axios";

/**
 * Admin dashboard statistics component that displays key metrics
 */
const AdminStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalEvents: 0,
    totalStories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(
          `${import.meta.env.VITE_ADMIN_API_URL}/admin/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Users"
        value={stats.totalUsers}
        icon="/icons/users.svg"
        loading={loading}
      />
      <StatsCard
        title="Total Jobs"
        value={stats.totalJobs}
        icon="/icons/briefcase.png"
        loading={loading}
      />
      <StatsCard
        title="Total Events"
        value={stats.totalEvents}
        icon="/icons/calendar.svg"
        loading={loading}
      />
      <StatsCard
        title="Total Stories"
        value={stats.totalStories}
        icon="/icons/story.png"
        loading={loading}
      />
    </div>
  );
};

export default AdminStats; 