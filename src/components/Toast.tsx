import { useEffect } from "react";
import { createPortal } from "react-dom";
import { theme } from "../styles/theme";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast = ({
  message,
  type = "success",
  onClose,
  duration = 3000,
}: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const isDark = document.documentElement.classList.contains("dark");

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[9999] animate-slide-in">
      <div
        className="min-w-[250px] max-w-sm rounded-xl px-4 py-3 shadow-lg border text-sm font-medium"
        style={{
          backgroundColor: isDark
            ? theme.brand.surface.dark
            : theme.brand.surface.light,
          borderColor: theme.brand.toast[type],
          color: isDark
            ? theme.brand.text.dark
            : theme.brand.text.primary,
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <span>{message}</span>
          <button
            onClick={onClose}
            className="text-xs opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};