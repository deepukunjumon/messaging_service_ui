import React from "react";

interface LoaderProps {
  variant?: "full" | "section";
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  variant = "section",
  text,
}) => {
  const isFull = variant === "full";

  return (
    <div
      className={`
        flex flex-col items-center justify-center
        ${isFull ? "fixed inset-0 z-[100] bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm" : "w-full h-full py-12"}
      `}
    >
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="w-12 h-12 border-4 border-teal-500/20 rounded-full animate-spin border-t-teal-500" />

        {/* Inner Pulsing Core */}
        <div className="absolute w-4 h-4 bg-teal-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(20,184,166,0.5)]" />
      </div>

      {text && (
        <p className="mt-4 text-xs font-bold tracking-[0.2em] text-slate-500 dark:text-slate-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};
