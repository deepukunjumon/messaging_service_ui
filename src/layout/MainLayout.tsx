import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout = () => {
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();

  const isMobile = window.innerWidth < 768;
  const isExpanded = hovering || !desktopCollapsed;

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen((v) => !v);
    } else {
      setDesktopCollapsed((v) => !v);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
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
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Drawer Panel */}
        <div
          className={`absolute left-0 top-0 h-full w-72 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700
          transform transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar open={true} variant="mobile" />
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-slate-900 transition-colors">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 text-slate-900 dark:text-slate-100">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
