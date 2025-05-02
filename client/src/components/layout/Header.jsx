import * as jwt_decode from "jwt-decode";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

function Header() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return;
      }
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/user/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(token); // debug statement
        if (res.data?.status === 1) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user dashboard:", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => navigate("/");
  const handleLinkClick = (sectionId) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 w-full h-full bg-black text-white shadow-md rounded-b-xl">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between bg-black px-4">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3">
          <img
            src="/icons/logo3.png"
            alt="Logo"
            className="h-16 w-16 rounded-full"
          />
          <span className="text-lg font-medium tracking-tight hover:text-neutral-400 transition">
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
          <div className=" md:flex gap-2 relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-center p-1 rounded-full hover:opacity-80 transition cursor-pointer"
              title="User Menu"
            >
              <img
                src="/icons/student.png"
                alt="User Avatar"
                className="size-6 invert rounded-xl "
              />
            </button>
            <button
                onClick={handleLogout}
                className="cursor-pointer"
            >
              <img src="/icons/logout.svg" alt="logout" className="size-6 invert hover:opacity-80 transition" />

            </button>

            {dropdownOpen && (
              <div className="absolute top-2 right-[-4rem] mt-10 w-40 rounded-xl shadow-lg bg-black border border-neutral-700 z-50 overflow-hidden">
                <ul className="text-sm list-none text-white divide-y divide-neutral-700">
                  <li>
                    <a
                      href="/dashboard"
                      className="block  text-center text-white shadow-md px-4 py-2 hover:bg-neutral-700 transition-colors"
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-center text-white shadow-md px-4 py-2 hover:bg-neutral-700 transition-colors"
                    >
                      <div className="flex justify-center items-center gap-2">
                        <div>Logout</div>
                        <div>
                          <img
                            src="/logout.svg"
                            alt="logout"
                            className="size-6 invert hover:opacity-80 transition"
                          />
                        </div>
                      </div>
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
              <button onClick={handleLogout} className="cursor-pointer">
                <img src="/logout.svg" alt="logout" className="size-6 invert" />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
