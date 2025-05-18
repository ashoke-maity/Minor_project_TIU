import React, { useEffect, useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import axios from "axios";

function Sidebar() {
  const navigate = useNavigate();
  const adminRoute = import.meta.env.VITE_ADMIN_ROUTE;

  const sidebarItems = [
    {
      id: 1,
      icon: "/icons/home.svg",
      label: "Dashboard",
      href: `${adminRoute}/admin/dashboard`,
      exact: true,
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
      isDisabled: true, // remove it when the work is done
    },
    {
      id: 7,
      icon: "/icons/settings.svg",
      label: "Settings",
      href: `${adminRoute}/admin/dashboard/settings`,
    },
  ];

  const [adminName, setAdminName] = useState("Admin");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminLastName, setAdminLastName] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");

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
          const admin = res.data.admin;

          setAdminName(admin.FirstName);
          setAdminLastName(admin.LastName);
          setAdminEmail(admin.Email);

          let profileUrl = admin.ProfileImage || "";
          if (profileUrl && !profileUrl.startsWith("http")) {
            profileUrl = import.meta.env.VITE_ADMIN_API_URL + "/" + profileUrl;
          }
          setProfilePicUrl(profileUrl);
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate(`${adminRoute}/admin/login`);
  };

  return (
    <aside className="bg-white w-full max-w-[270px] hidden lg:block shadow-sm border-r border-gray-100">
      <SidebarComponent width={270} enableGestures={false}>
        <section className="nav-items bg-white flex flex-col h-full">
          <div className="py-5 px-4 border-b border-gray-100">
            <Link to="/home" className="flex items-center gap-2">
              <img
                src="/icons/logo3.png"
                alt="logo"
                className="size-[30px]"
              />
              <h1 className="text-xl font-bold">AlumniConnect</h1>
            </Link>
          </div>

          <nav className="mt-4 flex flex-col gap-2 px-2">
            {sidebarItems.map(({ id, icon, label, href, isDisabled, exact }) => {
              if (isDisabled) {
                return (
                  <div
                    key={id}
                    onClick={() => alert("This section is under development")}
                    className="nav-item group flex items-center gap-2 px-4 py-3 rounded-md transition cursor-pointer text-gray-400 hover:bg-gray-100"
                  >
                    <img
                      src={icon}
                      alt={label}
                      className="size-5 opacity-50"
                    />
                    <span className="text-sm">{label}</span>
                  </div>
                );
              }

              return (
                <NavLink
                  key={id}
                  to={href}
                  end={exact || href === `${adminRoute}/admin/dashboard`}
                  className={({ isActive }) =>
                    `nav-item group flex items-center gap-2 px-4 py-3 rounded-md transition ${
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
                      <span className={`${isActive ? "text-white" : ""} text-sm`}>
                        {label}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <footer className="mt-auto border-t border-gray-100">
            <div className="px-4 py-4 flex items-center gap-3">
              {profilePicUrl ? (
                <img
                  src={profilePicUrl}
                  alt="Admin Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="bg-primary-100 text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold">
                  {adminName.charAt(0)}
                  {adminLastName.charAt(0)}
                </div>
              )}
              <article className="flex-1 min-w-0">
                <h2 className="text-sm font-medium truncate">
                  {adminName} {adminLastName}
                </h2>
                <p className="text-xs text-gray-500 truncate">{adminEmail}</p>
              </article>
              <button 
                onClick={handleLogout} 
                className="p-2 rounded-md hover:bg-gray-100"
                aria-label="Logout"
              >
                <img src="/icons/logout.svg" alt="logout" className="size-5" />
              </button>
            </div>
          </footer>
        </section>
      </SidebarComponent>
    </aside>
  );
}

export default Sidebar; 