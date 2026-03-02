import { useEffect, useState } from "react";
import axios from "../../../services/axios";
import API from "../../../config/api.config";

import { DataTable } from "../../../components/DataTable";
import type { OutgoingMessage } from "../types/outgoingMessages.types";
import { outgoingMessageColumns } from "../config/outgoingMessages.columns";
import { Loader } from "../../../components/Loader";
import { theme } from "../../../styles/theme";

const CHANNELS = ["all", "sms", "email", "whatsapp"] as const;

const OutgoingMessagesPage = () => {
  /* ---------------- THEME DETECTION (Same as APIClientsPage) ---------------- */
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

  const [search, setSearch] = useState("");
  const [channel, setChannel] = useState<(typeof CHANNELS)[number]>("all");
  const [clientId, setClientId] = useState("");

  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

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
        `${API.OUTGOING_MESSAGES.LIST}?${params.toString()}`,
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

  /* ---------------- EFFECT ---------------- */
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setOffset(0);
      fetchMessages();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, channel, clientId, limit, offset]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
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

      {/* Main Card */}
      <div
        className="rounded-2xl border shadow-sm overflow-hidden"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
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
              Message Logs
            </h2>
          </div>

          {/* Search */}
          <div className="w-full sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipient, subject or content..."
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

        {/* Channel Tabs */}
        <div className="px-5 pt-4">
          <div
            className="inline-flex rounded-xl border p-1 text-xs font-bold"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.background,
              color: colors.muted,
            }}
          >
            {CHANNELS.map((c) => (
              <button
                key={c}
                onClick={() => setChannel(c)}
                className={`px-3 py-1 rounded-lg transition-all duration-200 tracking-tight ${
                  channel === c ? "text-white" : ""
                }`}
                style={{
                  backgroundColor:
                    channel === c ? colors.primary : "transparent",
                }}
              >
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Card Body */}
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
