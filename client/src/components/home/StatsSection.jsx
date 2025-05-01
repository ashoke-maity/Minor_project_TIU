import Button from "../ui/Button"

function StatsSection() {
  return (
    <section id="community" className="w-full flex flex-col items-center h-full text-primary-foreground py-16 bg-primary-foreground min-h-screen">
      <div className="container ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4 md:px-12 lg:px-24 py-16 flex-col w-full">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-primary-100">Join Our Growing Community</h2>
            <p className="text-lg mb-6 text-muted-foreground">
              Be part of a thriving network of professionals who share your educational background and values.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center ">
                <p className="text-4xl font-bold  text-primary-100">10,000+</p>
                <p className="text-sm text-primary-200">Registered Alumni</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary-100">50+</p>
                <p className="text-sm text-primary-200">Countries Represented</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary-100">$2M+</p>
                <p className="text-sm text-primary-200">Donations Raised</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary-100">200+</p>
                <p className="text-sm text-primary-200">Annual Events</p>
              </div>
            </div>
            <Button size="lg">
              Register Now
            </Button>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl bg-primary-foreground h-fit">
            <div
              className="aspect-video bg-cover bg-center object-fillss invert" 
              style={{ backgroundImage: "url('https://www.jaspersoft.com/content/dam/jaspersoft/images/graphics/infographics/bar-chart-example.svg')" }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default StatsSection
