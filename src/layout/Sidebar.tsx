import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { sidebarConfig } from "../config/sidebar.config";
import { useState, useEffect } from "react";
import CompanyLogo from "../assets/company-logo.svg";
import CompanyMark from "../assets/company-mark.svg";
import { theme } from "../styles/theme";
import { useTheme } from "../context/ThemeContext";

interface SidebarProps {
  open: boolean;
  variant: "desktop" | "mobile";
}

const Sidebar = ({ open, variant }: SidebarProps) => {
  const isDesktop = variant === "desktop";
  const location = useLocation();
  const { dark } = useTheme();

  const [expanded, setExpanded] = useState<string | null>(null);

  const surfaceBg = dark
    ? theme.brand.surface.dark
    : theme.brand.surface.light;

  const borderColor = dark
    ? theme.brand.border.dark
    : theme.brand.border.light;

  const textColor = dark
    ? theme.brand.text.dark
    : theme.brand.text.primary;

  const mutedText = theme.brand.text.muted;

  const activeBg = theme.brand.secondary;
  const activeText = dark
    ? theme.brand.text.dark
    : theme.brand.primary.dark;

  useEffect(() => {
    const activeGroup = sidebarConfig.find((item) =>
      item.children?.some((child) => child.path === location.pathname)
    );
    setExpanded(activeGroup?.label ?? null);
  }, [location.pathname]);

  const toggleGroup = (label: string) => {
    setExpanded((prev) => (prev === label ? null : label));
  };

  return (
    <aside
      className={[
        "h-full min-h-screen shrink-0 border-r transition-all duration-300 ease-in-out",
        isDesktop ? (open ? "w-64" : "w-16") : "w-72",
      ].join(" ")}
      style={{
        backgroundColor: surfaceBg,
        borderRightColor: borderColor,
        color: textColor,
      }}
    >
      <div className="h-14 flex items-center justify-center relative overflow-hidden">
        <img
          src={CompanyLogo}
          alt="Company Logo"
          className={[
            "h-8 absolute transition-all duration-300",
            open ? "opacity-100 scale-100" : "opacity-0 scale-95",
          ].join(" ")}
        />
        <img
          src={CompanyMark}
          alt="Company"
          className={[
            "h-8 absolute transition-all duration-300",
            open ? "opacity-0 scale-95" : "opacity-100 scale-100",
          ].join(" ")}
        />
      </div>

      <nav className="p-2 space-y-1">
        {sidebarConfig.map((item) => {
          const Icon = item.icon;

          if (item.children) {
            const isOpen = expanded === item.label;

            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleGroup(item.label)}
                  className={[
                    "w-full h-10 rounded-md text-sm flex items-center transition-all duration-200 active:scale-[0.98]",
                    open ? "px-3 justify-between" : "justify-center",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3 font-medium">
                    {Icon && <Icon className="w-5 h-5" />}
                    {open && <span>{item.label}</span>}
                  </div>

                  {open && (
                    <ChevronDown
                      className={[
                        "h-4 w-4 transition-transform duration-300",
                        isOpen ? "rotate-180" : "",
                      ].join(" ")}
                      style={{ color: mutedText }}
                    />
                  )}
                </button>

                <div
                  className={[
                    "overflow-hidden transition-all duration-300",
                    isOpen && open
                      ? "max-h-60 opacity-100 mt-1"
                      : "max-h-0 opacity-0",
                  ].join(" ")}
                >
                  <div className="pl-8 space-y-1">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;

                      return (
                        <NavLink
                          key={child.path}
                          to={child.path!}
                          className={({ isActive }) =>
                            [
                              "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200 active:scale-[0.98] font-medium",
                            ].join(" ")
                          }
                          style={({ isActive }) => ({
                            backgroundColor: isActive
                              ? activeBg
                              : undefined,
                            color: isActive
                              ? activeText
                              : textColor,
                          })}
                        >
                          {ChildIcon && (
                            <ChildIcon className="h-4 w-4" />
                          )}
                          {child.label}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.path || "#"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 h-10 rounded-md text-sm transition-all duration-200 active:scale-[0.98] font-medium",
                  open ? "px-3 justify-start" : "justify-center",
                ].join(" ")
              }
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