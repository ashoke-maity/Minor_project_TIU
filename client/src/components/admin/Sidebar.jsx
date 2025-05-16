import React, { useEffect, useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import axios from "axios";

export default function Sidebar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear(); // clears everything
    navigate(`${import.meta.env.VITE_ADMIN_ROUTE}/admin/login`);
  };

  const adminRoute = import.meta.env.VITE_ADMIN_ROUTE;

  const sidebarItems = [
    {
      id: 1,
      icon: "/icons/home.svg",
      label: "Dashboard",
      href: `${adminRoute}/admin/dashboard`,
    },
    {
      id: 2,
      icon: "/icons/users.svg",
      label: "All Users",
      href: `${adminRoute}/admin/dashboard/allusers`,
    },
    {
      id: 3,
      icon: "/icons/briefcase.png",
      label: "Job Opening",
      href: `${adminRoute}/admin/dashboard/jobs`,
    },
        {
      id: 4,
      icon: "/icons/calendar.svg",
      label: "Events",
      href: `${adminRoute}/admin/dashboard/events`,
    },
    {
      id: 5,
      icon: "/icons/story.png",
      label: "Stories",
      href: `${adminRoute}/admin/dashboard/stories`,
    },
    {
      id: 6,
      icon: "/icons/heart.png",
      label: "Donations",
      href: `${adminRoute}/admin/dashboard/donations`,
    },
      {
    id: 7,
    icon: "/icons/settings.svg", // Make sure this icon exists
    label: "Settings",
    href: `${adminRoute}/admin/dashboard/settings`,
  },
  ];

  const [adminName, setAdminName] = useState("Admin");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminLastName, setAdminLastName] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(
          `${import.meta.env.VITE_ADMIN_API_URL}/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 200) {
          setAdminName(res.data.admin.FirstName);
          setAdminLastName(res.data.admin.LastName);
          setAdminEmail(res.data.admin.Email);
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <aside className="bg-white w-full max-w-[270px] hidden lg:block">
      <SidebarComponent width={270} enableGestures={false}>
        <section className="nav-items bg-white">
          <Link
            to="/home"
            className="link-logo flex items-center gap-2 px-4 py-4"
          >
            <img
              src="/icons/logo3.png"
              alt="logo"
              className="size-[40px] -mr-3 -ml-3 items-center justify-center content-center"
            />
            <h1>AlumniConnect</h1>
          </Link>

          <div className="container">
            <nav className="mt-4 flex flex-col gap-2">
              {sidebarItems.map(({ id, icon, label, href }) => (
                <NavLink
                  key={id}
                  to={href}
                  end={href === `${adminRoute}/admin/dashboard`} // Exact match only for Dashboard
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
                      <span className={`${isActive ? "text-white" : ""}`}>
                        {label}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <footer className="nav-footer flex items-center gap-3 px-4 py-4 border-t mt-4">
              <div className="bg-primary-100 text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold text-lg">
                {adminName.charAt(0)}
                {adminLastName.charAt(0)}
              </div>
              <article className="flex-1">
                <h2 className="font-semibold">
                  {adminName} {adminLastName}
                </h2>
                <p className="text-sm text-gray-500">{adminEmail}</p>
              </article>
              <button onClick={handleLogout} className="cursor-pointer">
                <img src="/icons/logout.svg" alt="logout" className="size-6" />
              </button>
            </footer>
          </div>
        </section>
      </SidebarComponent>
    </aside>
  );
}
