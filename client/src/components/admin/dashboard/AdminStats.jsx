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
        setLoading(true);
        const token = localStorage.getItem("authToken");
        // Fetch all stats in parallel
        const [userRes, jobRes, eventRes, storyRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_ADMIN_API_URL}/user-count`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(
            `${import.meta.env.VITE_ADMIN_API_URL}/job-count`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(
            `${import.meta.env.VITE_ADMIN_API_URL}/event-count`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(
            `${import.meta.env.VITE_ADMIN_API_URL}/story-count`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);
        setStats({
          totalUsers: userRes.data.userCount + (userRes.data.adminCount || 0),
          totalJobs: jobRes.data.jobCount,
          totalEvents: eventRes.data.eventCount,
          totalStories: storyRes.data.storyCount,
        });
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