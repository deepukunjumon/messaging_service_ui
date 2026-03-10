import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { sidebarConfig } from "../config/sidebar.config";
import { useState, useEffect } from "react";
import CompanyLogo from "../assets/company-logo.svg";
import CompanyMark from "../assets/company-mark.svg";
import { theme } from "../styles/theme";

interface SidebarProps {
  open: boolean;
  variant: "desktop" | "mobile";
}

const Sidebar = ({ open, variant }: SidebarProps) => {
  const isDesktop = variant === "desktop";
  const location = useLocation();

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark"),
  );
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const observer = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("dark")),
    );
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const surfaceBg = isDark
    ? theme.brand.surface.dark
    : theme.brand.surface.light;
  const borderColor = isDark
    ? theme.brand.border.dark
    : theme.brand.border.light;
  const textColor = isDark ? theme.brand.text.dark : theme.brand.text.primary;
  const mutedText = isDark ? theme.brand.text.muted : theme.brand.text.muted;

  const activeBg = isDark
    ? theme.brand.secondary.dark
    : theme.brand.secondary.light;
  const activeText = isDark ? theme.brand.text.dark : theme.brand.text.primary;

  useEffect(() => {
    const activeGroup = sidebarConfig.find((item) =>
      item.children?.some((child) => child.path === location.pathname),
    );
    setExpanded(activeGroup?.label ?? null);
  }, [location.pathname]);

  const toggleGroup = (label: string) => {
    setExpanded((prev) => (prev === label ? null : label));
  };

  return (
    <aside
      className={`h-full min-h-screen shrink-0 border-r transition-all duration-300 z-50 ${
        isDesktop ? (open ? "w-64" : "w-16") : "w-72"
      }`}
      style={{
        backgroundColor: surfaceBg,
        borderRightColor: borderColor,
        color: textColor,
      }}
    >
      {/* Logo */}
      <div className="h-14 flex items-center justify-center relative overflow-hidden">
        <img
          src={CompanyLogo}
          alt="Company Logo"
          className={`h-8 absolute transition-all duration-300 ${
            open ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        />
        <img
          src={CompanyMark}
          alt="Company"
          className={`h-8 absolute transition-all duration-300 ${
            open ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        />
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1">
        {sidebarConfig.map((item) => {
          const Icon = item.icon;

          // Group with children
          if (item.children) {
            const isOpen = expanded === item.label;

            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleGroup(item.label)}
                  className={`w-full h-10 rounded-md text-sm flex items-center transition-all duration-200 active:scale-[0.98] ${
                    open ? "px-3 justify-between" : "justify-center"
                  }`}
                  style={{ color: textColor }}
                >
                  <div className="flex items-center gap-3 font-medium">
                    {Icon && <Icon className="w-5 h-5" />}
                    {open && <span>{item.label}</span>}
                  </div>

                  {open && (
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      style={{ color: mutedText }}
                    />
                  )}
                </button>

                {/* Children */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen && open
                      ? "max-h-60 opacity-100 mt-1"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pl-8 space-y-1">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <NavLink
                          key={child.path}
                          to={child.path!}
                          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200 active:scale-[0.98] font-medium hover:bg-secondary-light hover:text-primary-dark"
                          style={({ isActive }) => ({
                            backgroundColor: isActive ? activeBg : undefined,
                            color: isActive ? activeText : textColor,
                          })}
                        >
                          {ChildIcon && <ChildIcon className="h-4 w-4" />}
                          {child.label}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }

          // Single link
          return (
            <NavLink
              key={item.label}
              to={item.path || "#"}
              className={`flex items-center gap-3 h-10 rounded-md text-sm transition-all duration-200 active:scale-[0.98] font-medium ${
                open ? "px-3 justify-start" : "justify-center"
              } hover:bg-secondary-light hover:text-primary-dark`}
              style={({ isActive }) => ({
                backgroundColor: isActive ? activeBg : undefined,
                color: isActive ? activeText : textColor,
              })}
            >
              {Icon && <Icon className="w-5 h-5" />}
              {open && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
