import Card from "../ui/Card"
import Button from "../ui/Button"

function EventCard({ title, date, location, description }) {
  return (
    <Card>
      <div className="p-6 ">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {date} | {location}
        </p>
        <div className="mt-4 space-y-4">
          <p className="text-sm text-muted-foreground">{description}</p>
          <Button variant="secondary">Register Now</Button>
        </div>
      </div>
    </Card>
  )
}

export default EventCard
