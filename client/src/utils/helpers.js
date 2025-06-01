// Helper functions for the application

/**
 * Conditionally join class names
 * @param  {...string} classes CSS class names to conditionally join
 * @returns {string} Joined class names
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format a date to a readable format
 * @param {string|Date} date Date to format
 * @param {Object} options Format options
 * @returns {string} Formatted date
 */
export function formatDate(date, options = {}) {
  const { format = 'medium' } = options;
  
  if (!date) return '—';
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return 'Invalid date';
  
  switch (format) {
    case 'short':
      return d.toLocaleDateString();
    case 'medium':
      return d.toLocaleDateString(undefined, { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    case 'long':
      return d.toLocaleDateString(undefined, { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    case 'full':
      return d.toLocaleDateString(undefined, { 
        weekday: 'long',
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    default:
      return d.toLocaleDateString();
  }
}

/**
 * Truncate a string to a specified length
 * @param {string} str String to truncate
 * @param {number} length Maximum length
 * @returns {string} Truncated string
 */
export function truncateText(str, length = 100) {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

/**
 * Generate a random ID
 * @returns {string} Random ID
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 9);
} 

// updating the getTokenData function to decode JWT token and return user data
export const getTokenData = () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    // Get payload part of token (second part between dots)
    const payload = token.split('.')[1];
    // Decode base64
    const decoded = JSON.parse(atob(payload));
    
    return {
      id: decoded.id,
      email: decoded.email,
      firstName: decoded.FirstName,
      lastName: decoded.LastName
    };
  } catch (error) {
    return null;
  }
};