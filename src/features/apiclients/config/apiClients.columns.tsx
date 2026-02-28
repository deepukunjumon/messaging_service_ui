import type { Column } from "../../../components/DataTable";
import type { APIClient } from "../type/apiClients.types";

export const apiClientColumns: Column<APIClient>[] = [
    {
        key: "id",
        label: "ID",
        sortable: false,
        pinned: "left",
    },
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
        key: "created_at",
        label: "Created At",
        sortable: true,
    },
    {
        key: "actions",
        label: "Actions",
        sortable: false,
    }
];
