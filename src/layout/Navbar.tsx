import { useTheme } from "../context/ThemeContext";
import { Menu, Moon, Sun } from "lucide-react";
import { theme } from "../styles/theme";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const { dark, toggleTheme } = useTheme();

  const bgColor = dark
    ? theme.brand.background.dark
    : theme.brand.background.DEFAULT;
  const borderColor = dark ? "#334155" : "#e6ebf1";
  const iconColor = dark ? theme.brand.text.dark : theme.brand.text.DEFAULT;
  const hoverBg = dark ? "#1e293b33" : "#e2f3f5";

  return (
    <header
      className="h-14 flex items-center px-4 sm:px-6 justify-between transition-colors"
      style={{
        backgroundColor: bgColor,
        borderBottom: `1px solid ${borderColor}`,
      }}
    >
      {/* Left: Sidebar Toggle */}
      <div className="flex items-center gap-3">
        <button
          aria-label="Toggle sidebar"
          onClick={toggleSidebar}
          className="h-9 w-9 rounded-md flex items-center justify-center transition"
          style={{ backgroundColor: "transparent" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = hoverBg)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <Menu className="h-5 w-5" style={{ color: iconColor }} />
        </button>
      </div>

      {/* Right: Theme Toggle */}
      <button
        aria-label="Toggle theme"
        onClick={toggleTheme}
        className="h-9 px-3 rounded-md flex items-center gap-2 transition"
        style={{ backgroundColor: "transparent" }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverBg)}
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
      >
        {dark ? (
          <Sun className="h-4 w-4" style={{ color: iconColor }} />
        ) : (
          <Moon className="h-4 w-4" style={{ color: iconColor }} />
        )}
      </button>
    </header>
  );
};

export default Navbar;
