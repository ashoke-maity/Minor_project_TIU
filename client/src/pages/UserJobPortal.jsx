import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JobPortal = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    location: "",
    description: "",
    jobType: "",
    salary: "",
    ApplicationDeadline: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_ADMIN_API_URL}/admin/jobs`);
        setJobs(response.data.jobs || []);
      } catch (err) {
        setError("Failed to load jobs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = (jobId) => {
    alert(`Apply action triggered for Job ID: ${jobId}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_USER_API_URL}/user/jobs`, formData);
      setSuccessMessage("Job posted successfully!");
      setFormData({
        jobTitle: "",
        companyName: "",
        location: "",
        description: "",
        jobType: "",
        salary: "",
        ApplicationDeadline: "",
      });
    } catch (err) {
      console.error("Job post failed", err);
      setError("Failed to post job");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary-100">Job Listings</h1>

      {/* User Job Post Form */}
      <div className="mb-10 p-6 border rounded-xl shadow bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Post a Job</h2>
        {successMessage && <div className="text-green-600 mb-2">{successMessage}</div>}
        {error && <div className="text-red-500 mb-2">{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="jobTitle" placeholder="Job Title" value={formData.jobTitle} onChange={handleChange} required className="border p-2 rounded" />
          <input type="text" name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} required className="border p-2 rounded" />
          <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required className="border p-2 rounded" />
          <input type="text" name="jobType" placeholder="Job Type (Full-time, Part-time)" value={formData.jobType} onChange={handleChange} required className="border p-2 rounded" />
          <input type="text" name="salary" placeholder="Salary" value={formData.salary} onChange={handleChange} className="border p-2 rounded" />
          <input type="date" name="ApplicationDeadline" placeholder="Application Deadline" value={formData.ApplicationDeadline} onChange={handleChange} className="border p-2 rounded" />
          <textarea name="description" placeholder="Job Description" value={formData.description} onChange={handleChange} required className="border p-2 rounded md:col-span-2" />
          <button type="submit" className="bg-primary-100 text-white px-4 py-2 rounded hover:bg-primary-100/80 transition md:col-span-2">Post Job</button>
        </form>
      </div>

      {/* Job List */}
      {loading ? (
        <div className="p-4 text-gray-600">Loading jobs...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">{job.jobTitle}</h2>
              <p className="text-sm text-gray-500 mb-2">{job.companyName} • {job.location}</p>
              <p className="text-gray-700 mb-2">{job.description}</p>
              <p className="text-sm text-gray-600">Type: {job.jobType}</p>
              <p className="text-sm text-gray-600">Salary: {job.salary}</p>
              <p className="text-sm text-gray-600 mb-4">Deadline: {job.ApplicationDeadline?.split("T")[0]}</p>
              <button
                onClick={() => handleApply(job._id)}
                className="mt-2 bg-primary-100 text-white px-4 py-2 rounded hover:bg-primary-100/80 transition"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobPortal;
