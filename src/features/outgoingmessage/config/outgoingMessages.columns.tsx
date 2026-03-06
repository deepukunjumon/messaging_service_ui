import type { Column } from "../../../components/DataTable";
import type { OutgoingMessage } from "../types/outgoingMessages.types";
import { Chip } from "../../../components/Chip";

export const outgoingMessageColumns: Column<OutgoingMessage>[] = [
  {
    key: "api_client",
    label: "Client",
  },
  {
    key: "channel",
    label: "Channel",
    render: (value) => (
      <Chip 
        label={String(value).charAt(0).toUpperCase() + String(value).slice(1)}
        color="primary"
        size="small"
      />
    ),
  },
  {
    key: "recipient",
    label: "Recipient",
  },
  {
    key: "metadata",
    label: "Details",
    render: (value) => (
      <span className="font-mono">{String(value)}</span>
    ),
  },
  {
    key: "status",
    label: "Status",
    sortable: false,
    render: (value) => {
      const status = String(value).toLowerCase();
      const statusConfig: Record<
        string,
        "success" | "danger" | "warning" | "default"
      > = {
        sent: "success",
        delivered: "success",
        failed: "danger",
        pending: "warning",
      };

      const color = statusConfig[status] || "default";

      return (
        <Chip
          label={status}
          color={color}
          size="small"
        />
      );
    },
  },
  {
    key: "created_at",
    label: "Sent At",
    render: (value) => new Date(String(value)).toLocaleString(),
  },
];
