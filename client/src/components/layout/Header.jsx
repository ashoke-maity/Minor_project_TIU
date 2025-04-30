"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import Button from "../ui/Button"

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLinkClick = (sectionId) => {
    setMobileMenuOpen(false); // Close the mobile menu
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to the section
    }
  } // <-- This closes the handleLinkClick function properly

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md dark bg-primary-foreground border text-primary-200 md:px-4">
      <div className="container flex h-16 items-center justify-between ">
        <div className="flex items-center gap-2 ">
          <a href="#home">
            <img src="/academia-1293362.svg" alt="Alumni Connect Logo" className="h-20 w-20 invert cursor-pointer" />
          </a>
          <span className="text-xl font-bold"><a href="#home">AlumniConnect</a></span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 ">
          <a href="#home" className="text-sm font-medium hover:underline underline-offset-4">Home</a>
          <a href="#discover" className="text-sm font-medium hover:underline underline-offset-4">Discover</a>
          <a href="#success-stories" className="text-sm font-medium hover:underline underline-offset-4">Success Stories</a>
          <a href="#events" className="text-sm font-medium hover:underline underline-offset-4">Events</a>
          <a href="#community" className="text-sm font-medium hover:underline underline-offset-4">Community</a>
          <a href="#newsletter" className="text-sm font-medium hover:underline underline-offset-4">Newsletter</a>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 cursor-pointer  hover:shadow-primary-200 hover:shadow-lg" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
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
          >
            {mobileMenuOpen ? <path d="M18 6 6 18M6 6l12 12"></path> : <path d="M4 12h16M4 6h16M4 18h16"></path>}
          </svg>
        </button>

        {/* User Profile or dashboard avatar*/}
        <div className="hidden md:flex items-center gap-2">
          <Button size="sm">
            Sign In
          </Button>
          <Button size="sm">Sign Up</Button>
        </div>
      </div>
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 px-4 bg-background border-b">
          <nav className="flex flex-col space-y-4">
            <a href="#home" className="text-sm font-medium" onClick={() => handleLinkClick("home")} >Home</a>
            <a href="#directory" className="text-sm font-medium" onClick={() => handleLinkClick("directory")}>Discover</a>
            <a href="#success-stories" className="text-sm font-medium" onClick={() => handleLinkClick("success-stories")}>Success Stories</a>
            <a href="#events" className="text-sm font-medium" onClick={() => handleLinkClick("events")}>Events</a>
            <a href="#community" className="text-sm font-medium" onClick={() => handleLinkClick("jobs")}>Community</a>
            <a href="#newsletter" className="text-sm font-medium"  onClick={() => handleLinkClick("donate")}>Newsletter</a>
            
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" fullWidth>Sign In</Button>
              <Button size="sm" fullWidth>Sign Up</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header