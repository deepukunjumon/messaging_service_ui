import type { Column } from "../../../components/DataTable";
import type { OutgoingMessage } from "../types/outgoingMessages.types";
import { Chip } from "../../../components/Chip";

export const outgoingMessageColumns: Column<OutgoingMessage>[] = [
  {
    key: "id",
    label: "ID",
    sortable: false,
    pinned: "left",
  },
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
        variant="soft"
        size="small"
      />
    ),
  },
  {
    key: "recipient",
    label: "Recipient",
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
          variant="soft"
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
