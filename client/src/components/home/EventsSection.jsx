import EventCard from "./EventCard"
import Button from "../ui/Button"

function EventsSection() {
  const events = [
    {
      title: "Annual Alumni Reunion",
      date: "June 15, 2025",
      location: "University Campus",
      description: "Reconnect with classmates and faculty at our biggest event of the year.",
    },
    {
      title: "Career Development Workshop",
      date: "July 8, 2025",
      location: "Virtual",
      description: "Learn strategies for career advancement from industry experts.",
    },
    {
      title: "Networking Mixer",
      date: "August 22, 2025",
      location: "Downtown Convention Center",
      description: "Expand your professional network with alumni from various industries.",
    },
  ]

  return (
    <section id="events" className="py-16 flex flex-col items-center w-full h-full text-primary-foreground bg-primary-foreground min-h-screen">
      <div className="flex flex-col items-center text-center mb-12 px-4 md:px-12 lg:px-24">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary-100">Upcoming Events</h2>
        <p className="mt-4 text-lg max-w-3xl text-muted-foreground">
          Join us for these exciting opportunities to connect, learn, and grow with fellow alumni.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <EventCard
            key={index}
            title={event.title}
            date={event.date}
            location={event.location}
            description={event.description}
          />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Button variant="outline">View All Events</Button>
      </div>
    </section>
  )
}

export default EventsSection
