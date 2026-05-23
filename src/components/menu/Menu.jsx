// import { useState } from "react";
// import { NavLink, useLocation } from "react-router-dom";

// const iconClass = "h-7 w-7";

// const Icons = {
//   grid: (
//     <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden="true">
//       <path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z" />
//     </svg>
//   ),
//   list: (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClass} aria-hidden="true">
//       <path d="M5 4h14v16H5z" />
//       <path d="M8 8h1M11 8h5M8 12h1M11 12h5M8 16h1M11 16h5" />
//     </svg>
//   ),
//   clock: (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" className={iconClass} aria-hidden="true">
//       <circle cx="12" cy="12" r="8" />
//       <path d="M12 7v5l4 2" />
//     </svg>
//   ),
//   upload: (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" className={iconClass} aria-hidden="true">
//       <circle cx="12" cy="12" r="8" />
//       <path d="m8.5 12 3.5-3.5 3.5 3.5M12 16V9" />
//     </svg>
//   ),
//   download: (
//     <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden="true">
//       <path d="M10 3h4v8h4l-6 6-6-6h4V3Zm-5 14h4v3h6v-3h4v5H5v-5Z" />
//     </svg>
//   ),
//   mail: (
//     <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden="true">
//       <path d="M3 5h18v14H3V5Zm9 8.3L4.8 7H4v.7l8 7 8-7V7h-.8L12 13.3Zm-2.1.2L4 18.7V19h16v-.3l-5.9-5.2-2.1 1.8-2.1-1.8Z" />
//     </svg>
//   ),
// };

// const menuItems = [
//   { label: "Dashboard", icon: Icons.grid, href: "/dashboard" },
//   { label: "Detailed Dashboard", icon: Icons.grid, href: "/detailed-dashboard" },
//   {
//     label: "Setup",
//     icon: Icons.list,
//     href: "/setup",
//     children: [
//       { label: "Portfolio", href: "/setup/portfolio" },
//       { label: "Status Code", href: "/setup/status-code" },
//       { label: "Manage User", href: "/setup/manage-user" },
//     ],
//   },
//   { label: "Manage Allocation", icon: Icons.grid, href: "/manage-allocation" },
//   {
//     label: "Operation",
//     icon: Icons.clock,
//     href: "/operation",
//     children: [
//       { label: "Advance Search", href: "/operation/advance-search" },
//       { label: "Requested SMS", href: "/operation/requested-sms" },
//       { label: "Field Visit", href: "/operation/field-visit" },
//       { label: "Followup Details", href: "/operation/followup-details" },
//     ],
//   },
//   {
//     label: "Upload Allocation",
//     icon: Icons.upload,
//     href: "/upload-allocation",
//     children: [{ label: "Upload Allocation", href: "/upload-allocation/new" }],
//   },
//   { label: "Reports", icon: Icons.download, href: "/reports" },
//   { label: "Settings", icon: Icons.mail, href: "/settings" },
// ];

// function MenuItem({ item, isExpanded, isCurrent, onToggle }) {
//   const hasChildren = Boolean(item.children?.length);
//   const isHighlighted = isExpanded || isCurrent;
//   const itemClasses = `relative flex min-h-[96px] w-full flex-col items-center justify-center px-3 py-4 text-center text-base transition ${
//     isHighlighted
//       ? "bg-[#2e3f59] text-white"
//       : "text-[#93a7c8] hover:bg-[#334660] hover:text-white"
//   }`;

//   if (hasChildren) {
//     return (
//       <div className={isExpanded ? "bg-[#2e3f59]" : ""}>
//         <button type="button" className={itemClasses} onClick={onToggle}>
//           <span className="mb-2.5 text-current">{item.icon}</span>
//           <span className="max-w-full font-medium leading-5">{item.label}</span>
//           <span className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl leading-none">
//             {isExpanded ? "⌄" : "‹"}
//           </span>
//         </button>

//         {isExpanded && (
//           <div className="space-y-1 pb-5 pt-2">
//             {item.children.map((child) => (
//               <NavLink
//                 key={child.label}
//                 to={child.href}
//                 className={({ isActive }) =>
//                   `block px-5 py-2.5 text-center text-base transition ${
//                     isActive
//                       ? "font-semibold text-white"
//                       : "text-[#8fb0e5] hover:text-white"
//                   }`
//                 }
//               >
//                 {child.label}
//               </NavLink>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   }

//   return (
//     <NavLink
//       to={item.href}
//       className={({ isActive }) =>
//         `relative flex min-h-[96px] w-full flex-col items-center justify-center px-3 py-4 text-center text-base transition ${
//           isActive
//             ? "bg-[#2e3f59] text-white"
//             : "text-[#93a7c8] hover:bg-[#334660] hover:text-white"
//         }`
//       }
//     >
//       <span className="mb-2.5 text-current">{item.icon}</span>
//       <span className="max-w-full font-medium leading-5">{item.label}</span>
//       {item.label !== "Dashboard" && item.label !== "Detailed Dashboard" && (
//         <span className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl leading-none">
//           ‹
//         </span>
//       )}
//     </NavLink>
//   );
// }

// function Menu() {
//   const location = useLocation();
//   const initialOpen = menuItems.find((item) =>
//     item.children?.some((child) => location.pathname.startsWith(child.href)),
//   )?.label;
//   const [expanded, setExpanded] = useState(initialOpen || "");

//   const handleToggle = (label) => {
//     setExpanded((current) => (current === label ? "" : label));
//   };

//   return (
//     <aside className="min-h-screen w-[195px] shrink-0 overflow-hidden bg-[#354762] text-white">
//       <div className="flex h-10 items-center justify-center bg-[#087f86] px-3 text-center text-lg font-bold uppercase leading-none tracking-wide">
//         Collection CRM
//       </div>

//       <nav aria-label="Main menu" className="pb-6">
//         {menuItems.map((item) => {
//           const isCurrent =
//             location.pathname === item.href ||
//             item.children?.some((child) => location.pathname === child.href);

//           return (
//             <MenuItem
//               key={item.label}
//               item={item}
//               isExpanded={expanded === item.label}
//               isCurrent={Boolean(isCurrent)}
//               onToggle={() => handleToggle(item.label)}
//             />
//           );
//         })}
//       </nav>
//     </aside>
//   );
// }

// export default Menu;



import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Grid2X2,
  Settings2,
  Users,
  Clock3,
  Upload,
  FileText,
  LogOut,
  Mail,
  Menu as MenuIcon,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { logout } from "../../features/auth/authUtils";

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

function SidebarMenuItem({
  item,
  expanded,
  isCollapsed,
  onExpandSidebar,
  onCloseMobile,
  toggleMenu,
}) {
  const location = useLocation();
  const Icon = item.icon;

  const isActive =
    item.href === location.pathname ||
    item.children?.some((child) => location.pathname === child.href);

  const hasChildren = item.children?.length > 0;

  const handleSectionClick = () => {
    if (isCollapsed) {
      onExpandSidebar(item.label);
      return;
    }

    toggleMenu(item.label);
  };

  return (
    <div className="mb-2">
      {hasChildren ? (
        <>
          <button
            onClick={handleSectionClick}
            title={isCollapsed ? item.label : undefined}
            className={`group flex w-full items-center rounded-lg transition-all duration-300 ${
              isCollapsed ? "justify-center px-0 py-2" : "justify-between px-3 py-2.5"
            } ${
              isActive || expanded
                ? "bg-white/12 text-white shadow-[0_10px_28px_rgba(80,72,190,0.35)]"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <div
              className={`flex min-w-0 items-center ${
                isCollapsed ? "justify-center" : "gap-3"
              }`}
            >
              <div
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-all duration-300 ${
                  isActive || expanded
                    ? "bg-white/24 shadow-[0_0_18px_rgba(255,255,255,0.18)]"
                    : "bg-white/10 group-hover:bg-white/16"
                }`}
              >
                <Icon size={17} />
              </div>

              {!isCollapsed && (
                <span className="truncate text-[13px] font-semibold">
                  {item.label}
                </span>
              )}
            </div>

            {!isCollapsed &&
              (expanded ? (
                <ChevronDown size={16} className="shrink-0" />
              ) : (
                <ChevronRight size={16} className="shrink-0" />
              ))}
          </button>

          {!isCollapsed && (
            <div
              className={`overflow-hidden transition-all duration-300 ${
                expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="ml-5 mt-2 border-l border-white/12 pl-4">
                {item.children.map((child) => (
                  <NavLink
                    key={child.label}
                    to={child.href}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `mb-1 block rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-white/14 text-white"
                          : "text-white/58 hover:bg-white/10 hover:text-white"
                      }`
                    }
                  >
                    {child.label}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <NavLink
          to={item.href}
          onClick={onCloseMobile}
          title={isCollapsed ? item.label : undefined}
          className={({ isActive }) =>
            `group flex items-center rounded-lg transition-all duration-300 ${
              isCollapsed ? "justify-center px-0 py-2" : "gap-3 px-3 py-2.5"
            } ${
              isActive
                ? "bg-white/14 text-white shadow-[0_10px_28px_rgba(80,72,190,0.35)]"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`
          }
        >
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 transition-all duration-300 group-hover:bg-white/16">
            <Icon size={17} />
          </div>

          {!isCollapsed && (
            <span className="truncate text-[13px] font-semibold">
              {item.label}
            </span>
          )}
        </NavLink>
      )}
    </div>
  );
}

function Menu({ isMobileOpen = false, onCloseMobile = () => {} }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const defaultMenu = menuItems.find((item) =>
    item.children?.some((child) => location.pathname === child.href)
  )?.label;

  const [expandedMenu, setExpandedMenu] = useState(defaultMenu || "");

  useEffect(() => {
    onCloseMobile();
  }, [location.pathname, onCloseMobile]);

  const toggleMenu = (menu) => {
    setExpandedMenu((prev) => (prev === menu ? "" : menu));
  };

  const expandSidebar = (menu = "") => {
    setIsCollapsed(false);
    setExpandedMenu(menu);
  };

  const handleLogout = () => {
    logout();
    setExpandedMenu("");
    onCloseMobile();
    navigate("/", { replace: true });
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-dvh w-[min(86vw,280px)] shrink-0 flex-col overflow-hidden border-r border-white/10 bg-[radial-gradient(circle_at_40%_20%,rgba(119,95,210,0.78),transparent_34%),linear-gradient(180deg,#4b4c9f_0%,#23255f_45%,#1d214f_100%)] text-white shadow-[8px_0_30px_rgba(30,34,90,0.24)] transition-all duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0 lg:transition-[width] ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      } ${
        isCollapsed ? "lg:w-[82px]" : "lg:w-[280px]"
      }`}
    >
      <div
        className={`sticky top-0 z-10 flex h-16 items-center border-b border-white/12 bg-white/5 backdrop-blur ${
          isCollapsed ? "justify-center px-3" : "justify-between px-6"
        }`}
      >
        {!isCollapsed && (
          <h1 className="truncate text-[15px] font-extrabold tracking-wide text-white">
            COLLECTION CRM
          </h1>
        )}

        <button
          type="button"
          onClick={() => {
            if (isMobileOpen) {
              onCloseMobile();
              return;
            }

            setIsCollapsed((current) => !current);
          }}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white/90 transition hover:bg-white/12 hover:text-white"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="lg:hidden">
            <X size={19} />
          </span>
          <span className="hidden lg:block">
            <MenuIcon size={19} />
          </span>
        </button>
      </div>

      <nav
        className={`flex-1 overflow-y-auto py-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          isCollapsed ? "px-4" : "px-3"
        }`}
      >
        {menuItems.map((item) => (
          <SidebarMenuItem
            key={item.label}
            item={item}
            expanded={expandedMenu === item.label}
            isCollapsed={isCollapsed}
            onExpandSidebar={expandSidebar}
            onCloseMobile={onCloseMobile}
            toggleMenu={toggleMenu}
          />
        ))}
      </nav>

      <div
        className={`border-t border-white/12 bg-white/5 py-4 ${
          isCollapsed ? "px-4" : "px-3"
        }`}
      >
        <button
          type="button"
          onClick={handleLogout}
          title={isCollapsed ? "Logout" : undefined}
          className={`group flex w-full items-center rounded-lg text-white/80 transition-all duration-300 hover:bg-red-500/18 hover:text-white ${
            isCollapsed ? "justify-center px-0 py-2" : "gap-3 px-3 py-2.5"
          }`}
        >
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 transition-all duration-300 group-hover:bg-red-500/25">
            <LogOut size={17} />
          </div>

          {!isCollapsed && (
            <span className="truncate text-[13px] font-semibold">Logout</span>
          )}
        </button>
      </div>
    </aside>
  );
}

export default Menu;
