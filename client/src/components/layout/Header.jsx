import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_USER_API_URL}/user/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        const { Email, FirstName, LastName } = response.data.user;
        setEmail(Email);
        setFirstName(FirstName);
        setLastName(LastName);
      } catch (err) {
        console.log("Failed to fetch user info", err);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // clears everything including token
    navigate("/");
  };

  const handleLinkClick = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false); // Close menu after link click
  };

  const initials = `${firstName?.[0] ?? ""}${
    lastName?.[0] ?? ""
  }`.toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full h-full bg-black text-white shadow-md">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between bg-black px-4">
        <a href="#home" className="flex items-center gap-3">
          <img
            src="/icons/logo3.png"
            alt="Logo"
            className="h-16 w-16 rounded-full"
          />
          <span className="text-xl font-semibold text-white">
            Alumni Connect
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium relative cursor-pointer">
          {firstName && lastName && (
            <div className="flex items-center gap-4">
              {/* Name + Initials Dropdown */}
              <div className="relative dropdown-area">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none hover:text-neutral-400"
                >
                  <div className="flex flex-col items-start leading-tight">
                    <span className="font-medium">{`${firstName} ${lastName}`}</span>
                    <span className="text-xs text-neutral-400">{email}</span>
                  </div>
                  {/* Dropdown Arrow */}
                  <svg
                    className={`w-4 h-4 cursor-pointer transition-transform ${
                      dropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-700 text-white text-xs font-bold">
                    {initials}
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute mt-2 w-44 bg-white text-black rounded shadow-md z-50">
                    <Link
                      to="/usersetting"
                      className="flex justify-center items-center gap-2 py-3 text-sm hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <Link
                      to="/privacypolicy"
                      className="flex justify-center items-center gap-2 py-3 text-sm hover:bg-gray-100"
                    >
                      Privacy Policy
                    </Link>
                  </div>
                )}
              </div>

              {/* Separator */}
              <div className="border-l h-6 border-gray-400"></div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 hover:text-neutral-400 transition group cursor-pointer"
              >
                <span className="group-hover:text-neutral-400">Logout</span>
                <div className="w-5 h-5 flex items-center justify-center">
                  <img
                    src="/icons/logout.svg"
                    alt="Logout"
                    className="w-5 h-5 object-contain"
                  />
                </div>
              </button>
            </div>
          )}
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
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-4 bg-black border-t border-neutral-800 text-white">
          {firstName && lastName && (
            <div className="flex flex-col gap-3">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-700 text-white text-xs font-bold">
                  {initials}
                </div>
                <div className="flex flex-col text-sm">
                  <span>{`${firstName} ${lastName}`}</span>
                  <span className="text-xs text-neutral-400">{email}</span>
                </div>
              </div>

              {/* Settings */}
              <Link
                to="/usersetting"
                className="flex items-center gap-2 text-sm hover:text-neutral-400 transition"
              >
                <img
                  src="/icons/users.svg"
                  alt="Settings"
                  className="w-5 h-5"
                />
                <span>Settings</span>
              </Link>
              <Link
                to="/privacypolicy"
                className="flex justify-center items-center gap-2 py-3 text-sm hover:bg-gray-100"
              >
                Privacy Policy
              </Link>
              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm hover:text-neutral-400 transition"
              >
                <span>Logout</span>
                <img src="/icons/logout.svg" alt="Logout" className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
