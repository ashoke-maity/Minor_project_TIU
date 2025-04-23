function Button({ children, variant = "default", size = "default", className = "", fullWidth = false, ...props }) {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
  
    const variantStyles = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      outline: "border border-input hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "underline-offset-4 hover:underline text-primary",
    }
  
    const sizeStyles = {
      default: "h-10 py-2 px-4",
      sm: "h-9 px-3 rounded-md text-sm",
      lg: "h-11 px-8 rounded-md text-lg",
    }
  
    const widthStyle = fullWidth ? "w-full" : ""
  
    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`
  
    return (
      <button className={combinedClassName} {...props}>
        {children}
      </button>
    )
  }
  
  export default Button
  