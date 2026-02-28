import React, { useState, useMemo, useEffect } from "react";
import { Loader, ChevronUp, ChevronDown } from "lucide-react";
import { theme } from "../styles/theme";

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  pinned?: "left" | "right";
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];

  /* Server side support */
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onSearch?: (value: string) => void;

  /* UI */
  maxHeight?: string;
  isLoading?: boolean;
}

const PAGE_SIZES = [10, 25, 50, 100];

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  total = 0,
  page = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  onSearch,
  maxHeight = "600px",
  isLoading = false,
}: DataTableProps<T>) {
  /* ---------------- DARK MODE ---------------- */
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  /* ---------------- COLORS ---------------- */
  const colors = useMemo(
    () => ({
      background: isDark
        ? theme.brand.background.dark
        : theme.brand.background.light,
      surface: isDark ? theme.brand.surface.dark : theme.brand.surface.light,
      textPrimary: isDark ? theme.brand.text.dark : theme.brand.text.primary,
      textMuted: theme.brand.text.muted,
      border: isDark ? theme.brand.border.dark : theme.brand.border.light,
      header: isDark ? theme.brand.header.dark : theme.brand.header.light,
      primary: theme.brand.primary.DEFAULT,
    }),
    [isDark],
  );

  /* ---------------- SEARCH ---------------- */
  const [search, setSearch] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      onSearch?.(search);
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  /* ---------------- SORTING (CLIENT SIDE ONLY) ---------------- */
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortOrder]);

  /* ---------------- PAGINATION (SERVER SIDE READY) ---------------- */
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const showingFrom = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = Math.min(page * pageSize, total);

  return (
    <div className="w-full space-y-4">
      {/* -------- TOP BAR -------- */}
      {onSearch && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/3 px-4 py-2 rounded-lg border text-sm focus:ring-2"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.textPrimary,
            }}
          />

          {/* Rows per page */}
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: colors.textMuted }}>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              className="px-2 py-1 rounded-md border text-sm"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.textPrimary,
              }}
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* -------- TABLE -------- */}
      <div
        className="relative overflow-hidden shadow-sm rounded-lg border"
        style={{ backgroundColor: colors.surface, borderColor: colors.border }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
            <Loader
              className="animate-spin"
              style={{ color: colors.primary }}
            />
          </div>
        )}

        <div className="overflow-auto" style={{ maxHeight }}>
          <table className="w-full text-sm border-separate border-spacing-0">
            <thead className="sticky top-0 z-40">
              <tr style={{ backgroundColor: colors.header }}>
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className="px-6 py-4 text-left font-semibold border-b whitespace-nowrap"
                    style={{
                      borderColor: colors.border,
                      color: colors.textMuted,
                    }}
                  >
                    <div
                      onClick={() => col.sortable && handleSort(col.key)}
                      className={`flex items-center gap-1 ${
                        col.sortable ? "cursor-pointer" : ""
                      }`}
                    >
                      {col.label}
                      {col.sortable &&
                        sortKey === col.key &&
                        (sortOrder === "asc" ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        ))}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {sortedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:opacity-80 transition">
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className="px-6 py-4 border-b whitespace-nowrap"
                      style={{
                        borderColor: colors.border,
                        color: colors.textPrimary,
                      }}
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* -------- FOOTER -------- */}
        <div
          className="flex items-center justify-between px-6 py-4 border-t text-sm"
          style={{
            borderColor: colors.border,
            backgroundColor: colors.surface,
            color: colors.textMuted,
          }}
        >
          <div>
            Showing {showingFrom} to {showingTo} of {total}
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => onPageChange?.(page - 1)}
              className="px-3 py-1 disabled:opacity-30"
            >
              ← Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => onPageChange?.(p)}
                className="w-8 h-8 rounded-md text-sm"
                style={{
                  backgroundColor: p === page ? colors.primary : "transparent",
                  color: p === page ? "#fff" : colors.textMuted,
                }}
              >
                {p}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => onPageChange?.(page + 1)}
              className="px-3 py-1 disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
