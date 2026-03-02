import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { theme } from "../styles/theme";

const MainLayout = () => {
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();
  const isMobile = window.innerWidth < 768;
  const isExpanded = hovering || !desktopCollapsed;

  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen((v) => !v);
    } else {
      setDesktopCollapsed((v) => !v);
    }
  };

  return (
    <div
      className="flex h-screen transition-colors"
      style={{
        backgroundColor: darkMode
          ? theme.brand.background.dark
          : theme.brand.background.light,
        color: darkMode ? theme.brand.text.dark : theme.brand.text.primary,
      }}
    >
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <div
          className="h-full transition-all duration-300 ease-in-out"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <Sidebar open={isExpanded} variant="desktop" />
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed inset-0 z-50 ${
          mobileOpen ? "" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 transition-opacity duration-300 ${
            mobileOpen
              ? `opacity-100 bg-black/40`
              : `opacity-0 pointer-events-none`
          }`}
        />

        {/* Drawer Panel */}
        <div
          className={`absolute left-0 top-0 h-full w-72 border-r transform transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{
            backgroundColor: darkMode
              ? theme.brand.background.dark
              : theme.brand.background.DEFAULT,
            borderColor: darkMode ? "#334155" : "#e6ebf1",
          }}
        >
          <Sidebar open={true} variant="mobile" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar toggleSidebar={toggleSidebar} />

        <main
          className="flex-1 overflow-auto transition-colors"
          style={{
            backgroundColor: darkMode
              ? theme.brand.background.dark
              : theme.brand.background.light,
            color: darkMode ? theme.brand.text.dark : theme.brand.text.primary,
          }}
        >
          <div className="mx-auto px-4 sm:px-6 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
