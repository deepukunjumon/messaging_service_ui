import { PencilIcon } from "lucide-react";
import type { Column } from "../../../components/DataTable";
import type { APIClientKeys } from "../type/apiClientKeys.types.tsx";
import { Chip } from "../../../components/Chip.tsx";
import { Toggle } from "../../../components/Toggle";

export const apiClientKeysColumns = (
  onStatusChange: (id: string, status: number) => void
): Column<APIClientKeys>[] => [
    {
    key: "api_key",
    label: "API Key",
    render: (value) => (
        <span className="font-mono">
            {value}
        </span>
    ),
    },
    {
        key: "status",
        label: "Status",
        render: (value) => (
        <Chip
            label={value === 1 ? "Active" : (value === -1 ? "Revoked" : "Inactive") }
            color={value === 1 ? "success" :(value === -1 ? "danger" : "warning") }
            variant="soft"
            size="small"
        />
        ),
    },
    {
        key: "created_at",
        label: "Created At",
    },
    {
    key: "actions",
    label: "Actions",
    sortable: false,
    render: (_, row) => (
        <div className="flex items-center gap-2">
        <Toggle
            size="sm"
            checked={row.status === 1}
            onChange={(checked) =>
            onStatusChange(row.id, checked ? 1 : 0)
            }
        />
        </div>
    ),
    }
];