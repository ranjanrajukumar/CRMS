import { useEffect, useState } from "react";

import Footer from "../footer/Footer";
import Header from "../header/Header";
import Menu from "../menu/Menu";

function AppLayout({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("crms-theme") || "light";
  });

  const isDark = theme === "dark";

  useEffect(() => {
    localStorage.setItem("crms-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div
      className={`min-h-screen bg-slate-100 md:flex ${
        isDark ? "theme-dark" : "theme-light"
      }`}
    >
      <Menu />

      <div className="flex min-h-screen flex-1 flex-col">
        <Header isDark={isDark} onToggleTheme={toggleTheme} />
        <main className="flex-1 p-6 md:p-8">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

export default AppLayout;
