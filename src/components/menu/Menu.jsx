import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Grid2X2,
  Settings2,
  Users,
  Clock3,
  Upload,
  FileText,
  Mail,
  ChevronDown,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useLogout } from "../../hooks/useLogout";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Detailed Dashboard",
    icon: Grid2X2,
    href: "/detailed-dashboard",
  },
  {
    label: "Setup",
    icon: Settings2,
    children: [
      { label: "Portfolio", href: "/setup/portfolio" },
      { label: "Status Code", href: "/setup/status-code" },
      { label: "Manage User", href: "/setup/manage-user" },
    ],
  },
  {
    label: "Manage Allocation",
    icon: Users,
    children: [
      { label: "Allocation Transfer", href: "/allocation/transfer" },
      { label: "Allocation Delete", href: "/allocation/delete" },
      { label: "Allocation Backup", href: "/allocation/backup" },
      { label: "Dump Search", href: "/allocation/dump-search" },
      { label: "Allocation Update", href: "/allocation/update" },
    ],
  },
  {
    label: "Operation",
    icon: Clock3,
    children: [
      { label: "Advance Search", href: "/operation/advance-search" },
      { label: "Requested SMS", href: "/operation/requested-sms" },
      { label: "Field Visit", href: "/operation/field-visit" },
      { label: "Followup Details", href: "/operation/followup-details" },
    ],
  },
  {
    label: "Upload Allocation",
    icon: Upload,
    children: [
      { label: "Upload Allocation", href: "/upload-allocation" },
    ],
  },
  {
    label: "Reports",
    icon: FileText,
    children: [
      { label: "All Portfolio", href: "/reports/all-portfolio" },
    ],
  },
  {
    label: "Settings",
    icon: Mail,
    children: [
      { label: "SMTP Details", href: "/settings/smtp-details" },
    ],
  },
];

function SidebarMenuItem({ item, expanded, toggleMenu }) {
  const location = useLocation();
  const Icon = item.icon;

  const isActive =
    item.href === location.pathname ||
    item.children?.some((child) => location.pathname === child.href);

  const hasChildren = item.children?.length > 0;

  return (
    <div className="mb-1">
      {hasChildren ? (
        <>
          <button
            onClick={() => toggleMenu(item.label)}
            className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 transition-all duration-300 ${
              isActive || expanded
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`rounded-lg p-2 ${
                  isActive || expanded
                    ? "bg-white/20"
                    : "bg-slate-700 group-hover:bg-slate-600"
                }`}
              >
                <Icon size={18} />
              </div>

              <span className="text-sm font-medium tracking-wide">
                {item.label}
              </span>
            </div>

            {expanded ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="ml-4 mt-2 border-l border-slate-700 pl-4">
              {item.children.map((child) => (
                <NavLink
                  key={child.label}
                  to={child.href}
                  className={({ isActive }) =>
                    `mb-1 block rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-slate-700 text-cyan-300"
                        : "text-slate-400 hover:bg-slate-700/60 hover:text-white"
                    }`
                  }
                >
                  {child.label}
                </NavLink>
              ))}
            </div>
          </div>
        </>
      ) : (
        <NavLink
          to={item.href}
          className={({ isActive }) =>
            `group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
              isActive
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
            }`
          }
        >
          <div className="rounded-lg bg-slate-700 p-2 group-hover:bg-slate-600">
            <Icon size={18} />
          </div>

          <span className="text-sm font-medium tracking-wide">
            {item.label}
          </span>
        </NavLink>
      )}
    </div>
  );
}

function Menu() {
  const location = useLocation();
  const performLogout = useLogout();

  const defaultMenu = menuItems.find((item) =>
    item.children?.some((child) => location.pathname === child.href)
  )?.label;

  const [expandedMenu, setExpandedMenu] = useState(defaultMenu || "");

  const toggleMenu = (menu) => {
    setExpandedMenu((prev) => (prev === menu ? "" : menu));
  };

  return (
    <aside className="flex h-screen w-[280px] flex-col border-r border-slate-700 bg-[#1e293b] text-white shadow-2xl">
      <div className="sticky top-0 z-10 border-b border-slate-700 bg-[#0f172a] px-6 py-5">
        <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-center text-2xl font-extrabold tracking-wider text-transparent">
          COLLECTION CRM
        </h1>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {menuItems.map((item) => (
          <SidebarMenuItem
            key={item.label}
            item={item}
            expanded={expandedMenu === item.label}
            toggleMenu={toggleMenu}
          />
        ))}
      </nav>

      <div className="border-t border-slate-700 p-4">
        <button
          onClick={performLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition-all duration-300 hover:bg-red-500/10 hover:text-red-500"
        >
          <div className="rounded-lg bg-slate-700 p-2 group-hover:bg-red-500/20 group-hover:text-red-500">
            <LogOut size={18} />
          </div>
          <span className="text-sm font-medium tracking-wide">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Menu;



