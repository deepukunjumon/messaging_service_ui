import { PencilIcon, Trash2 } from "lucide-react";
import { Chip } from "../../../components/Chip";
import type { Column } from "../../../components/DataTable";
import type { APIClient } from "../type/apiClients.types";

export const apiClientColumns = (
  onEdit: (row: APIClient) => void,
  onDelete: (row: APIClient) => void
): Column<APIClient>[] => [
  {
    key: "name",
    label: "Client",
    sortable: true,
  },
  {
    key: "description",
    label: "Description",
    sortable: false,
  },
  {
    key: "status",
    label: "Status",
    render: (value) => (
      <Chip
        label={value === 1 ? "Active" : value === -1 ? "Deleted" : "Inactive"}
        color={
          value === 1
            ? "success"
            : value === -1
            ? "danger"
            : "warning"
        }
        size="small"
      />
    ),
  },
  {
    key: "created_at",
    label: "Created At",
    sortable: true,
  },
  {
    key: "actions",
    label: "Actions",
    sortable: false,
    render: (_, row) => (
      <div
        className="flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {row.status === 1 && (
          <button
            onClick={() => onEdit(row)}
            className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
            title="Edit Client"
          >
            <PencilIcon className="w-4 h-4 text-blue-600" />
          </button>
        )}

        {row.status !== -1 && (
          <button
            onClick={() => onDelete(row)}
            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition"
            title="Delete Client"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        )}
      </div>
    ),
  },
];