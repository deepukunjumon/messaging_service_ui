import { useTheme } from "../context/ThemeContext";
import { Menu, Moon, Sun } from "lucide-react";
import { theme } from "../styles/theme";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const { dark, toggleTheme } = useTheme();

  const bgColor = dark
    ? theme.brand.header.dark
    : theme.brand.header.light;

  const borderColor = dark
    ? theme.brand.border.dark
    : theme.brand.border.light;

  const iconColor = dark
    ? theme.brand.text.dark
    : theme.brand.text.primary;

  const hoverBg =
    theme.brand.primary.DEFAULT + (dark ? "26" : "14");

  return (
    <header
      className="h-14 flex items-center justify-between px-4 sm:px-6 border-b transition-colors duration-300"
      style={{
        backgroundColor: bgColor,
        borderColor,
      }}
    >
      {/* Sidebar Toggle */}
      <button
        aria-label="Toggle sidebar"
        onClick={toggleSidebar}
        className="group h-9 w-9 rounded-md flex items-center justify-center transition-all duration-200 active:scale-95"
        style={{
          backgroundColor: "transparent",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = hoverBg)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
      >
        <Menu
          className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
          style={{ color: iconColor }}
        />
      </button>

      {/* Theme Toggle */}
      <button
        aria-label="Toggle theme"
        onClick={toggleTheme}
        className="group h-9 px-3 rounded-md flex items-center gap-2 transition-all duration-200 active:scale-95"
        style={{
          backgroundColor: "transparent",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = hoverBg)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
      >
        <span className="relative h-4 w-4">
          <Sun
            className={[
              "absolute inset-0 h-4 w-4 transition-all duration-300",
              dark
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 -rotate-90 scale-75",
            ].join(" ")}
            style={{ color: iconColor }}
          />
          <Moon
            className={[
              "absolute inset-0 h-4 w-4 transition-all duration-300",
              dark
                ? "opacity-0 rotate-90 scale-75"
                : "opacity-100 rotate-0 scale-100",
            ].join(" ")}
            style={{ color: iconColor }}
          />
        </span>
      </button>
    </header>
  );
};

export default Navbar;