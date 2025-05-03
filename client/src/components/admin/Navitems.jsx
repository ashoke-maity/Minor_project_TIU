import { Link, NavLink } from "react-router-dom";

export default function Navitems() {
  const sidebarItems = [
    {
      id: 1,
      icon: "/icons/home.svg",
      label: "Dashboard",
      href: "/admin",
    },
    {
      id: 2,
      icon: "/icons/users.svg",
      label: "All Users",
      href: "/users",
    },
    {
      id: 3,
      icon: "/icons/itinerary.svg",
      label: "AI Trips",
      href: "/trips",
    },
  ];

  const user = {
    name: 'Jordan',
    email: 'jordan555@gmail.com',
    imageUrl: '/images/david.webp'
  };

  return (
    <section className="nav-items bg-white h-full flex flex-col justify-between">
      <div>
        <Link to="/home" className="link-logo flex items-center gap-2 px-4 py-4">
          <img src="/icons/logo3.png" alt="logo" className="size-[40px]" />
          <h1>AlumniConnect</h1>
        </Link>

        <nav className="mt-4 flex flex-col gap-2">
          {sidebarItems.map(({ id, icon, label, href }) => (
            <NavLink
              key={id}
              to={href}
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
        <img src={user?.imageUrl || '/images/david.webp'} alt={user?.name || 'David'} className="size-10 rounded-full"/>
        <article className="flex-1">
          <h2 className="text-sm font-medium">{user?.name}</h2>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </article>
        <button onClick={() => {
          console.log('logout');
        }} className="cursor-pointer">
          <img src="/icons/logout.svg" alt="logout" className="size-6"/>
        </button>
      </footer>
    </section>
  );
}
