// import { useState } from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Grid2X2,
//   Settings2,
//   Users,
//   Clock3,
//   Upload,
//   FileText,
//   Mail,
//   ChevronDown,
//   ChevronRight,
//   LogOut,
// } from "lucide-react";
// import { useLogout } from "../../hooks/useLogout";

// const menuItems = [
//   { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
//   { label: "Detailed Dashboard", icon: Grid2X2, href: "/detailed-dashboard" },
//   {
//     label: "Setup",
//     icon: Settings2,
//     children: [
//       { label: "Portfolio", href: "/setup/portfolio" },
//       { label: "Status Code", href: "/setup/status-code" },
//       { label: "Manage User", href: "/setup/manage-user" },
//     ],
//   },
//   {
//     label: "Manage Allocation",
//     icon: Users,
//     children: [
//       { label: "Allocation Transfer", href: "/allocation/transfer" },
//       { label: "Allocation Delete", href: "/allocation/delete" },
//       { label: "Allocation Backup", href: "/allocation/backup" },
//       { label: "Dump Search", href: "/allocation/dump-search" },
//       { label: "Allocation Update", href: "/allocation/update" },
//     ],
//   },
//   {
//     label: "Operation",
//     icon: Clock3,
//     children: [
//       { label: "Advance Search", href: "/operation/advance-search" },
//       { label: "Requested SMS", href: "/operation/requested-sms" },
//       { label: "Field Visit", href: "/operation/field-visit" },
//       { label: "Followup Details", href: "/operation/followup-details" },
//     ],
//   },
//   {
//     label: "Upload Allocation",
//     icon: Upload,
//     children: [{ label: "Upload Allocation", href: "/upload-allocation" }],
//   },
//   {
//     label: "Reports",
//     icon: FileText,
//     children: [{ label: "All Portfolio", href: "/reports/all-portfolio" }],
//   },
//   {
//     label: "Settings",
//     icon: Mail,
//     children: [{ label: "SMTP Details", href: "/settings/smtp-details" }],
//   },
// ];

// function SidebarMenuItem({ item, expanded, toggleMenu }) {
//   const location = useLocation();
//   const Icon = item.icon;

//   const isActive =
//     item.href === location.pathname ||
//     item.children?.some((child) => location.pathname === child.href);

//   const hasChildren = item.children?.length > 0;

//   return (
//     <div className="mb-1">
//       {hasChildren ? (
//         <>
//           <button
//             onClick={() => toggleMenu(item.label)}
//             className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 transition-all duration-300 ${isActive || expanded
//               ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
//               : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
//               }`}
//           >
//             <div className="flex items-center gap-3">
//               <div
//                 className={`min-w-max rounded-lg p-2 ${isActive || expanded
//                   ? "bg-white/20"
//                   : "bg-slate-700 group-hover:bg-slate-600"
//                   }`}
//               >
//                 <Icon size={18} />
//               </div>

//               <span className="whitespace-nowrap text-sm font-medium tracking-wide opacity-0 transition-opacity duration-300 group-hover/sidebar:opacity-100">
//                 {item.label}
//               </span>
//             </div>

//             <div className="opacity-0 transition-opacity duration-300 group-hover/sidebar:opacity-100">
//               {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
//             </div>
//           </button>

//           <div
//             className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
//               }`}
//           >
//             {/* The submenu items are only fully visible/usable when sidebar is expanded via hover, 
//                 but we can keep them in the DOM. We hide them when not hovered to prevent overflow. */}
//             <div className="ml-4 mt-2 border-l border-slate-700 pl-4 opacity-0 transition-opacity duration-300 group-hover/sidebar:opacity-100">
//               {item.children.map((child) => (
//                 <NavLink
//                   key={child.label}
//                   to={child.href}
//                   className={({ isActive }) =>
//                     `mb-1 block whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-all duration-200 ${isActive
//                       ? "bg-slate-700 text-cyan-300"
//                       : "text-slate-400 hover:bg-slate-700/60 hover:text-white"
//                     }`
//                   }
//                 >
//                   {child.label}
//                 </NavLink>
//               ))}
//             </div>
//           </div>
//         </>
//       ) : (
//         <NavLink
//           to={item.href}
//           className={({ isActive }) =>
//             `group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${isActive
//               ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
//               : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
//             }`
//           }
//         >
//           <div className="min-w-max rounded-lg bg-slate-700 p-2 group-hover:bg-slate-600">
//             <Icon size={18} />
//           </div>

//           <span className="whitespace-nowrap text-sm font-medium tracking-wide opacity-0 transition-opacity duration-300 group-hover/sidebar:opacity-100">
//             {item.label}
//           </span>
//         </NavLink>
//       )}
//     </div>
//   );
// }

// function Menu() {
//   const location = useLocation();
//   const performLogout = useLogout();

//   const defaultMenu = menuItems.find((item) =>
//     item.children?.some((child) => location.pathname === child.href)
//   )?.label;

//   const [expandedMenu, setExpandedMenu] = useState(defaultMenu || "");

//   const toggleMenu = (menu) => {
//     setExpandedMenu((prev) => (prev === menu ? "" : menu));
//   };

//   return (
//     <aside className="group/sidebar sticky top-0 z-40 flex h-screen w-[85px] flex-col overflow-x-hidden border-r border-slate-700 bg-[#1e293b] text-white shadow-2xl transition-all duration-300 hover:w-[280px]">
//       <div className="relative flex min-h-[73px] items-center justify-center border-b border-slate-700 bg-[#0f172a] px-4 py-5">
//         <h1 className="absolute bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-center text-2xl font-extrabold tracking-wider text-transparent opacity-100 transition-opacity duration-300 group-hover/sidebar:opacity-0">
//           C
//         </h1>
//         <h1 className="whitespace-nowrap bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-center text-2xl font-extrabold tracking-wider text-transparent opacity-0 transition-opacity duration-300 group-hover/sidebar:opacity-100">
//           COLLECTION CRM
//         </h1>
//       </div>

//       <nav className="custom-scrollbar flex-1 space-y-2 overflow-y-auto overflow-x-hidden p-4">
//         {menuItems.map((item) => (
//           <SidebarMenuItem
//             key={item.label}
//             item={item}
//             expanded={expandedMenu === item.label}
//             toggleMenu={toggleMenu}
//           />
//         ))}
//       </nav>

//       <div className="sticky bottom-0 z-10 mt-auto border-t border-slate-700 bg-[#1e293b] p-4">
//         <button
//           onClick={performLogout}
//           className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition-all duration-300 hover:bg-red-500/10 hover:text-red-500"
//         >
//           <div className="min-w-max rounded-lg bg-slate-700 p-2 group-hover:bg-red-500/20 group-hover:text-red-500">
//             <LogOut size={18} />
//           </div>
//           <span className="whitespace-nowrap text-sm font-medium tracking-wide opacity-0 transition-opacity duration-300 group-hover/sidebar:opacity-100">
//             Logout
//           </span>
//         </button>
//       </div>
//     </aside>
//   );
// }

// export default Menu;



import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Grid2X2,
  Settings2,
  Users,
  Clock3,
  FileText,
  Mail,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  X,
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
    label: "Setup / Masters",
    icon: Settings2,
    children: [
      { label: "Portfolio/Bank", href: "/setup/portfolio" },
      { label: "Disposition Status", href: "/setup/status-code" },
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
    ],
  },
  {
    label: "Operation",
    icon: Clock3,
    children: [
      { label: "Advance Search", href: "/operation/advance-search" },
      { label: "Requested SMS", href: "/operation/requested-sms" },
      { label: "Email Request", href: "/operation/email-request" },
      { label: "Field Visit", href: "/operation/field-visit" },
    ],
  },
  {
    label: "Reports",
    icon: FileText,
    children: [{ label: "All Portfolio", href: "/reports/all-portfolio" }],
  },
  {
    label: "Settings",
    icon: Mail,
    children: [{ label: "SMTP Details", href: "/settings/smtp-details" }],
  },
];

function SidebarItem({
  item,
  expanded,
  toggleMenu,
  isSidebarOpen,
  onCloseMobile,
}) {
  const location = useLocation();
  const { t } = useTranslation();
  const translateText = (text) => t(`appText.${text}`, { defaultValue: text });

  const Icon = item.icon;

  const isActive =
    item.href === location.pathname ||
    item.children?.some((child) => child.href === location.pathname);

  const hasChildren = item.children?.length > 0;

  return (
    <div className="mb-1.5">
      {hasChildren ? (
        <>
          <button
            onClick={() => toggleMenu(item.label)}
            className={`group relative flex w-full items-center overflow-hidden rounded-xl px-2.5 py-2.5 transition-all duration-300 ${isActive || expanded
              ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg"
              : "text-slate-400 hover:bg-[#1f2937] hover:text-white"
              }`}
          >
            {/* ACTIVE BAR */}
            {(isActive || expanded) && (
              <div className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-cyan-400" />
            )}

            {/* ICON */}
            <div className="flex min-w-[36px] items-center justify-center">
              <Icon size={19} />
            </div>

            {/* TEXT */}
            <div
              className={`flex flex-1 items-center justify-between overflow-hidden transition-all duration-300 ${isSidebarOpen ? "ml-2 opacity-100" : "w-0 opacity-0"
                }`}
            >
              <span className="whitespace-nowrap text-sm font-semibold">
                {translateText(item.label)}
              </span>

              {expanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </div>
          </button>

          {/* SUBMENU */}
          <div
            className={`overflow-hidden transition-all duration-300 ${expanded && isSidebarOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0"
              }`}
          >
            <div className="ml-7 mt-1.5 border-l border-slate-800 pl-3">
              {item.children.map((child) => (
                <NavLink
                  key={child.label}
                  to={child.href}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `mb-1 flex items-center rounded-lg px-2.5 py-1.5 text-sm transition-all duration-300 ${isActive
                      ? "bg-[#1e293b] text-cyan-400"
                      : "text-slate-500 hover:bg-[#1e293b] hover:text-white"
                    }`
                  }
                >
                  <div className={`mr-2 h-2 w-2 rounded-full ${isActive ? 'bg-cyan-400' : 'bg-transparent'}`} />

                  {translateText(child.label)}
                </NavLink>
              ))}
            </div>
          </div>
        </>
      ) : (
        <NavLink
          to={item.href}
          onClick={onCloseMobile}
          className={({ isActive }) =>
            `group relative flex items-center overflow-hidden rounded-xl px-2.5 py-2.5 transition-all duration-300 ${isActive
              ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg"
              : "text-slate-400 hover:bg-[#1f2937] hover:text-white"
            }`
          }
        >
          {isActive && (
            <div className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-cyan-400" />
          )}

          {/* ICON */}
          <div className="flex min-w-[36px] items-center justify-center">
            <Icon size={19} />
          </div>

          {/* TEXT */}
          <div
            className={`overflow-hidden transition-all duration-300 ${isSidebarOpen ? "ml-2 opacity-100" : "w-0 opacity-0"
              }`}
          >
            <span className="whitespace-nowrap text-sm font-semibold">
              {translateText(item.label)}
            </span>
          </div>
        </NavLink>
      )}
    </div>
  );
}

function MenuComponent({ isMobileOpen, onCloseMobile, isSidebarOpen, onToggleSidebar }) {
  const location = useLocation();
  const { t } = useTranslation();
  const performLogout = useLogout();
  const translateText = (text) => t(`appText.${text}`, { defaultValue: text });

  const defaultMenu = menuItems.find((item) =>
    item.children?.some((child) => child.href === location.pathname)
  )?.label;

  const [expandedMenu, setExpandedMenu] = useState(defaultMenu || "");

  const toggleMenu = (menu) => {
    setExpandedMenu((prev) => (prev === menu ? "" : menu));
  };

  return (
    <>
      {/* OVERLAY for Mobile */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-slate-800 bg-[#0b1120] transition-all duration-300
          
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          
          lg:translate-x-0
          ${isSidebarOpen ? "lg:w-[250px]" : "lg:w-[76px]"}
          w-[280px]
        `}
      >
        {/* LOGO */}
        <div className="flex h-[68px] items-center border-b border-slate-800 px-3">
          {/* DESKTOP TOGGLE */}
          <button
            onClick={onToggleSidebar}
            className="hidden rounded-xl p-2.5 text-white transition hover:bg-[#1f2937] lg:flex"
          >
            <Menu size={20} />
          </button>

          {/* MOBILE CLOSE */}
          <button
            onClick={onCloseMobile}
            className="rounded-xl p-2.5 text-white transition hover:bg-[#1f2937] lg:hidden"
          >
            <X size={20} />
          </button>

          {/* BRAND */}
          <div
            className={`overflow-hidden transition-all duration-300 ${isSidebarOpen ? "ml-3 opacity-100" : "w-0 opacity-0"
              }`}
          >
            <h1 className="whitespace-nowrap bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-lg font-bold tracking-wide text-transparent">
              {translateText("COLLECTION CRM")}
            </h1>

            <p className="mt-1 text-xs tracking-wider text-slate-500">
              {translateText("MANAGEMENT PANEL")}
            </p>
          </div>
        </div>

        {/* MENU */}
        <nav className="custom-scrollbar flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.label}
              item={item}
              expanded={expandedMenu === item.label}
              toggleMenu={toggleMenu}
              isSidebarOpen={isSidebarOpen}
              onCloseMobile={onCloseMobile}
            />
          ))}
        </nav>

        {/* FOOTER */}
        <div className="border-t border-slate-800 p-3">
          <button
            onClick={performLogout}
            className="group flex w-full items-center overflow-hidden rounded-xl px-2.5 py-2.5 text-slate-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-400"
          >
            {/* ICON */}
            <div className="flex min-w-[36px] items-center justify-center">
              <LogOut size={19} />
            </div>

            {/* TEXT */}
            <div
              className={`overflow-hidden transition-all duration-300 ${isSidebarOpen ? "ml-2 opacity-100" : "w-0 opacity-0"
                }`}
            >
              <span className="whitespace-nowrap text-sm font-semibold">
                {translateText("Logout")}
              </span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}

export default MenuComponent;
