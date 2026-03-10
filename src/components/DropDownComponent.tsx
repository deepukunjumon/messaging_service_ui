import { useEffect, useRef, useState } from "react";
import { theme } from "../styles/theme";
import { ChevronDown } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface DropDownProps {
  label?: string;
  options: Option[];
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  isSearchable?: boolean;
  onChange: (value: string) => void;
  onSearch?: (q: string) => void;
}

const DropDownComponent = ({
  label,
  options,
  value,
  placeholder = "Select option",
  disabled = false,
  isSearchable = false,
  onChange,
  onSearch,
}: DropDownProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark"),
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const colors = {
    primary: theme.brand.primary.DEFAULT,
    text: isDark ? theme.brand.text.dark : theme.brand.text.primary,
    surface: isDark ? theme.brand.surface.dark : theme.brand.surface.light,
    border: isDark ? theme.brand.border.dark : theme.brand.border.light,
    muted: theme.brand.text.muted,
  };

  const selected = options.find((o) => o.value === value);

  const filteredOptions = options;

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="w-full" ref={dropdownRef}>
      {label && (
        <label className="text-sm font-medium" style={{ color: colors.text }}>
          {label}
        </label>
      )}

      <div className="relative mt-2">
        {/* Trigger */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm transition outline-none focus:ring-2"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: disabled ? colors.muted : colors.text,
            cursor: disabled ? "not-allowed" : "pointer",
            ["--tw-ring-color" as any]: `${colors.primary}66`,
          }}
        >
          <span>{selected ? selected.label : placeholder}</span>

          <ChevronDown
            size={18}
            className={`transition ${open ? "rotate-180" : ""}`}
            style={{ color: colors.muted }}
          />
        </button>

        {/* Dropdown */}
        {open && !disabled && (
          <div
            className="absolute z-50 mt-2 w-full rounded-xl border shadow-lg overflow-hidden"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
          >
            {/* Search */}
            {isSearchable && (
              <div
                className="p-2 border-b"
                style={{ borderColor: colors.border }}
              >
                <input
                  value={search}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearch(val);
                    onSearch?.(val);
                  }}
                  placeholder="Search..."
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text,
                  }}
                />
              </div>
            )}

            {/* Options */}
            <div
              className="overflow-y-auto dropdown-scroll"
              style={{
                maxHeight: "220px",
              }}
            >
              {filteredOptions.length === 0 && (
                <div
                  className="px-4 py-3 text-sm"
                  style={{ color: colors.muted }}
                >
                  No results
                </div>
              )}

              {filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className="w-full text-left px-4 py-2 text-sm transition"
                  style={{
                    backgroundColor:
                      value === opt.value
                        ? isDark
                          ? "#1e293b"
                          : "#f8fafc"
                        : "transparent",
                    color: colors.text,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = isDark
                      ? "#1e293b"
                      : "#f1f5f9")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      value === opt.value
                        ? isDark
                          ? "#1e293b"
                          : "#f8fafc"
                        : "transparent")
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropDownComponent;
