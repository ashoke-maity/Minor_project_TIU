import Button from "../ui/Button"

function HeroSection() {
  return (
    <section id="home" className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 z-10" />
      <div
        className="h-[640px] bg-cover bg-center backdrop-blur-sm"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/8093046/pexels-photo-8093046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}
      />
      <div className="absolute inset-0 flex items-center z-20 flex-col  justify-center w-full h-full">
        <div className="container  text-center px-4">
          <div className="max-w-2xl space-y-4 mx-auto">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-amber-100">
              Connect with your Alumni Community
            </h1>
            <p className="text-lg text-muted-foreground text-amber-100">
              Join thousands of graduates in our vibrant network. Reconnect with classmates, advance your career, and
              give back to your alma mater.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 ">
              <Button size="lg">Join the Network</Button>
              <Button size="lg">Explore Benefits</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
