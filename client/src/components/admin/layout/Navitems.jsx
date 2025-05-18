import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Navitems() {
  const adminRoute = import.meta.env.VITE_ADMIN_ROUTE;
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

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

          setFirstName(first);
          setLastName(last);
          setAdminName(fullName);
          setAdminEmail(admin.Email);
          
          // Set profile pic URL if available
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
      icon: "/icons/calendar.svg",
      label: "Events",
      href: `${adminRoute}/admin/dashboard/events`,
      exact: false,
    },
    {
      id: 4,
      icon: "/icons/briefcase.png",
      label: "Job Opening",
      href: `${adminRoute}/admin/dashboard/jobs`,
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
      isDisabled: true,
    },
    {
      id: 7,
      icon: "/icons/settings.svg",
      label: "Settings",
      href: `${adminRoute}/admin/dashboard/settings`,
    },
  ];

  return (
    <section className="nav-items bg-white w-full flex flex-col justify-between h-full">
      <div>
        <div className="py-5 px-4 border-b border-gray-100">
          <h1 className="text-lg font-bold">Admin Menu</h1>
        </div>

        <nav className="mt-4 flex flex-col gap-2 px-2">
          {sidebarItems.map(({ id, icon, label, href, exact, isDisabled }) => {
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
                end={exact}
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
                    <span className={`${isActive ? "text-white" : ""} text-sm`}>{label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <footer className="mt-auto border-t border-gray-100">
        <div className="px-4 py-4 flex items-center gap-3">
          {profilePicUrl ? (
            <img 
              src={profilePicUrl} 
              alt={adminName} 
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="bg-primary-100 text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold">
              {firstName.charAt(0)}{lastName.charAt(0)}
            </div>
          )}
          <article className="flex-1 min-w-0">
            <h2 className="text-sm font-medium truncate">{adminName}</h2>
            <p className="text-xs text-gray-500 truncate">{adminEmail}</p>
          </article>
          <button
            onClick={() => {
              localStorage.removeItem("authToken");
              window.location.href = `${adminRoute}/admin/login`;
            }}
            className="p-2 rounded-md hover:bg-gray-100"
            aria-label="Logout"
          >
            <img src="/icons/logout.svg" alt="logout" className="size-5" />
          </button>
        </div>
      </footer>
    </section>
  );
} 