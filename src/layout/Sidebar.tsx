import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { sidebarConfig } from "../config/sidebar.config";
import { useState, useEffect } from "react";
import CompanyLogo from "../assets/company-logo.svg";
import CompanyMark from "../assets/company-mark.svg";

interface SidebarProps {
  open: boolean;
  variant: "desktop" | "mobile";
}

const Sidebar = ({ open, variant }: SidebarProps) => {
  const isDesktop = variant === "desktop";
  const location = useLocation();
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    sidebarConfig.forEach((item) => {
      if (item.children?.some((child) => child.path === location.pathname)) {
        setExpanded(item.label);
      }
    });
  }, [location.pathname]);

  const toggleGroup = (label: string) => {
    setExpanded((prev) => (prev === label ? null : label));
  };

  return (
    <aside
      className={[
        "h-full min-h-screen shrink-0",
        "border-r border-gray-200 dark:border-slate-700",
        "transition-all duration-300 ease-in-out",
        isDesktop ? (open ? "w-64" : "w-16") : "w-72",
      ].join(" ")}
    >
      {/* Header with Company Logo */}
      <div
        className={`h-14 flex items-center justify-center
        }`}
      >
        {open ? (
          <img
            src={CompanyLogo}
            alt="Company Logo"
            className="h-8 w-auto object-contain"
          />
        ) : (
          <img
            src={CompanyMark}
            alt="Company"
            className="h-8 w-8 object-contain"
          />
        )}
      </div>

      <nav className="p-2 space-y-1">
        {sidebarConfig.map((item) => {
          const Icon = item.icon;
          const hasChildren = !!item.children;
          const isOpen = expanded === item.label;

          if (hasChildren) {
            return (
              <div key={item.label}>
                {/* Parent as button toggling children */}
                <button
                  onClick={() => toggleGroup(item.label)}
                  className={`w-full flex items-center justify-between ${
                    open ? "px-3" : "justify-center"
                  } h-10 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-brand/10 transition`}
                >
                  <div className="flex items-center gap-3">
                    {Icon && <Icon className="ml-3 w-5 h-5" />}
                    {open && <span>{item.label}</span>}
                  </div>
                  {open && (
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  )}
                </button>

                {/* Children */}
                {open && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-60 mt-1" : "max-h-0"}`}
                  >
                    <div className="pl-8 space-y-1">
                      {item.children!.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <NavLink
                            key={child.path}
                            to={child.path!}
                            className={({ isActive }) =>
                              `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
                                isActive
                                  ? "bg-brand/10 text-brand"
                                  : "text-gray-600 dark:text-gray-300 hover:bg-brand/10"
                              }`
                            }
                          >
                            {ChildIcon && <ChildIcon className="h-4 w-4" />}
                            {child.label}
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          } else {
            // No children: render NavLink directly
            return (
              <NavLink
                key={item.label}
                to={item.path || "#"}
                className={({ isActive }) =>
                  `flex items-center gap-3 ${
                    open ? "px-3 justify-start" : "justify-center"
                  } h-10 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-brand/10 transition ${
                    isActive ? "bg-brand/10 text-brand" : ""
                  }`
                }
              >
                {Icon && <Icon className={open ? "ml-3 w-5 h-5" : "w-5 h-5"} />}
                {open && <span>{item.label}</span>}
              </NavLink>
            );
          }
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
