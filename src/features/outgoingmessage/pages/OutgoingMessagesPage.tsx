import { useEffect, useMemo, useState } from "react";
import axios from "../../../services/axios";
import API from "../../../config/api.config";

import { DataTable } from "../../../components/DataTable";
import type { OutgoingMessage } from "../types/outgoingMessages.types";
import { outgoingMessageColumns } from "../config/outgoingMessages.columns";

const CHANNELS = ["all", "sms", "email", "whatsapp"] as const;

const OutgoingMessagesPage = () => {
  const [messages, setMessages] = useState<OutgoingMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [channel, setChannel] = useState<(typeof CHANNELS)[number]>("all");
  const [clientId, setClientId] = useState("");
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setOffset(0);
  }, [search, channel, clientId]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("q", search);
      if (channel !== "all") params.append("channel", channel);
      if (clientId) params.append("client_id", clientId);
      params.append("limit", String(limit));
      params.append("offset", String(offset));

      const res = await axios.get(
        `${API.OUTGOING_MESSAGES.LIST}?${params.toString()}`,
      );

      const fetchedMessages = res.data?.data || [];
      setMessages(fetchedMessages);
      setTotal(res.data?.total || 0);
    } catch (e) {
      console.error("Failed to fetch outgoing messages:", e);
      setMessages([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [search, channel, clientId, limit, offset]);

  const showingFrom = total === 0 ? 0 : offset + 1;
  const showingTo = Math.min(offset + limit, total);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-teal-500">
            Outgoing Messages
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            View all outgoing messages sent via the messaging API.
          </p>
        </div>

        <div className="w-full sm:w-1/3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipient, subject or message"
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-brand/40
                       dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* Channel Tabs */}
      <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 p-1 text-xs font-bold text-slate-500 bg-slate-50 dark:bg-slate-900/50">
        {CHANNELS.map((c) => (
          <button
            key={c}
            onClick={() => setChannel(c)}
            className={`px-3 py-1 rounded-lg transition-all duration-200 tracking-tight ${
              channel === c
                ? "bg-teal-500 text-white shadow-sm"
                : "hover:text-teal-500 dark:hover:text-teal-400"
            }`}
          >
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {/* DataTable Component */}
      <DataTable<OutgoingMessage>
        columns={outgoingMessageColumns}
        data={messages}
        pageSize={limit}
      />

      {/* Server Pagination */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => setOffset(Math.max(0, offset - limit))}
          disabled={offset === 0}
          className="rounded-lg border px-3 py-1 text-sm disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm text-slate-600 dark:text-slate-300">
          Showing {showingFrom} – {showingTo} of {total}
        </span>

        <button
          onClick={() => setOffset(offset + limit)}
          disabled={offset + limit >= total}
          className="rounded-lg border px-3 py-1 text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OutgoingMessagesPage;
