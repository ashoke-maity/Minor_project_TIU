"use client"

import { useState } from "react"
import StoryCard from "./StoryCard"
import Tabs from "../ui/Tabs"
import Button from "../ui/Button"

function SuccessStoriesSection() {
  const [activeTab, setActiveTab] = useState("featured")

  const featuredStories = [
    {
      image: "/placeholder.svg?height=200&width=400",
      name: "Dr. Sarah Johnson",
      class: "Class of 2010 | Medical Research",
      description:
        "Pioneering breakthrough research in cancer treatment, Dr. Johnson's work has been recognized internationally.",
    },
    {
      image: "/placeholder.svg?height=200&width=400",
      name: "James Wilson",
      class: "Class of 2008 | Technology",
      description:
        "Founded a successful tech startup that has revolutionized the way we approach sustainable energy solutions.",
    },
    {
      image: "/placeholder.svg?height=200&width=400",
      name: "Maria Rodriguez",
      class: "Class of 2015 | Education",
      description: "Developed innovative teaching methodologies that have been adopted by schools across the country.",
    },
  ]

  const recentStories = [
    {
      image: "/placeholder.svg?height=200&width=400",
      name: "Michael Chen",
      class: "Class of 2018 | Tech Entrepreneur",
      description:
        "Founded a successful startup that's revolutionizing renewable energy solutions in developing countries.",
    },
    {
      image: "/placeholder.svg?height=200&width=400",
      name: "Jennifer Lee",
      class: "Class of 2019 | Healthcare",
      description: "Leading a team developing new medical devices that improve patient outcomes in rural areas.",
    },
    {
      image: "/placeholder.svg?height=200&width=400",
      name: "David Patel",
      class: "Class of 2020 | Finance",
      description:
        "Created a financial literacy program that has helped hundreds of students manage their finances better.",
    },
  ]

  const popularStories = [
    {
      image: "/placeholder.svg?height=200&width=400",
      name: "Priya Patel",
      class: "Class of 2005 | Social Impact",
      description:
        "Leading a non-profit organization that has provided education to over 10,000 underprivileged children.",
    },
    {
      image: "/placeholder.svg?height=200&width=400",
      name: "Robert Johnson",
      class: "Class of 2007 | Engineering",
      description: "Developed sustainable infrastructure solutions that have been implemented in over 20 countries.",
    },
    {
      image: "/placeholder.svg?height=200&width=400",
      name: "Lisa Wong",
      class: "Class of 2010 | Arts",
      description: "Award-winning filmmaker whose documentaries have raised awareness about important social issues.",
    },
  ]

  const renderStories = () => {
    let stories
    switch (activeTab) {
      case "featured":
        stories = featuredStories
        break
      case "recent":
        stories = recentStories
        break
      case "popular":
        stories = popularStories
        break
      default:
        stories = featuredStories
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story, index) => (
          <StoryCard
            key={index}
            image={story.image}
            name={story.name}
            classInfo={story.class}
            description={story.description}
          />
        ))}
      </div>
    )
  }

  return (
    <section id="success-stories" className="py-16 w-full h-full  text-primary-foreground bg-primary-foreground flex flex-col items-center justify-center min-h-screen">
      <div className="container px-4 md:px-12 lg:px-24 py-16 flex flex-col items-center w-full">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary-100">Success Stories</h2>
          <p className="mt-4 text-lg max-w-3xl text-muted-foreground">
            Our alumni are making remarkable contributions across various fields. Get inspired by their journeys.
          </p>
        </div>

        <Tabs
          tabs={[
            { id: "featured", label: "Featured" },
            { id: "recent", label: "Recent" },
            { id: "popular", label: "Popular" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="mt-4 space-y-4 gap-6">
          {renderStories()}

          <div className="flex justify-center mt-4">
            <Button variant="outline">View All Success Stories</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SuccessStoriesSection
