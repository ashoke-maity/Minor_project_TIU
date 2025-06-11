import React, { useState, useEffect } from 'react';
import { 
  ChartComponent, 
  SeriesCollectionDirective, 
  SeriesDirective,
  Inject,
  DateTime,
  Legend,
  Tooltip,
  LineSeries
} from '@syncfusion/ej2-react-charts';
import axios from 'axios';

const UserActivityChart = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserActivity = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const res = await axios.get('/api/admin-stat/user-activity', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Group activities by month and count registrations and logins
        const activities = res.data.userActivities || [];
        // Assume activities have a createdAt and type (e.g., 'registration', 'login')
        const monthlyStats = {};
        activities.forEach(act => {
          const date = new Date(act.createdAt);
          const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
          if (!monthlyStats[monthKey]) {
            monthlyStats[monthKey] = {
              month: new Date(date.getFullYear(), date.getMonth(), 1),
              registrations: 0,
              logins: 0
            };
          }
          if (act.type === 'registration') monthlyStats[monthKey].registrations++;
          if (act.type === 'login') monthlyStats[monthKey].logins++;
        });
        // Convert to array and sort by month
        const chartData = Object.values(monthlyStats).sort((a, b) => a.month - b.month);
        setUserData(chartData);
      } catch (error) {
        console.error("Error fetching user activity data:", error);
        setUserData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserActivity();
  }, []);

  const primaryxAxis = {
    valueType: 'DateTime',
    labelFormat: 'MMM',
    intervalType: 'Months',
    edgeLabelPlacement: 'Shift',
    majorGridLines: { width: 0 }
  };

  const primaryyAxis = {
    minimum: 0,
    maximum: 160,
    interval: 40,
    lineStyle: { width: 0 },
    majorTickLines: { width: 0 },
    labelFormat: '{value}'
  };

  const chartArea = { border: { width: 0 } };

  const tooltip = { enable: true, shared: true };

  const legendSettings = {
    visible: true,
    position: 'Top',
    padding: 10
  };

  const palette = ['#4472C4', '#ED7D31'];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-semibold mb-4">User Activity</h3>
      
      {loading ? (
        <div className="animate-pulse flex flex-col space-y-3">
          <div className="bg-gray-200 h-40 w-full rounded"></div>
        </div>
      ) : (
        <ChartComponent 
          id="user-activity-chart"
          primaryXAxis={primaryxAxis}
          primaryYAxis={primaryyAxis}
          chartArea={chartArea}
          tooltip={tooltip}
          legendSettings={legendSettings}
          height="350px"
          palettes={palette}
        >
          <Inject services={[LineSeries, DateTime, Legend, Tooltip]} />
          <SeriesCollectionDirective>
            <SeriesDirective 
              dataSource={userData} 
              xName='month' 
              yName='registrations' 
              name='New Registrations' 
              type='Line'
              width={3}
              marker={{ visible: true, width: 7, height: 7, shape: 'Circle' }}
            />
            <SeriesDirective 
              dataSource={userData} 
              xName='month' 
              yName='logins' 
              name='User Logins' 
              type='Line'
              width={3}
              marker={{ visible: true, width: 7, height: 7, shape: 'Diamond' }}
            />
          </SeriesCollectionDirective>
        </ChartComponent>
      )}
    </div>
  );
};

export default UserActivityChart;