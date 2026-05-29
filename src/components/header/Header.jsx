import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, LockKeyhole, LogOut, Menu, Moon, Sun, User } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { resolveUploadedFileUrl } from "../../utils/auth/authUtils";
import { useLogout } from "../../hooks/useLogout";

const routeLabels = {
  "/dashboard": "Dashboard",
  "/detailed-dashboard": "Detailed Dashboard",
  "/customers": "Customers",
  "/profile": "Profile",
  "/change-password": "Change Password",
  "/setup/portfolio": "Portfolio/Bank",
  "/setup/status-code": "Status Code",
  "/setup/manage-user": "Manage User",
  "/allocation/transfer": "Allocation Transfer",
  "/allocation/delete": "Allocation Delete",
  "/allocation/backup": "Allocation Backup",
  "/allocation/dump-search": "Dump Search",
  "/allocation/update": "Allocation Update",
  "/operation/advance-search": "Advance Search",
  "/operation/requested-sms": "Requested SMS",
  "/operation/field-visit": "Field Visit",
  "/operation/followup-details": "Followup Details",
  "/upload-allocation": "Upload Allocation",
  "/reports/all-portfolio": "All Portfolio",
  "/settings/smtp-details": "SMTP Details",
};

function Header({ isDark, onToggleTheme, onOpenMenu }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showProfileImage, setShowProfileImage] = useState(true);
  const userDetails = useSelector((state) => state.auth.userDetails);

  const displayName = userDetails?.fullName || userDetails?.userName || "Admin User";
  const role = userDetails?.userRole || userDetails?.mapto || "Administrator";
  const portfolio = userDetails?.product || "client1";
  const profileImageUrl = resolveUploadedFileUrl(userDetails?.profilePhotoPath);
  const currentPageLabel = routeLabels[location.pathname] || "Dashboard";
  const breadcrumbs =
    location.pathname === "/dashboard"
      ? [{ label: "Dashboard", href: "/dashboard" }]
      : [
          { label: "Dashboard", href: "/dashboard" },
          { label: currentPageLabel, href: location.pathname },
        ];
  const initials = useMemo(() => {
    const words = displayName.trim().split(/\s+/).filter(Boolean);

    if (!words.length) {
      return "AU";
    }

    return words
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }, [displayName]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  const performLogout = useLogout();

  const handleNavigate = (path) => {
    setIsUserMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    performLogout();
    setIsUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
      <div className="flex h-16 min-w-0 items-center justify-between gap-3 px-4 sm:px-8 lg:px-12">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-700 transition hover:bg-slate-200 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <h2 className="truncate text-base font-bold leading-tight text-slate-950 sm:text-lg">
              Welcome, {displayName}
            </h2>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
          <p className="hidden text-xs font-semibold uppercase tracking-wide text-red-600 md:block">
            On Break
          </p>
          <p className="hidden text-sm text-slate-700 md:block">
            Portfolio: <span className="font-semibold">{portfolio}</span>
          </p>
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-lg font-semibold text-slate-700 transition hover:bg-slate-200"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((current) => !current)}
              className="flex items-center gap-2 rounded-lg px-1.5 py-1.5 text-slate-700 transition hover:bg-slate-100 sm:px-2"
              aria-expanded={isUserMenuOpen}
              aria-haspopup="menu"
            >
              <div className="hidden min-w-0 text-right sm:block">
                <p className="max-w-32 truncate text-sm font-semibold text-slate-800">
                  {displayName}
                </p>
                <p className="max-w-32 truncate text-xs text-slate-500">{role}</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-blue-600 text-sm font-bold text-white ring-1 ring-slate-200">
                {profileImageUrl && showProfileImage ? (
                  <img
                    src={profileImageUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                    onError={() => setShowProfileImage(false)}
                  />
                ) : (
                  initials
                )}
              </div>
              <ChevronDown
                size={15}
                className={`transition ${isUserMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-full z-50 mt-3 w-48 rounded-sm border border-slate-200 bg-white py-1 shadow-lg">
                <span className="absolute -top-2 right-8 h-4 w-4 rotate-45 border-l border-t border-slate-200 bg-white" />
                <button
                  type="button"
                  onClick={() => handleNavigate("/profile")}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                  role="menuitem"
                >
                  <User size={15} />
                  Profile
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate("/change-password")}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                  role="menuitem"
                >
                  <LockKeyhole size={15} />
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                  role="menuitem"
                >
                  <LogOut size={15} />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <nav
        aria-label="Breadcrumb"
        className="flex h-9 items-center border-t border-slate-100 bg-[#f4f7fb] px-4 text-xs sm:px-8 lg:px-12"
      >
        <ol className="flex min-w-0 items-center gap-2">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <li key={item.href} className="flex min-w-0 items-center gap-2">
                {index > 0 && <span className="text-slate-300">/</span>}
                {isLast ? (
                  <span className="truncate font-semibold text-blue-700">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.href}
                    className="truncate text-slate-500 transition hover:text-blue-700"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </header>
  );
}

export default Header;
