import { useTheme } from "../context/ThemeContext";
import { Menu, Moon, Sun } from "lucide-react";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const { dark, toggleTheme } = useTheme();

  return (
    <header className="h-14 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center px-4 sm:px-6 justify-between transition-colors">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          aria-label="Toggle sidebar"
          onClick={toggleSidebar}
          className="h-9 w-9 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center justify-center transition"
        >
          <Menu className="h-5 w-5 text-gray-700 dark:text-gray-200" />
        </button>
      </div>

      {/* Right */}
      <button
        aria-label="Toggle theme"
        onClick={toggleTheme}
        className="h-9 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2 transition"
      >
        {dark ? (
          <>
            <Sun className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </>
        ) : (
          <>
            <Moon className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </>
        )}
      </button>
    </header>
  );
};

export default Navbar;
