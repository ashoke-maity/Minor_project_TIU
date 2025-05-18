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
        
        // Simulate API call for now - would be replaced with real endpoint
        // const res = await axios.get(`${import.meta.env.VITE_ADMIN_API_URL}/admin/user-activity`, {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        
        // Mock data
        const mockData = [
          { month: new Date(2023, 0, 1), registrations: 12, logins: 45 },
          { month: new Date(2023, 1, 1), registrations: 19, logins: 54 },
          { month: new Date(2023, 2, 1), registrations: 25, logins: 64 },
          { month: new Date(2023, 3, 1), registrations: 22, logins: 70 },
          { month: new Date(2023, 4, 1), registrations: 28, logins: 85 },
          { month: new Date(2023, 5, 1), registrations: 32, logins: 92 },
          { month: new Date(2023, 6, 1), registrations: 35, logins: 105 },
          { month: new Date(2023, 7, 1), registrations: 40, logins: 110 },
          { month: new Date(2023, 8, 1), registrations: 42, logins: 124 },
          { month: new Date(2023, 9, 1), registrations: 45, logins: 130 },
          { month: new Date(2023, 10, 1), registrations: 50, logins: 142 },
          { month: new Date(2023, 11, 1), registrations: 55, logins: 155 },
        ];
        
        setUserData(mockData);
      } catch (error) {
        console.error("Error fetching user activity data:", error);
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