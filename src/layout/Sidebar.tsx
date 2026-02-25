import { NavLink } from "react-router-dom";
import { MessageSquareText } from "lucide-react";

interface SidebarProps {
  open: boolean;
  variant: "desktop" | "mobile";
}

const Sidebar = ({ open, variant }: SidebarProps) => {
  const isDesktop = variant === "desktop";

  return (
    <aside
      className={[
        "h-full shrink-0",
        "bg-white dark:bg-slate-800",
        "border-r border-gray-200 dark:border-slate-700",
        "transition-all duration-300 ease-in-out",
        isDesktop ? (open ? "w-64" : "w-14") : "w-72",
      ].join(" ")}
    >
      {/* Header */}
      <div
        className={[
          "h-14 flex items-center",
          "border-b border-gray-200 dark:border-slate-700",
          isDesktop ? (open ? "px-4" : "px-0 justify-center") : "px-4",
        ].join(" ")}
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand/15 text-brand flex items-center justify-center font-bold">
            M
          </div>

          <span
            className={[
              "text-sm font-semibold text-gray-800 dark:text-gray-100 transition-all duration-300",
              isDesktop && !open
                ? "opacity-0 w-0 overflow-hidden"
                : "opacity-100",
            ].join(" ")}
          >
            Messaging
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="p-2 space-y-1">
        <NavLink
          to="/sms/send"
          className={({ isActive }) =>
            [
              "group relative flex items-center rounded-md h-10 text-sm transition-all duration-200",
              isDesktop ? (open ? "px-3" : "px-0 justify-center") : "px-3",
              isActive
                ? "bg-brand/10 text-brand dark:bg-brand/20"
                : "text-gray-700 dark:text-gray-200 hover:bg-brand/10 dark:hover:bg-brand/20",
            ].join(" ")
          }
        >
          <MessageSquareText className="h-5 w-5" />
          <span
            className={[
              "ml-3 whitespace-nowrap transition-all duration-300",
              isDesktop && !open
                ? "opacity-0 w-0 overflow-hidden"
                : "opacity-100",
            ].join(" ")}
          >
            Send SMS
          </span>

          {isDesktop && !open && (
            <span className="pointer-events-none absolute left-14 top-1/2 -translate-y-1/2 rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition">
              Send SMS
            </span>
          )}
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
