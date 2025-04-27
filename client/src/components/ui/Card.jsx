function Card({ children, className = "", ...props }) {
    return (
      <div className={`rounded-lg border hover:bg-gradient-to-r  from-[#d4c49f] to-[#dfc5a1]  bg-card text-card-foreground shadow-sm ${className}`} {...props}>
        {children}
      </div>
    )
  }
  
  export default Card
  