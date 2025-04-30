"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

function Header() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => navigate("/");

  const handleLinkClick = (sectionId) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-black text-white shadow-md">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3">
          <img
            src="/logo.png.jpg"
            alt="Logo"
            className="h-8 w-8 rounded-full"
          />
          <span className="text-lg font-medium tracking-tight">
            AlumniConnect
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {[
            "discover",
            "success-stories",
            "events",
            "community",
            "newsletter",
          ].map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className="capitalize hover:text-neutral-400 transition"
            >
              {item.replace("-", " ")}
            </a>
          ))}

          {/* Divider */}
          <div className="h-6 w-px bg-neutral-600 mx-3" />

          {/* Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-center p-1 rounded-full hover:opacity-80 transition"
              title="User Menu"
            >
              <img
                src="/users.svg"
                alt="User Avatar"
                className="h-8 w-8 rounded-full"
              />
            </button>
            {dropdownOpen && (
              <div className="absolute  right-0 mt-2 w-40 rounded-xl shadow-lg bg-neutral-800 border border-neutral-700 z-50 overflow-hidden">
                <ul className="text-sm list-none text-white divide-y divide-neutral-700">
                  <li>
                    <a
                      href="/dashboard"
                      className="block px-4 py-2 hover:bg-neutral-700 transition-colors"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="/settings"
                      className="block px-4 py-2 hover:bg-neutral-700 transition-colors"
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-700 transition-colors"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 hover:bg-neutral-800 rounded"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
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
            className="text-white"
          >
            {mobileMenuOpen ? (
              <path d="M18 6 6 18M6 6l12 12"></path>
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-4 bg-black border-t border-neutral-800 text-white">
          <nav className="flex flex-col gap-3 text-sm">
            {[
              "home",
              "discover",
              "success-stories",
              "events",
              "community",
              "newsletter",
            ].map((item) => (
              <a
                key={item}
                onClick={() => handleLinkClick(item)}
                className="hover:text-neutral-400 transition"
              >
                {item.replace("-", " ")}
              </a>
            ))}

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                className="rounded-md text-white border-white hover:bg-neutral-800"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                fullWidth
                className="rounded-md bg-white text-black hover:bg-neutral-200"
              >
                Sign Up
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
