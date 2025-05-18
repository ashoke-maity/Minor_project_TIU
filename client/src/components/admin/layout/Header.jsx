import { cn } from "../../../utils/helpers";

/**
 * A reusable header component for admin panels with title, description, and optional actions
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - The main title for the header
 * @param {string} [props.description] - Optional description text
 * @param {React.ReactNode} [props.actions] - Optional action elements like buttons
 * @param {string} [props.className] - Additional CSS classes
 */
const Header = ({ 
  title, 
  description, 
  actions,
  className
}) => {
  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-center sm:justify-between",
      "w-full gap-4 mb-6",
      className
    )}>
      <div className="flex-1">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">{title}</h1>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      
      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default Header; 