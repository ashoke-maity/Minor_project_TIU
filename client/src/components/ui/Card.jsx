function Card({ children, className = "", ...props }) {
    return (
      <div className={`rounded-lg border hover:border-primary-200  bg-card text-card-foreground shadow-lg  hover:shadow-primary-200 ${className}`} {...props}>
        {children}
      </div>
    )
  }
  
  export default Card
  