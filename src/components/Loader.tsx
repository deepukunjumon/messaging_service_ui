import React, { useState } from "react";
import { theme } from "../styles/theme";

interface LoaderProps {
  variant?: "full" | "section";
  text?: string;
  size?: "sm" | "md" | "lg";
}

export const Loader: React.FC<LoaderProps> = ({
  variant = "section",
  text,
  size = "md",
}) => {
  const isFull = variant === "full";

  const [isDark] = useState(
    document.documentElement.classList.contains("dark"),
  );

  // Mapping sizes to Tailwind classes
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-16 h-16 border-[6px]",
  };

  const colors = {
    primary: isDark ? theme.brand.primary.dark : theme.brand.primary.light,
  };

  return (
    <div
      className={`
        flex flex-col items-center justify-center
        ${isFull ? "fixed inset-0 z-40 bg-white/90 dark:bg-slate-900/90" : "w-full min-h-[200px]"}
      `}
    >
      {/* Standard Circular Spinner */}
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full 
          animate-spin 
          border-slate-200 
          dark:border-slate-400
        `}
        style={{
          borderTopColor: colors.primary,
        }}
      />

      {text && (
        <span
          className="mt-4 text-sm font-medium dark:text-slate-400"
          style={{
            color: colors.primary,
          }}
        >
          {text}
        </span>
      )}
    </div>
  );
};
