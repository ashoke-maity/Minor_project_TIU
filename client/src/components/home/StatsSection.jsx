import Button from "../ui/Button"

function StatsSection() {
  return (
    <section className="bg-primary text-primary-foreground py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Join Our Growing Community</h2>
            <p className="text-lg mb-6">
              Be part of a thriving network of professionals who share your educational background and values.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <p className="text-4xl font-bold">10,000+</p>
                <p className="text-sm">Registered Alumni</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold">50+</p>
                <p className="text-sm">Countries Represented</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold">$2M+</p>
                <p className="text-sm">Donations Raised</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold">200+</p>
                <p className="text-sm">Annual Events</p>
              </div>
            </div>
            <Button variant="secondary" size="lg">
              Register Now
            </Button>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <div
              className="aspect-video bg-cover bg-center"
              style={{ backgroundImage: "url('/placeholder.svg?height=400&width=600')" }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default StatsSection
