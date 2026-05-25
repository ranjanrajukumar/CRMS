import { useCallback, useEffect, useMemo, useState } from "react";

import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import Menu from "../components/menu/Menu";
import { ThemeContext } from "../hooks/useTheme";

function AppLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("crms-theme") || "light";
  });
  const [colorTheme, setColorTheme] = useState(() => {
    return localStorage.getItem("crms-color-theme") || "blue";
  });

  const isDark = theme === "dark";

  useEffect(() => {
    localStorage.setItem("crms-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("crms-color-theme", colorTheme);
  }, [colorTheme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  const themeContextValue = useMemo(
    () => ({
      colorTheme,
      isDark,
      setColorTheme,
      setTheme,
      theme,
      toggleTheme,
    }),
    [colorTheme, isDark, theme]
  );

  const openMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(true);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <div
        className={`min-h-screen bg-slate-100 flex theme-color-${colorTheme} ${
          isDark ? "theme-dark" : "theme-light"
        }`}
      >
        <Menu
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={closeMobileMenu}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
        />

        <div
          className={`flex min-h-screen min-w-0 flex-1 flex-col transition-all duration-300 ${
            isSidebarOpen ? "lg:ml-[250px]" : "lg:ml-[76px]"
          }`}
        >
          <Header
            isDark={isDark}
            onToggleTheme={toggleTheme}
            onOpenMenu={openMobileMenu}
          />
          <main className="flex-1 px-4 py-5 sm:px-6 md:p-8">{children}</main>
          <Footer />
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default AppLayout;
