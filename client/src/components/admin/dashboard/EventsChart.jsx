import React, { useState, useEffect } from 'react';
import { 
  ChartComponent, 
  SeriesCollectionDirective, 
  SeriesDirective,
  Inject,
  ColumnSeries,
  Category,
  DataLabel,
  Tooltip,
  Legend
} from '@syncfusion/ej2-react-charts';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Toast } from '../../../utils';

const EventsChart = () => {
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalEvents, setTotalEvents] = useState(0);
  const [allEvents, setAllEvents] = useState([]); // Store all event details
  const adminRoute = import.meta.env.VITE_ADMIN_ROUTE;

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("authToken");
        
        // Fetch events data from API
        const res = await axios.get(
          `${import.meta.env.VITE_ADMIN_API_URL}/admin/events`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        if (res.data && res.data.events) {
          const events = res.data.events;
          setAllEvents(events); // Save all events for details table
          setTotalEvents(events.length);
          
          // Process event data by month and category
          const monthsMap = {};
          const now = new Date();
          const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
          
          // Initialize with last 6 months
          for (let i = 0; i < 6; i++) {
            const monthDate = new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + i, 1);
            const monthKey = monthDate.toLocaleString('default', { month: 'long' });
            monthsMap[monthKey] = { month: monthKey, workshops: 0, seminars: 0, reunions: 0, other: 0 };
          }
          
          // Populate with actual events
          events.forEach(event => {
            const eventDate = new Date(event.date);
            // Only include events from the last 6 months
            if (eventDate >= sixMonthsAgo) {
              const monthKey = eventDate.toLocaleString('default', { month: 'long' });
              if (monthsMap[monthKey]) {
                // Categorize by event type
                const type = (event.eventType || '').toLowerCase();
                if (type.includes('workshop')) {
                  monthsMap[monthKey].workshops += 1;
                } else if (type.includes('seminar')) {
                  monthsMap[monthKey].seminars += 1;
                } else if (type.includes('reunion')) {
                  monthsMap[monthKey].reunions += 1;
                } else {
                  monthsMap[monthKey].other += 1;
                }
              }
            }
          });
          
          // Convert to array for chart
          const chartData = Object.values(monthsMap);
          setEventsData(chartData);
        } else {
          // Use empty data with month labels if no events found
          const emptyData = getEmptyMonthsData();
          setEventsData(emptyData);
        }
      } catch (error) {
        console.error("Error fetching events data:", error);
        setError("Failed to load events data");
        Toast.error("Failed to load events data");
        
        // Use empty data with month labels
        const emptyData = getEmptyMonthsData();
        setEventsData(emptyData);
      } finally {
        setLoading(false);
      }
    };

    fetchEventsData();
  }, []);

  // Helper function to get empty data with month labels
  const getEmptyMonthsData = () => {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const emptyData = [];
    
    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + i, 1);
      const monthKey = monthDate.toLocaleString('default', { month: 'long' });
      emptyData.push({ month: monthKey, workshops: 0, seminars: 0, reunions: 0, other: 0 });
    }
    
    return emptyData;
  };

  const primaryxAxis = {
    valueType: 'Category',
    interval: 1,
    majorGridLines: { width: 0 }
  };

  const primaryyAxis = {
    minimum: 0,
    interval: 2,
    majorGridLines: { width: 1 },
    majorTickLines: { width: 0 },
    lineStyle: { width: 0 },
    labelFormat: '{value}'
  };

  const tooltipSettings = {
    enable: true,
    shared: true
  };

  const legendSettings = {
    visible: true,
    position: 'Top',
    padding: 10
  };

  const palette = ['#0096FF', '#FF7F50', '#77DD77', '#B19CD9'];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Events by Month</h3>
        <Link
          to={`${adminRoute}/admin/dashboard/events`}
          className="text-primary-100 text-sm hover:underline flex items-center"
        >
          Manage Events
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
          <div className="mb-2 text-center">
            <span className="text-sm text-gray-500">Total Events: {totalEvents}</span>
          </div>
          <ChartComponent 
            id="events-chart"
            primaryXAxis={primaryxAxis}
            primaryYAxis={primaryyAxis}
            tooltip={tooltipSettings}
            legendSettings={legendSettings}
            height="300px"
            palettes={palette}
          >
            <Inject services={[ColumnSeries, Tooltip, DataLabel, Category, Legend]} />
            <SeriesCollectionDirective>
              <SeriesDirective 
                dataSource={eventsData} 
                xName='month' 
                yName='workshops' 
                name='Workshops' 
                type='Column'
                cornerRadius={{
                  topLeft: 5,
                  topRight: 5
                }}
              />
              <SeriesDirective 
                dataSource={eventsData} 
                xName='month' 
                yName='seminars' 
                name='Seminars' 
                type='Column'
                cornerRadius={{
                  topLeft: 5,
                  topRight: 5
                }}
              />
              <SeriesDirective 
                dataSource={eventsData} 
                xName='month' 
                yName='reunions' 
                name='Reunions' 
                type='Column'
                cornerRadius={{
                  topLeft: 5,
                  topRight: 5
                }}
              />
              <SeriesDirective 
                dataSource={eventsData} 
                xName='month' 
                yName='other' 
                name='Other' 
                type='Column'
                cornerRadius={{
                  topLeft: 5,
                  topRight: 5
                }}
              />
            </SeriesCollectionDirective>
          </ChartComponent>
        </>
      )}

      {/* Event Details Table */}
      {allEvents.length > 0 && (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full text-sm text-left border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Location</th>
                <th className="px-3 py-2">Summary</th>
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2">Media</th>
              </tr>
            </thead>
            <tbody>
              {allEvents.map(event => (
                <tr key={event._id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium">{event.eventName}</td>
                  <td className="px-3 py-2">{event.eventDate ? new Date(event.eventDate).toLocaleDateString() : '-'}</td>
                  <td className="px-3 py-2">{event.eventLocation}</td>
                  <td className="px-3 py-2">{event.eventSummary}</td>
                  <td className="px-3 py-2 max-w-xs truncate" title={event.eventDescription}>{event.eventDescription}</td>
                  <td className="px-3 py-2">
                    {event.mediaUrl ? (
                      event.mediaResourceType === 'video' ? (
                        <video src={event.mediaUrl} controls className="w-20 h-12 object-cover rounded" />
                      ) : (
                        <img src={event.mediaUrl} alt="event media" className="w-20 h-12 object-cover rounded" />
                      )
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

export default EventsChart;