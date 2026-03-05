import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../services/axios";
import API from "../../../config/api.config";
import { DataTable } from "../../../components/DataTable";
import { Loader } from "../../../components/Loader";
import { theme } from "../../../styles/theme";
import type { APIClientKeys } from "../type/apiClientKeys.types";
import { apiClientKeysColumns } from "../config/apiClientKeys.columns";
import { useToast } from "../../../hooks/useToast";

const APIClientKeysPage = () => {
  const { clientId } = useParams<{ clientId: string }>();

  const [keys, setKeys] = useState<APIClientKeys[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark"),
  );

  const { showToast, ToastRenderer } = useToast();

  /* ---------------- DARK MODE ---------------- */
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
    muted: theme.brand.text.muted,
    border: isDark ? theme.brand.border.dark : theme.brand.border.light,
    surface: isDark ? theme.brand.surface.dark : theme.brand.surface.light,
    background: isDark
      ? theme.brand.background.dark
      : theme.brand.background.light,
  };

  /* ---------------- FETCH KEYS ---------------- */
  const fetchKeys = async () => {
    if (!clientId) return;

    setLoading(true);
    try {
      const res = await axios.get(`${API.API_CLIENTS.LIST}/${clientId}/keys`);

      setKeys(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch keys", err);
      setKeys([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UPDATE STATUS ---------------- */
  const handleStatusChange = async (apiKeyId: string, status: number) => {
    if (!apiKeyId) return;

    try {
      // Optimistic update
      setKeys((prev) =>
        prev.map((k) => (k.id === apiKeyId ? { ...k, status } : k)),
      );

      const res = await axios.put(
        API.API_KEYS.UPDATE_STATUS.replace("{apiKeyId}", apiKeyId),
        { status },
      );

      showToast(res.data?.data?.message, "success");
    } catch (err) {
      console.error("Failed to update status", err);

      // Revert if API fails
      fetchKeys();
    }
  };

  useEffect(() => {
    fetchKeys();
  }, [clientId]);

  /* ---------------- COLUMNS ---------------- */
  const columns = apiClientKeysColumns(handleStatusChange);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: colors.text }}
            >
              API Keys
            </h1>
            <p className="mt-1 text-sm" style={{ color: colors.muted }}>
              Manage API keys for the client.
            </p>
          </div>
        </div>

        {/* Table Card */}
        <div
          className="rounded-2xl border shadow-sm overflow-hidden"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <div className="relative">
            {loading && (
              <div
                className="absolute inset-0 z-40 flex flex-col items-center justify-center backdrop-blur-sm"
                style={{
                  backgroundColor: isDark
                    ? "rgba(11, 18, 25, 0.7)"
                    : "rgba(248, 250, 252, 0.7)",
                }}
              >
                <Loader />
                <span
                  className="mt-4 text-[10px] font-black uppercase tracking-[0.2em]"
                  style={{ color: colors.primary }}
                >
                  Loading Keys
                </span>
              </div>
            )}

            <DataTable<APIClientKeys>
              columns={columns}
              data={keys}
              pageSize={50}
              showSerialNumber
            />
          </div>
        </div>
      </div>
      <ToastRenderer />
    </>
  );
};

export default APIClientKeysPage;
