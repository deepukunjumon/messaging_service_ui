import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { theme } from "../../styles/theme";
import { useTheme } from "../../context/ThemeContext";

const NotFound = () => {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const colors = {
    background: dark ? theme.brand.background.dark : theme.brand.background.light,
    primary: theme.brand.primary.DEFAULT,
    textMuted: theme.brand.text.muted,
    surface: dark ? theme.brand.surface.dark : theme.brand.surface.light,
    border: dark ? theme.brand.border.dark : theme.brand.border.light,
    text: dark ? "#f5f5f5" : "#111111",
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center transition-colors duration-300"
      style={{ backgroundColor: colors.background }}
    >
      {/* Hairline top rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ backgroundColor: colors.border }}
      />

      {/* Content */}
      <div
        className="flex flex-col items-start w-full max-w-xs px-6 transition-all duration-700"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(12px)",
        }}
      >
        {/* Error code */}
        <span
          className="text-xs font-mono tracking-widest uppercase mb-10"
          style={{ color: colors.textMuted }}
        >
          Error — 404
        </span>

        {/* Headline */}
        <h1
          className="text-4xl font-semibold leading-tight tracking-tight mb-4"
          style={{
            color: colors.text,
            letterSpacing: "-0.02em",
          }}
        >
          Page not
          <br />
          found.
        </h1>

        {/* Divider */}
        <div
          className="w-8 h-px mb-6"
          style={{ backgroundColor: colors.primary }}
        />

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-10"
          style={{ color: colors.textMuted, maxWidth: "22ch" }}
        >
          This page doesn't exist or has been moved elsewhere.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center justify-between w-full py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 active:scale-[0.98]"
            style={{
              backgroundColor: colors.primary,
              color: "#ffffff",
            }}
          >
            <span>Back to Dashboard</span>
            <ArrowUpRight
              size={15}
              className="opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150"
            />
          </button>

          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 w-full py-3 px-4 text-sm font-medium transition-all duration-200 active:scale-[0.98]"
            style={{ color: colors.textMuted }}
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-0.5 transition-transform duration-150"
            />
            <span>Go back</span>
          </button>
        </div>
      </div>

      {/* Bottom rule */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ backgroundColor: colors.border }}
      />
    </div>
  );
};

export default NotFound;