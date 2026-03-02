import { useState } from "react";
import { Toast, type ToastType } from "../components/Toast";

export const useToast = () => {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type });
  };

  const ToastRenderer = () =>
    toast ? (
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)}
      />
    ) : null;

  return { showToast, ToastRenderer };
};