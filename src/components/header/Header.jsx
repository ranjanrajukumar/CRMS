import { Menu } from "lucide-react";

function Header({ isDark, onToggleTheme, onOpenMenu }) {
  return (
    <header className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6 md:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-700 transition hover:bg-slate-200 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Customer Relationship Management
            </p>
            <h2 className="mt-1 truncate text-lg font-bold text-slate-950 sm:text-xl">
              Welcome to CRMS
            </h2>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-lg font-semibold text-slate-700 transition hover:bg-slate-200"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span aria-hidden="true">{isDark ? "☀" : "☾"}</span>
          </button>

          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800">Admin User</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            AU
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
