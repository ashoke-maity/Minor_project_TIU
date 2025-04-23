import Button from "../ui/Button"

function HeroSection() {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 z-10" />
      <div
        className="h-[600px] bg-cover bg-center"
        style={{ backgroundImage: "url('/placeholder.svg?height=600&width=1200')" }}
      />
      <div className="absolute inset-0 flex items-center z-20">
        <div className="container">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Connect with your Alumni Community
            </h1>
            <p className="text-lg text-muted-foreground">
              Join thousands of graduates in our vibrant network. Reconnect with classmates, advance your career, and
              give back to your alma mater.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg">Join the Network</Button>
              <Button variant="outline" size="lg">
                Explore Benefits
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2 h-4 w-4"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
