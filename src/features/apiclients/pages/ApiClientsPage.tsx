import { useEffect, useState } from "react";
import axios from "../../../services/axios";
import API from "../../../config/api.config";

import { DataTable } from "../../../components/DataTable";
import { apiClientColumns } from "../config/apiClients.columns";
import type { APIClient } from "../type/apiClients.types";
import { Loader } from "../../../components/Loader";
import { theme } from "../../../styles/theme";
import { CreateClientModal } from "../components/CreateClientModal";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const APIClientsPage = () => {
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
    primary: isDark ? theme.brand.primary.dark : theme.brand.primary.light,
    text: isDark ? theme.brand.text.dark : theme.brand.text.primary,
    muted: theme.brand.text.muted,
    border: isDark ? theme.brand.border.dark : theme.brand.border.light,
    surface: isDark ? theme.brand.surface.dark : theme.brand.surface.light,
    background: isDark
      ? theme.brand.background.dark
      : theme.brand.background.light,
  };

  const navigate = useNavigate();

  const handleEdit = (row: APIClient) => {
    console.log("Edit:", row);
  };

  const handleDelete = (row: APIClient) => {
    console.log("Delete:", row);
  };

  const [clients, setClients] = useState<APIClient[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);
  const [openCreate, setOpenCreate] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
      });

      if (search) params.append("q", search);

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
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: colors.primary }}
          >
            API Clients
          </h1>
          <p className="mt-1 text-sm" style={{ color: colors.muted }}>
            Manage registered clients and their respective API authentication
            keys within the secure vault.
          </p>
        </div>

        <div className="flex items-start sm:items-center">
          <button
            onClick={() => setOpenCreate(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition hover:opacity-90 hover:scale-[1.02] active:scale-[0.97] bg-green-600 hover:bg-green-700"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create</span>
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div
        className="rounded-2xl border shadow-sm overflow-hidden"
        style={{ backgroundColor: colors.surface, borderColor: colors.border }}
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
              <Loader text="Loading..." size="md" />
            </div>
          )}

          <DataTable<APIClient>
            columns={apiClientColumns(handleEdit, handleDelete)}
            data={clients}
            pageSize={limit}
            showSerialNumber
            onRowClick={(row) => navigate(`/api-clients/${row.id}/keys`)}
          />
        </div>
      </div>

      <CreateClientModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={fetchClients}
      />
    </div>
  );
};

export default APIClientsPage;
