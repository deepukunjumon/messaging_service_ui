import React, { useState, useMemo } from "react";
import { Loader } from "./Loader";

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  pinned?: "left" | "right";
  searchable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  maxHeight?: string;
  isLoading?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  pageSize = 10,
  maxHeight = "600px",
  isLoading = false,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortOrder]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="w-full space-y-4">
      <div
        className="relative bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-2xl overflow-auto"
        style={{ maxHeight }}
      >
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-[1px]">
            <Loader variant="section" text="Syncing Data" />
          </div>
        )}

        <table className="w-full text-sm text-left border-separate border-spacing-0">
          <thead className="sticky top-0 z-30 shadow-sm">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`
                    bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700
                    px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap
                    ${col.pinned === "left" ? "sticky left-0 z-40" : ""}
                    ${col.pinned === "right" ? "sticky right-0 z-40" : ""}
                  `}
                >
                  <div
                    className={`flex items-center gap-2 ${col.sortable ? "cursor-pointer" : ""}`}
                    onClick={() => col.sortable && setSortKey(col.key)}
                  >
                    {col.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={`
                      px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap
                      ${col.pinned === "left" ? "sticky left-0 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/40 z-10 border-r border-slate-100 dark:border-slate-800" : ""}
                      ${col.pinned === "right" ? "sticky right-0 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/40 z-10 border-l border-slate-100 dark:border-slate-800" : ""}
                    `}
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination component logic... */}
    </div>
  );
}
