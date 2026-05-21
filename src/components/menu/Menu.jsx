import { NavLink } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", icon: "D", href: "/dashboard" },
  { label: "Customers", icon: "C", href: "/customers" },
  { label: "Collections", icon: "K", href: "#" },
  { label: "Payments", icon: "P", href: "#" },
  { label: "Reports", icon: "R", href: "#" },
  { label: "Settings", icon: "S", href: "#" },
];

function Menu() {
  return (
    <aside className="flex min-h-screen w-full flex-col border-r border-slate-200 bg-white shadow-sm md:max-w-72">
      <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
        <img
          src="/images/logo.jpeg"
          alt="CRMS"
          className="h-11 w-11 rounded-lg object-contain"
        />

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            CRMS
          </p>
          {/* <h1 className="text-lg font-bold text-slate-950">Main Menu</h1> */}
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-5" aria-label="Main menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold ${
                    isActive ? "bg-white/20" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {item.icon}
                </span>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <button
          type="button"
          className="w-full rounded-lg bg-slate-100 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Menu;
