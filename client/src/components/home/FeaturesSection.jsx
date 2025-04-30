import FeatureCard from "./FeatureCard"

function FeaturesSection() {
  const features = [
    {
      icon: "users",
      title: "Networking Hub",
      description: "Connect with fellow alumni based on shared interests, professions, and locations.",
      action: "Start Networking",
    },
    {
      icon: "book-open",
      title: "Job Portal",
      description: "Explore career opportunities and post job openings within our alumni network.",
      action: "Browse Opportunities",
    },
    {
      icon: "heart",
      title: "Donation Portal",
      description: "Support various initiatives and projects undertaken by the university.",
      action: "Make a Difference",
    },
    {
      icon: "globe",
      title: "Alumni Directory",
      description: "Find and connect with alumni based on graduation year, field of study, and more.",
      action: "Search Directory",
    },
    {
      icon: "award",
      title: "Success Stories",
      description: "Discover and share alumni achievements and notable contributions to society.",
      action: "Read Stories",
    },
    {
      icon: "calendar",
      title: "Events & Reunions",
      description: "Stay updated on alumni events, reunions, workshops, and development sessions.",
      action: "View Calendar",
    },
  ]

  return (
    <section id="discover" className="px-4 md:px-12 lg:px-24 py-16 flex flex-col items-center w-full text-primary-foreground bg-primary-foreground">
      <div className="flex flex-col items-center text-center mb-12 text-primary-200">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Discover What We Offer</h2>
        <p className="mt-4 text-lg  max-w-3xl text-primary-100">
          Our platform provides valuable resources and opportunities for alumni to stay connected, grow professionally,
          and give back.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 w-fit text-user-primary ml-1">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            action={feature.action}
          />
        ))}
      </div>
    </section>
  )
}

export default FeaturesSection
