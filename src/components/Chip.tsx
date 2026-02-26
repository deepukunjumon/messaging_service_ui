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
  variant?: "filled" | "outlined" | "soft";
  size?: "small" | "medium" | "large";
  onClick?: () => void;
  onDelete?: () => void;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  color = "default",
  variant = "soft",
  size = "medium",
  onClick,
  onDelete,
}) => {
  const sizeStyles = {
    small:
      "px-2.5 py-1 text-[10px] uppercase tracking-[0.08em] font-bold gap-1.5",
    medium: "px-3 py-1.5 text-[11px] font-semibold gap-2",
    large: "px-4 py-2 text-xs font-semibold gap-2.5",
  };

  const colorConfigs = {
    primary: {
      ring: "ring-teal-500/30",
      bg: "bg-teal-500",
      text: "text-teal-700 dark:text-teal-300",
      soft: "bg-teal-100 dark:bg-teal-500/10",
      border: "border-teal-200/50 dark:border-teal-500/20",
    },
    success: {
      ring: "ring-emerald-500/30",
      bg: "bg-emerald-500",
      text: "text-emerald-700 dark:text-emerald-300",
      soft: "bg-emerald-100 dark:bg-emerald-500/10",
      border: "border-emerald-200/50 dark:border-emerald-500/20",
    },
    danger: {
      ring: "ring-rose-500/30",
      bg: "bg-rose-500",
      text: "text-rose-700 dark:text-rose-300",
      soft: "bg-rose-100 dark:bg-rose-500/10",
      border: "border-rose-200/50 dark:border-rose-500/20",
    },
    warning: {
      ring: "ring-amber-500/30",
      bg: "bg-amber-500",
      text: "text-amber-700 dark:text-amber-300",
      soft: "bg-amber-100 dark:bg-amber-500/10",
      border: "border-amber-200/50 dark:border-amber-500/20",
    },
    secondary: {
      ring: "ring-slate-500/30",
      bg: "bg-slate-600",
      text: "text-slate-700 dark:text-slate-300",
      soft: "bg-slate-100 dark:bg-slate-800",
      border: "border-slate-200 dark:border-slate-700",
    },
    default: {
      ring: "ring-slate-300/30",
      bg: "bg-slate-200",
      text: "text-slate-600 dark:text-slate-400",
      soft: "bg-transparent",
      border: "border-slate-200 dark:border-slate-800",
    },
  };

  const config = colorConfigs[color];

  const variantStyles = {
    filled: `${config.bg} text-white shadow-sm ring-1 ring-inset ${config.ring}`,
    outlined: `border ${config.border} ${config.text} bg-transparent`,
    soft: `border ${config.border} ${config.text} ${config.soft}`,
  };

  return (
    <div
      onClick={onClick}
      className={`
        inline-flex items-center rounded-full select-none transition-all duration-200
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${onClick ? "cursor-pointer hover:filter hover:brightness-105 active:scale-95" : ""}
      `}
    >
      {/* The Status Indicator Dot */}
      {color !== "default" && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {color === "warning" && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${variant === "filled" ? "bg-white" : config.bg}`}
            ></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-1.5 w-1.5 ${variant === "filled" ? "bg-white" : config.bg}`}
          ></span>
        </span>
      )}

      <span className="leading-none whitespace-nowrap">{label}</span>

      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-60 hover:opacity-100 transition-opacity ml-0.5"
        >
          <svg
            className={size === "small" ? "w-2.5 h-2.5" : "w-3 h-3"}
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
