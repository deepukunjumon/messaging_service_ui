import { useEffect, useState, useRef } from "react";
import axios from "../../../services/axios";
import API from "../../../config/api.config";

import { DataTable } from "../../../components/DataTable";
import type { OutgoingMessage } from "../types/outgoingMessages.types";
import { outgoingMessageColumns } from "../config/outgoingMessages.columns";
import { Loader } from "../../../components/Loader";
import { theme } from "../../../styles/theme";
import { ChevronDown, FileSpreadsheet } from "lucide-react";

const CHANNELS = ["all", "sms", "email", "whatsapp"] as const;

const OutgoingMessagesPage = () => {
  /* ---------------- THEME DETECTION ---------------- */
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

  /* ---------------- STATE ---------------- */
  const [messages, setMessages] = useState<OutgoingMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const [search, setSearch] = useState("");
  const [channel, setChannel] =
    useState<(typeof CHANNELS)[number]>("all");
  const [clientId, setClientId] = useState("");

  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  const exportRef = useRef<HTMLDivElement | null>(null);

  /* ---------------- CLOSE DROPDOWN ON OUTSIDE CLICK ---------------- */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        exportRef.current &&
        !exportRef.current.contains(event.target as Node)
      ) {
        setShowExportMenu(false);
      }
    };

    if (showExportMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showExportMenu]);

  /* ---------------- FETCH ---------------- */
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
      });

      if (search) params.append("q", search);
      if (channel !== "all") params.append("channel", channel);
      if (clientId) params.append("client_id", clientId);

      const res = await axios.get(
        `${API.OUTGOING_MESSAGES.LIST}?${params.toString()}`
      );

      setMessages(res.data?.data || []);
      setTotal(res.data?.total || 0);
    } catch (error) {
      console.error("Fetch failed:", error);
      setMessages([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- EXPORT ---------------- */
  const handleExport = async (exportType: "csv" | "pdf") => {
    try {
      const params = new URLSearchParams({
        export: "true",
        type: exportType,
      });

      if (search) params.append("q", search);
      if (channel !== "all") params.append("channel", channel);
      if (clientId) params.append("client_id", clientId);

      const res = await axios.get(
        `${API.OUTGOING_MESSAGES.LIST}?${params.toString()}`,
        { responseType: "blob" }
      );

      const mime =
        exportType === "pdf"
          ? "application/pdf"
          : "text/csv";

      const blob = new Blob([res.data], { type: mime });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download =
        exportType === "pdf"
          ? "outgoing-messages.pdf"
          : "outgoing-messages.csv";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  /* ---------------- EFFECT ---------------- */
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchMessages();
    }, 300);

    return () => clearTimeout(delay);
  }, [search, channel, clientId, limit, offset]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: colors.primary }}
          >
            Outgoing Messages
          </h1>
          <p className="mt-1 text-sm" style={{ color: colors.muted }}>
            View and monitor all outgoing messages sent via the messaging API.
          </p>
        </div>

        {/* 🔥 Attach ref here */}
        <div ref={exportRef} className="relative">
          <button
            onClick={() =>
              setShowExportMenu((prev) => !prev)
            }
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition hover:opacity-90"
            style={{ backgroundColor: colors.primary }}
          >
            <span>Export</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {showExportMenu && (
            <div
              className="absolute right-0 mt-2 w-40 rounded-xl shadow-lg border text-sm z-50"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
              }}
            >
              <button
                onClick={() => {
                  handleExport("csv");
                  setShowExportMenu(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm transition hover:bg-black/5 dark:hover:bg-white/5"
              >
                <FileSpreadsheet className="w-4 h-4 text-green-600" />
                <span>Excel</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Card */}
      <div
        className="rounded-2xl border shadow-sm overflow-hidden"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        <div className="relative mt-4">
          {loading && (
            <div
              className="absolute inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-sm"
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

          <DataTable<OutgoingMessage>
            columns={outgoingMessageColumns}
            data={messages}
            total={total}
            pageSize={limit}
          />
        </div>
      </div>
    </div>
  );
};

export default OutgoingMessagesPage;