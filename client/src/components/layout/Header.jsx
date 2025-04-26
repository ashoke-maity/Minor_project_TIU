"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import Button from "../ui/Button"

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-black/30 backdrop-blur-md bg-gradient-to-l from-[#d59b4b]/40 to-[#8fbccd]/40 md:px-4">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/academia-1293362.svg" alt="Alumni Connect Logo" className="h-20 w-20 " ></img>
          <span className="text-xl font-bold">Alumni Connect</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Link to="/" className="text-sm font-medium hover:underline underline-offset-4">
            Home
          </Link>
          <Link to="/directory" className="text-sm font-medium hover:underline underline-offset-4">
            Directory
          </Link>
          <Link to="/events" className="text-sm font-medium hover:underline underline-offset-4">
            Events
          </Link>
          <Link to="/jobs" className="text-sm font-medium hover:underline underline-offset-4">
            Jobs
          </Link>
          <Link to="/donate" className="text-sm font-medium hover:underline underline-offset-4">
            Donate
          </Link>
          <Link to="/success-stories" className="text-sm font-medium hover:underline underline-offset-4">
            Success Stories
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
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

        <div className="hidden md:flex items-center gap-2">
          <Button size="sm">
            Log In
          </Button>
          <Button size="sm">Register</Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 px-4 bg-background border-b">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="text-sm font-medium">
              Home
            </Link>
            <Link to="/directory" className="text-sm font-medium">
              Directory
            </Link>
            <Link to="/events" className="text-sm font-medium">
              Events
            </Link>
            <Link to="/jobs" className="text-sm font-medium">
              Jobs
            </Link>
            <Link to="/donate" className="text-sm font-medium">
              Donate
            </Link>
            <Link to="/success-stories" className="text-sm font-medium">
              Success Stories
            </Link>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" fullWidth>
                Log In
              </Button>
              <Button size="sm" fullWidth>
                Register
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
