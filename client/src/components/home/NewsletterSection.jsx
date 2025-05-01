import Button from "../ui/Button"

function NewsletterSection() {
  return (
    <section id="newsletter" className="py-16 px-4 md:px-12 lg:px-24 flex flex-col text-primary-100 items-center w-full h-full bg-primary-foreground">
      <div className="max-w-md mx-auto text-center">
        <h1 className="md:text-7xl  text-4xl font-bold tracking-tight  mb-4 animate-colorShift">Stay Updated</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Subscribe to our newsletter to receive the latest updates on events, opportunities, and alumni achievements.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button>Subscribe</Button>
        </div>
      </div>
    </section>
  )
}

export default NewsletterSection
