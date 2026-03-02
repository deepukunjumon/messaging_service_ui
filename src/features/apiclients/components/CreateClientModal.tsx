import { useEffect, useState } from "react";
import axios from "../../../services/axios";
import API from "../../../config/api.config";
import { Modal } from "../../../components/Modal";
import { theme } from "../../../styles/theme";
import { useToast } from "../../../hooks/useToast";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateClientModal = ({ open, onClose, onSuccess }: Props) => {
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 theme detection
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

  const colors = {
    primary: theme.brand.primary.DEFAULT,
    text: isDark ? theme.brand.text.dark : theme.brand.text.primary,
    border: isDark ? theme.brand.border.dark : theme.brand.border.light,
    surface: isDark
      ? theme.brand.surface.dark
      : theme.brand.surface.light,
  };

  const { showToast, ToastRenderer } = useToast();
  
  const resetForm = () => {
    setClientName("");
    setDescription("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!clientName.trim()) {
      showToast("Client name is required", "warning");
      return;
    }
  
    try {
      setLoading(true);
  
      await axios.post(API.API_CLIENTS.CREATE, {
        clientName,
        description,
      });
  
      showToast("Client created successfully", "success");
  
      resetForm();
      onSuccess();
      onClose();
    } catch (err: any) {
        console.error("Create failed:", err);
      
        const backendError = err?.response?.data?.error;
      
        let errorMessage =
          backendError?.details
            ? Object.values(backendError.details)[0]
            : backendError?.message ||
              err?.message ||
              "Failed to create client";
      
        showToast(errorMessage as string, "error");
      } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || !clientName.trim();

  return (
    <>
      <Modal open={open} onClose={handleClose} title="Create API Client">
        <div className="space-y-4">
          {/* Client Name */}
          <div>
            <label
              className="text-sm font-medium"
              style={{ color: colors.text }}
            >
              Client Name
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="mt-1 w-full rounded-lg border px-4 py-2 text-sm outline-none focus:ring-2 transition"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
                "--tw-ring-color": `${colors.primary}66`,
              } as any}
            />
          </div>
  
          {/* Description */}
          <div>
            <label
              className="text-sm font-medium"
              style={{ color: colors.text }}
            >
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-lg border px-4 py-2 text-sm outline-none focus:ring-2 transition"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
                "--tw-ring-color": `${colors.primary}66`,
              } as any}
            />
          </div>
  
          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-lg text-sm border transition"
              style={{
                borderColor: colors.border,
                color: colors.text,
              }}
            >
              Cancel
            </button>
  
            <button
              onClick={handleSubmit}
              disabled={isDisabled}
              className="px-4 py-2 rounded-lg text-sm text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.primary }}
            >
              {loading ? "Creating..." : "Create Client"}
            </button>
          </div>
        </div>
      </Modal>
  
      {/* 🔥 Toast Renderer */}
      <ToastRenderer />
    </>
  );
};