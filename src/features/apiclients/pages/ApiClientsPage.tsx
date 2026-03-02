import { useEffect, useState } from "react";
import axios from "../../../services/axios";
import API from "../../../config/api.config";

import { DataTable } from "../../../components/DataTable";
import { apiClientColumns } from "../config/apiClients.columns";
import type { APIClient } from "../type/apiClients.types";
import { Loader } from "../../../components/Loader";
import { theme } from "../../../styles/theme";

const APIClientsPage = () => {
  // Theme state detection
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
    muted: theme.brand.text.muted,
    border: isDark ? theme.brand.border.dark : theme.brand.border.light,
    surface: isDark ? theme.brand.surface.dark : theme.brand.surface.light,
    background: isDark
      ? theme.brand.background.dark
      : theme.brand.background.light,
  };

  const [clients, setClients] = useState<APIClient[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
        ...(search && { q: search }),
      });
      const res = await axios.get(
        `${API.API_CLIENTS.LIST}?${params.toString()}`,
      );
      setClients(res.data?.data || []);
    } catch (e) {
      console.error("Fetch failed:", e);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => fetchClients(), 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, limit, offset]);

  return (
    <div className="space-y-6">
      {/* Page Header - Matches SendSmsPage structure */}
      <div>
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: isDark ? colors.text : colors.primary }}
        >
          API Clients
        </h1>
        <p className="mt-1 text-sm" style={{ color: colors.muted }}>
          Manage registered clients and their respective API authentication keys
          within the secure vault.
        </p>
      </div>

      <div
        className="rounded-2xl border shadow-sm overflow-hidden"
        style={{ backgroundColor: colors.surface, borderColor: colors.border }}
      >
        {/* Card Header */}
        <div
          className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: colors.border }}
        >
          <div>
            <h2
              className="text-m font-bold"
              style={{ color: colors.text }}
            >
              Client List
            </h2>
          </div>

          {/* Search Box inside Header */}
          <div className="w-full sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by client name..."
              className="w-full rounded-lg border px-4 py-2 text-sm transition-all outline-none focus:ring-2"
              style={
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                  // Applying the dynamic ring color variable used in your SendSms inputs
                  "--tw-ring-color": `${colors.primary}66`,
                } as any
              }
            />
          </div>
        </div>

        {/* Card Body - Containing DataTable */}
        <div className="relative">
          {loading && (
            <div
              className="absolute inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-sm transition-all"
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
                Refreshing Data
              </span>
            </div>
          )}

          <DataTable<APIClient>
            columns={apiClientColumns}
            data={clients}
            pageSize={limit}
          />
        </div>
      </div>
    </div>
  );
};

export default APIClientsPage;
