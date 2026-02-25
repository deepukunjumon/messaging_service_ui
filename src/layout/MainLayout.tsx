import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout = () => {
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close drawer whenever route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close on ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const toggleSidebar = () => {
    // Mobile: open overlay drawer
    if (window.innerWidth < 768) {
      setMobileOpen((v) => !v);
      return;
    }
    // Desktop: collapse rail
    setDesktopOpen((v) => !v);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar open={desktopOpen} variant="desktop" />
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed inset-0 z-50 ${mobileOpen ? "" : "pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Panel */}
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
