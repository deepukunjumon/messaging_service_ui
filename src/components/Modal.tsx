import { type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { theme } from "../styles/theme";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
  showCloseButton?: boolean;
}

export const Modal = ({
  open,
  title,
  onClose,
  children,
  showCloseButton = true,
}: ModalProps) => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark"),
  );

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
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", escHandler);
    return () => document.removeEventListener("keydown", escHandler);
  }, [onClose]);

  if (!open) return null;

  const colors = {
    primary: theme.brand.primary.DEFAULT,
    text: isDark ? theme.brand.text.dark : theme.brand.text.primary,
    surface: isDark
      ? theme.brand.surface.dark
      : theme.brand.surface.light,
    border: isDark
      ? theme.brand.border.dark
      : theme.brand.border.light,
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl shadow-xl border p-6"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
          color: colors.text,
        }}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between mb-4">
            {title && (
              <h2 className="text-lg font-semibold">
                {title}
              </h2>
            )}

            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-sm font-medium hover:opacity-70 transition"
                style={{ color: colors.primary }}
              >
                <X/>
              </button>
            )}
          </div>
        )}

        {children}
      </div>
    </div>,
    document.body
  );
};