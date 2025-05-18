import React from 'react';

/**
 * StatsCard component for displaying a single statistic metric
 * 
 * @param {Object} props - Component properties
 * @param {string} props.title - The title of the statistic
 * @param {number|string} props.value - The value of the statistic
 * @param {string} props.icon - Path to the icon for the statistic
 * @param {boolean} [props.loading=false] - Whether the card is in loading state
 */
const StatsCard = ({ title, value, icon, loading = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm px-4 py-5 h-full flex items-center">
      <div className="mr-4 bg-blue-50 rounded-full p-3">
        <img src={icon} alt={title} className="w-6 h-6" />
      </div>
      
      <div>
        <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
        
        {loading ? (
          <div className="animate-pulse mt-1 bg-gray-200 h-6 w-16 rounded"></div>
        ) : (
          <p className="text-xl font-bold text-gray-800 mt-1">{value.toLocaleString()}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard; 