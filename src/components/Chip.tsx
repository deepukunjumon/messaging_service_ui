import React from "react";

export interface ChipProps {
  label: string;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning";
  size?: "small" | "medium" | "large";
  onClick?: () => void;
  onDelete?: () => void;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  color = "default",
  size = "medium",
  onClick,
  onDelete,
}) => {
  /* ---------------- SIZE ---------------- */

  const sizeStyles = {
    small: "px-2.5 py-1 text-[11px] gap-1.5",
    medium: "px-3 py-1.2 text-xs gap-2",
    large: "px-4 py-1.5 text-sm gap-2.5",
  };

  /* ---------------- COLOR CONFIG ---------------- */

  const colorConfigs = {
    primary: {
      text: "text-teal-500",
      border: "border-teal-500/40",
      bg: "bg-teal-50 dark:bg-teal-500/10",
    },
    success: {
      text: "text-emerald-500",
      border: "border-emerald-500/40",
      bg: "bg-emerald-100 dark:bg-emerald-500/10",
    },
    danger: {
      text: "text-rose-500",
      border: "border-rose-500/40",
      bg: "bg-rose-50 dark:bg-rose-500/10",
    },
    warning: {
      text: "text-amber-500",
      border: "border-amber-500/40",
      bg: "bg-amber-50 dark:bg-amber-500/10",
    },
    secondary: {
      text: "text-slate-500",
      border: "border-slate-500/40",
      bg: "bg-slate-100 dark:bg-slate-500/10",
    },
    default: {
      text: "text-slate-500",
      border: "border-slate-400/40",
      bg: "bg-slate-100 dark:bg-slate-500/10",
    },
  };

  const config = colorConfigs[color];

  /* ---------------- COMPONENT ---------------- */

  return (
    <div
      onClick={onClick}
      className={`
        inline-flex items-center
        rounded-full
        border
        font-medium
        select-none
        transition-all duration-200
        ${sizeStyles[size]}
        ${config.text}
        ${config.border}
        ${config.bg}
        ${
          onClick
            ? "cursor-pointer hover:brightness-110 active:scale-95"
            : ""
        }
      `}
    >
      {/* Label */}
      <span className="leading-none whitespace-nowrap">
        {label}
      </span>

      {/* Delete Button */}
      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-60 hover:opacity-100 transition-opacity"
        >
          <svg
            className={size === "small" ? "w-3 h-2.5" : "w-3 h-3"}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};