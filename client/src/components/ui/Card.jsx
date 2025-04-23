function Card({ children, className = "", ...props }) {
    return (
      <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>
        {children}
      </div>
    )
  }
  
  export default Card
  