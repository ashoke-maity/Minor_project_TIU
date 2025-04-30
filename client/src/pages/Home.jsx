import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import HeroSection from "../components/home/HeroSection"
import FeaturesSection from "../components/home/FeaturesSection"
import SuccessStoriesSection from "../components/home/SuccessStoriesSection"
import EventsSection from "../components/home/EventsSection"
import StatsSection from "../components/home/StatsSection"
import NewsletterSection from "../components/home/NewsletterSection"

function Home() {
  return (
    <div className="flex min-h-screen flex-col dark">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <SuccessStoriesSection />
        <EventsSection />
        <StatsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  )
}

export default Home
