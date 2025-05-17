import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import MainLayout from '../components/Home/web/MainLayout';
import SidebarSection from '../components/Home/web/SidebarSection';
import axios from 'axios';

function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_USER_API_URL}/jobs`);
        if (res.data.status === 1) {
          setJobs(res.data.jobs);
        }
      } catch (err) {
        console.error("Error fetching jobs:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <>
      <Header />
      <MainLayout jobs={jobs} loading={loading} />
    </>
  );
}

export default Home;