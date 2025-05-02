function Button({ children, variant = "default", size = "default", className = "", fullWidth = false, ...props }) {
    const baseStyles =
      "inline-flex items-center justify-center rounded-3xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background cursor-pointer"
  
    const variantStyles = {
      default: "w-full !bg-primary-100 !text-dark-100 !shadow-md hover:!bg-primary-100/80 !rounded-md !min-h-10 !font-medium !px-5 cursor-pointer",
      outline: "border border-primary hover:bg-accent hover:text-accent-foreground border-primary hover:shadow-xl hover:bg-amber-100 hover:border-amber-100     w-full !bg-primary-100 !text-dark-100 hover:!bg-primary-100/80 !rounded-md !min-h-10 !font-bold !px-5 cursor-pointer",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80    w-full !bg-primary-100 !text-dark-100 hover:!bg-primary-100/80 !rounded-md !min-h-10 !font-bold !px-5 cursor-pointer",
      ghost: "hover:bg-accent hover:text-accent-foreground    w-full !bg-primary-100 !text-dark-100 hover:!bg-primary-100/80 !rounded-md !min-h-10 !font-bold !px-5 cursor-pointer",
      link: "underline-offset-4 hover:underline text-primary    w-full !bg-primary-100 !text-dark-100 hover:!bg-primary-100/80 !rounded-md !min-h-10 !font-bold !px-5 cursor-pointer",
    }
  
    const sizeStyles = {
      default: "h-10 py-2 px-4",
      sm: "h-9 px-3 rounded-md text-sm",
      lg: "h-11 px-8 rounded-md text-lg",
    }
  
    const widthStyle = fullWidth ? "w-full" : ""
  
    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`
  
    return (
     <button className="p-[3px] relative">
  <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-primary-100/80 rounded-lg" />
  <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
    {children}
  </div>
</button>
    )
  }
  
  export default Button
  