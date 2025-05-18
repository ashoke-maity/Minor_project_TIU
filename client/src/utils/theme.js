/**
 * Theme utilities for consistent styling across the application
 */

// Element specific styles
export const inputStyles = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100";

export const cardStyles = {
  base: "bg-white shadow-sm rounded-lg",
  padding: {
    sm: "p-3",
    md: "p-4 sm:p-6",
    lg: "p-6 sm:p-8"
  }
};

// Grid layouts for responsive design
export const gridLayouts = {
  oneColumn: "grid grid-cols-1 gap-4",
  twoColumns: "grid grid-cols-1 md:grid-cols-2 gap-4",
  threeColumns: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
  fourColumns: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
};

// Typography styles
export const typography = {
  title: "text-xl sm:text-2xl font-bold text-gray-800",
  subtitle: "text-lg sm:text-xl font-semibold text-gray-700",
  body: "text-sm text-gray-600",
  small: "text-xs text-gray-500",
  label: "block mb-1 text-gray-700 font-medium"
};

// Common spacing
export const spacing = {
  sectionGap: "space-y-6",
  itemGap: "space-y-4",
  containerPadding: "p-4 sm:p-6 lg:p-8"
};

// Animation durations
export const animation = {
  fast: "duration-200",
  medium: "duration-300",
  slow: "duration-500"
};

// Custom breakpoints helper
export const mediaQuery = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)"
};

// Helper to determine mobile state
export const isMobile = () => window.innerWidth < 1024;

// Common transitions
export const transitions = {
  hover: "transition-all hover:scale-105",
  fade: "transition-opacity",
  scale: "transition-transform"
};

export default {
  cardStyles,
  gridLayouts,
  typography,
  spacing,
  animation,
  mediaQuery,
  isMobile,
  transitions,
  inputStyles
}; 