function Header({ isDark, onToggleTheme }) {
  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm md:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Customer Relationship Management
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-950">
            Welcome to CRMS
          </h2>
        </div>

        <div className="flex items-center gap-3">
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
