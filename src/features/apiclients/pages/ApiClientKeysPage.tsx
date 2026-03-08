import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../services/axios";
import API from "../../../config/api.config";
import { DataTable } from "../../../components/DataTable";
import { Loader } from "../../../components/Loader";
import { theme } from "../../../styles/theme";
import type { APIClientKeys } from "../type/apiClientKeys.types";
import { apiClientKeysColumns } from "../config/apiClientKeys.columns";
import { useToast } from "../../../hooks/useToast";
import { ChevronRight, KeyRound } from "lucide-react";
import { Modal } from "../../../components/Modal";

const APIClientKeysPage = () => {
  const { clientId } = useParams<{ clientId: string }>();

  const [keys, setKeys] = useState<APIClientKeys[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark"),
  );
  const [showGenerateConfirm, setShowGenerateConfirm] = useState(false);
  const { showToast, ToastRenderer } = useToast();

  const navigate = useNavigate();

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
    primary: isDark ? theme.brand.primary.dark : theme.brand.primary.light,
    text: isDark ? theme.brand.text.dark : theme.brand.text.primary,
    muted: theme.brand.text.muted,
    border: isDark ? theme.brand.border.dark : theme.brand.border.light,
    surface: isDark ? theme.brand.surface.dark : theme.brand.surface.light,
    background: isDark
      ? theme.brand.background.dark
      : theme.brand.background.light,
  };

  const clientName = "";

  // Fetch Keys
  const fetchKeys = async () => {
    if (!clientId) return;

    setLoading(true);

    try {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
      });

      if (search) params.append("q", search);

      const res = await axios.get(
        `${API.API_CLIENTS.LIST}/${clientId}/keys?${params.toString()}`,
      );

      setKeys(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch keys", err);
      setKeys([]);
    } finally {
      setLoading(false);
    }
  };

  // Generate Key
  const generateKey = async () => {
    if (!clientId) return;

    setLoading(true);
    try {
      const url = API.API_KEYS.GENERATE.replace("{clientId}", clientId);

      const res = await axios.post(url);
      showToast(res.data?.data?.message, "success");

      await fetchKeys();
    } catch (err) {
      console.error("Failed to generate key:", err);
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
    const delayDebounceFn = setTimeout(() => fetchKeys(), 300);
    return () => clearTimeout(delayDebounceFn);
  }, [clientId, search, limit, offset]);

  /* ---------------- COLUMNS ---------------- */
  const columns = apiClientKeysColumns(handleStatusChange);

  return (
    <>
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex flex-wrap gap-1">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Home
          </span>
          <span>
            <ChevronRight size={14} style={{ marginTop: "5px" }} />
          </span>
          <span
            className="cursor-pointer hover:underline"
            onClick={() => navigate("/api-clients")}
          >
            API Clients
          </span>
          <span>
            <ChevronRight size={14} style={{ marginTop: "5px" }} />
          </span>
          <span>API Keys</span>
        </div>
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: colors.primary }}
            >
              API Keys
            </h1>
            <p className="mt-1 text-sm" style={{ color: colors.muted }}>
              Manage API keys for {clientName}.
            </p>
          </div>
          <div className="flex items-start sm:items-center">
            <button
              onClick={() => setShowGenerateConfirm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition hover:opacity-90 hover:scale-[1.02] active:scale-[0.97] bg-green-600 hover:bg-green-700"
            >
              <KeyRound className="w-4 h-4" />
              <span>Generate New Key</span>
            </button>
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
          {/* Search */}
          <div
            className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: colors.border }}
          >
            <h2 className="text-m font-bold" style={{ color: colors.text }}>
              Client List
            </h2>

            <div className="w-full sm:w-72">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-lg border px-4 py-2 text-sm transition-all outline-none focus:ring-2"
                style={
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text,
                    "--tw-ring-color": `${colors.primary}66`,
                  } as any
                }
              />
            </div>
          </div>

          {/* Table Body */}
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
                <Loader text={"Loading API keys..."} size="md" />
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

      {/*Confirmation */}
      <Modal
        open={showGenerateConfirm}
        title="Generate API Key"
        onClose={() => setShowGenerateConfirm(false)}
        showCloseButton={false}
      >
        <div className="space-y-4">
          <p className="text-sm">
            Are you sure you want to generate a new API key for this client?
            This action will create a new key immediately.
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowGenerateConfirm(false)}
              className="px-4 py-2 text-sm rounded-md border"
              style={{
                borderColor: colors.border,
                color: colors.text,
              }}
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                setShowGenerateConfirm(false);
                await generateKey();
              }}
              className="px-4 py-2 text-sm rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Generate Key
            </button>
          </div>
        </div>
      </Modal>
      <ToastRenderer />
    </>
  );
};

export default APIClientKeysPage;
