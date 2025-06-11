import React, { useState, useEffect } from 'react';
import { 
  AccumulationChartComponent, 
  AccumulationSeriesCollectionDirective, 
  AccumulationSeriesDirective,
  PieSeries,
  AccumulationLegend,
  AccumulationTooltip,
  AccumulationDataLabel,
  Inject
} from '@syncfusion/ej2-react-charts';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Toast } from '../../../utils';

const JobOpeningsChart = () => {
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalJobs, setTotalJobs] = useState(0);
  const [jobs, setJobs] = useState([]); // Store all job details
  const adminRoute = import.meta.env.VITE_ADMIN_ROUTE;

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("authToken");
        
        // Fetch job data from API
        const res = await axios.get(
          `${import.meta.env.VITE_ADMIN_API_URL}/admin/jobs`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        if (res.data && res.data.jobs) {
          const jobs = res.data.jobs;
          setJobs(jobs); // Save all jobs for details table
          setTotalJobs(jobs.length);
          
          // Process job data to group by job type
          const jobTypeMap = {};
          jobs.forEach(job => {
            const type = job.jobType || 'Other';
            if (jobTypeMap[type]) {
              jobTypeMap[type] += 1;
            } else {
              jobTypeMap[type] = 1;
            }
          });
          
          // Convert to array format for chart
          const chartData = Object.entries(jobTypeMap).map(([category, count]) => ({
            category,
            count
          }));
          
          setJobData(chartData.length > 0 ? chartData : [
            { category: 'No Jobs', count: 1 }
          ]);
        } else {
          setJobData([{ category: 'No Jobs', count: 1 }]);
        }
      } catch (error) {
        console.error("Error fetching job data:", error);
        setError("Failed to load job data");
        Toast.error("Failed to load job data");
        
        // Fallback data
        setJobData([{ category: 'Error Loading Data', count: 1 }]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, []);

  // Customizing tooltip
  const tooltip = { enable: true, format: '${point.x}: <b>${point.y}</b>' };
  
  // Data label settings
  const dataLabel = {
    visible: true,
    position: 'Inside',
    name: 'text',
    font: {
      fontWeight: '600',
      color: '#ffffff'
    }
  };

  // Legend settings
  const legendSettings = {
    visible: true,
    position: 'Right',
    height: '70%',
    width: '30%'
  };

  const palette = ['#5E81F4', '#8676FF', '#FF9066', '#F7B84B', '#13D8AA'];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Job Openings by Category</h3>
        <Link
          to={`${adminRoute}/admin/dashboard/jobs`}
          className="text-primary-100 text-sm hover:underline flex items-center"
        >
          Manage Jobs
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      {loading ? (
        <div className="animate-pulse flex flex-col space-y-3">
          <div className="bg-gray-200 h-60 w-full rounded"></div>
        </div>
      ) : error ? (
        <div className="h-60 flex items-center justify-center text-red-500 bg-red-50 rounded-lg">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="mb-3 text-center">
            <span className="text-sm text-gray-500">Total Jobs: {totalJobs}</span>
          </div>
          <AccumulationChartComponent 
            id="job-categories-chart"
            legendSettings={legendSettings}
            tooltip={tooltip}
            height="300px"
            palettes={palette}
            enableSmartLabels={true}
            enableAnimation={true}
          >
            <Inject services={[PieSeries, AccumulationLegend, AccumulationTooltip, AccumulationDataLabel]} />
            <AccumulationSeriesCollectionDirective>
              <AccumulationSeriesDirective 
                dataSource={jobData} 
                xName='category' 
                yName='count' 
                radius='80%'
                dataLabel={dataLabel}
                explode={true}
                explodeOffset="10%"
                explodeIndex={0}
              />
            </AccumulationSeriesCollectionDirective>
          </AccumulationChartComponent>
        </>
      )}

      {/* Job Details Table */}
      {jobs.length > 0 && (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full text-sm text-left border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Company</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Location</th>
                <th className="px-3 py-2">Deadline</th>
                <th className="px-3 py-2">Posted</th>
                <th className="px-3 py-2">Logo</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job._id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium">{job.jobTitle}</td>
                  <td className="px-3 py-2">{job.companyName}</td>
                  <td className="px-3 py-2">{job.jobType}</td>
                  <td className="px-3 py-2">{job.location}</td>
                  <td className="px-3 py-2">{job.deadline ? new Date(job.deadline).toLocaleDateString() : '-'}</td>
                  <td className="px-3 py-2">{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '-'}</td>
                  <td className="px-3 py-2">
                    {job.logo ? (
                      <img src={job.logo} alt="logo" className="w-16 h-10 object-contain rounded" />
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default JobOpeningsChart;