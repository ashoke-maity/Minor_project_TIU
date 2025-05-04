import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Navitems() {
  const adminRoute = import.meta.env.VITE_ADMIN_ROUTE;
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const res = await axios.get(
          `${import.meta.env.VITE_ADMIN_API_URL}/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 200) {
          const admin = res.data.admin;
          const first = admin.FirstName;
          const last = admin.LastName;
          const fullName = `${first} ${last}`.trim();

          setAdminName(fullName);
          setAdminEmail(admin.Email);
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  const sidebarItems = [
    {
      id: 1,
      icon: "/icons/home.svg",
      label: "Dashboard",
      href: `${adminRoute}/admin/dashboard`,
      exact: true,
    },
    {
      id: 2,
      icon: "/icons/users.svg",
      label: "All Users",
      href: `${adminRoute}/admin/dashboard/allusers`,
      exact: false,
    },
    {
      id: 3,
      icon: "/icons/itinerary.svg",
      label: "Events",
      href: `${adminRoute}/admin/dashboard/events`, // Correct link for AI Trips
      exact: false, // Non-exact for AI Trips
    },
  ];

  return (
    <section className="nav-items bg-white h-full flex flex-col justify-between">
      <div>
        <Link to="/home" className="link-logo flex items-center gap-2 px-4 py-4">
          <img src="/icons/logo3.png" alt="logo" className="size-[40px]" />
          <h1>AlumniConnect</h1>
        </Link>

        <nav className="mt-4 flex flex-col gap-2">
          {sidebarItems.map(({ id, icon, label, href, exact }) => (
            <NavLink
              key={id}
              to={href}
              end={exact}
              className={({ isActive }) =>
                `nav-item group flex items-center gap-2 px-4 py-2 rounded-md transition ${
                  isActive
                    ? "bg-primary-100 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={icon}
                    alt={label}
                    className={`size-5 transition-all ${
                      isActive
                        ? "brightness-0 invert"
                        : "group-hover:brightness-0 group-hover:invert"
                    }`}
                  />
                  <span className={`${isActive ? "text-white" : ""}`}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <footer className="nav-footer px-4 py-4 flex items-center gap-2 border-t">
        <img src="/images/david.webp" alt={adminName} className="size-10 rounded-full" />
        <article className="flex-1">
          <h2 className="text-sm font-medium">{adminName}</h2>
          <p className="text-xs text-gray-500">{adminEmail}</p>
        </article>
        <button
          onClick={() => {
            localStorage.removeItem("authToken");
            window.location.href = `${adminRoute}/admin/login`;
          }}
          className="cursor-pointer"
        >
          <img src="/icons/logout.svg" alt="logout" className="size-6" />
        </button>
      </footer>
    </section>
  );
}
