import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


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
    localStorage.removeItem("authToken");
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

          {/* User Avatar + Dropdown */}
          {firstName && lastName && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-bold transition"
              >
                {initials}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg py-2 z-50">
                  <div className="px-4 py-2 text-sm border-b border-gray-200">
                    <span>{email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <div className="logout-head flex justify-center items-center gap-2">
                      <div className="logout-text">Logout</div>
                      <div className="logout-img">
                        <img
                          src="/icons/logout.svg"
                          alt="Logo"
                          className="w-6 rounded-full"
                        />
                      </div>
                    </div>
                  </button>
                </div>
              )}
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
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-700 text-white text-xs font-bold">
                {initials}
              </div>
              <div className="text-sm">{email}</div>
            </div>
          )}
          <nav className="flex flex-col gap-3 text-sm">
            {[
              "discover",
              "success-stories",
              "events",
              "community",
              "newsletter"
              
            ].map((item) => (
              <a
                key={item}
                onClick={() => handleLinkClick(item)}
                className="hover:text-neutral-400 transition cursor-pointer"
              >
                {item.replace("-", " ")}
              </a>
            ))}
            {email && (
              <button
                onClick={handleLogout}
                className="text-left pt-3 hover:text-neutral-400 transition text-sm"
              >
                 <div className="logout-head flex items-center gap-2">
                      <div className="logout-text">Logout</div>
                      <div className="logout-img">
                        <img
                          src="/icons/logout.svg"
                          alt="Logo"
                          className="w-6 rounded-full"
                        />
                      </div>
                    </div>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
