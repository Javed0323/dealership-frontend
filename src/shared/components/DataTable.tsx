// components/DataTable.tsx
import React, { useState } from "react";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  renderActions?: (row: T) => React.ReactNode;
  canEdit?: (row: T) => boolean;
  canDelete?: (row: T) => boolean;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  caption?: string;
  loading?: boolean;
  onView?: (row: T) => void;
  canView?: (row: T) => boolean;
  hasImage?: (row: T) => boolean;
  onImage?: (row: T) => void;
}

type SortDir = "asc" | "desc" | null;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  .dt-root {
    --bg:           #ffffff;
    --surface:      #f8f8f7;
    --border:       #e8e6e1;
    --border-soft:  #f0ede8;
    --text:         #1a1916;
    --text-muted:   #8a8680;
    --text-faint:   #b5b2ad;
    --accent:       #1a1916;
    --accent-soft:  #f0ede8;
    --row-hover:    #faf9f7;
    --sort-active:  #1a1916;
    --shadow:       0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --radius:       12px;
    font-family: 'Figtree', sans-serif;
    font-size: 14px;
    color: var(--text);
  }

  @media (prefers-color-scheme: dark) {
    .dt-root {
      --bg:           #111110;
      --surface:      #161614;
      --border:       #282724;
      --border-soft:  #1e1d1b;
      --text:         #e8e6e1;
      --text-muted:   #6b6966;
      --text-faint:   #3d3c3a;
      --accent:       #e8e6e1;
      --accent-soft:  #1e1d1b;
      --row-hover:    #151412;
      --shadow:       0 1px 3px rgba(0,0,0,0.3);
    }
  }

  .dt-wrapper {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow);
  }

  .dt-caption {
    padding: 18px 20px 0;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-family: 'DM Mono', monospace;
  }

  .dt-scroll {
    overflow-x: auto;
  }

  table.dt-table {
    width: 100%;
    border-collapse: collapse;
  }

  .dt-table thead tr {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
  }

  .dt-table th {
    padding: 11px 16px;
    text-align: left;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-family: 'DM Mono', monospace;
    white-space: nowrap;
    user-select: none;
  }

  .dt-table th.sortable {
    cursor: pointer;
  }

  .dt-table th.sortable:hover {
    color: var(--text);
  }

  .dt-th-inner {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .dt-sort-icon {
    display: flex;
    flex-direction: column;
    gap: 1.5px;
    opacity: 0.3;
    transition: opacity 0.15s;
  }

  th.sortable:hover .dt-sort-icon,
  th.sort-active .dt-sort-icon {
    opacity: 1;
  }

  .dt-sort-icon svg {
    display: block;
  }

  .dt-table tbody tr {
    border-bottom: 1px solid var(--border-soft);
    transition: background 0.12s;
  }

  .dt-table tbody tr:last-child {
    border-bottom: none;
  }

  .dt-table tbody tr:hover {
    background: var(--row-hover);
  }

  .dt-table td {
    padding: 13px 16px;
    color: var(--text);
    font-size: 13.5px;
    line-height: 1.4;
    vertical-align: middle;
  }

  .dt-table td.actions-cell {
    text-align: right;
    white-space: nowrap;
  }

  .dt-table th.actions-th {
    text-align: right;
  }

  /* Empty state */
  .dt-empty {
    padding: 56px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .dt-empty-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
  }

  .dt-empty-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
  }

  .dt-empty-sub {
    font-size: 12.5px;
    color: var(--text-muted);
  }

  /* Loading skeleton */
  .dt-skeleton {
    background: linear-gradient(90deg, var(--surface) 25%, var(--border-soft) 50%, var(--surface) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s ease infinite;
    border-radius: 4px;
    height: 13px;
  }

  @keyframes shimmer {
    from { background-position: 200% 0; }
    to   { background-position: -200% 0; }
  }

  /* Footer count */
  .dt-footer {
    padding: 10px 18px;
    border-top: 1px solid var(--border-soft);
    background: var(--surface);
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .dt-count {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--text-faint);
    letter-spacing: 0.04em;
  }

  .actions-wrap {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.action-btn {
  font-family: 'Figtree', sans-serif;
  font-size: 12px;
  font-weight: 500;
  padding: 5px 11px;
  border-radius: 7px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.action-btn:hover {
  border-color: var(--text);
  color: var(--text);
}

.action-btn.danger:hover {
  border-color: var(--danger);
  color: var(--danger);
}
`;

function SortIcon({ dir }: { dir: SortDir }) {
  return (
    <span className="dt-sort-icon">
      <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
        <path
          d="M3.5 0L7 5H0L3.5 0Z"
          fill={dir === "asc" ? "currentColor" : "currentColor"}
          opacity={dir === "asc" ? 1 : 0.35}
        />
      </svg>
      <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
        <path
          d="M3.5 5L0 0H7L3.5 5Z"
          fill="currentColor"
          opacity={dir === "desc" ? 1 : 0.35}
        />
      </svg>
    </span>
  );
}

const SKELETON_ROWS = 5;

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  renderActions,
  caption,
  loading = false,
  onView,
  canView,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
  hasImage,
  onImage,
}: DataTableProps<T>) {
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const handleSort = (colIndex: number) => {
    if (sortCol === colIndex) {
      setSortDir((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"));
      if (sortDir === "desc") setSortCol(null);
    } else {
      setSortCol(colIndex);
      setSortDir("asc");
    }
  };

  const sortedData = React.useMemo(() => {
    if (sortCol === null || sortDir === null) return data;
    const col = columns[sortCol];
    if (typeof col.accessor === "function") return data;
    return [...data].sort((a, b) => {
      const av = a[col.accessor as keyof T];
      const bv = b[col.accessor as keyof T];
      const cmp = String(av).localeCompare(String(bv), undefined, {
        numeric: true,
      });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortCol, sortDir, columns]);

  return (
    <>
      <style>{styles}</style>
      <div className="dt-root">
        <div className="dt-wrapper">
          {caption && <div className="dt-caption">{caption}</div>}

          <div className="dt-scroll">
            <table className="dt-table">
              <thead>
                <tr>
                  {columns.map((col, i) => {
                    const isActive = sortCol === i;
                    const dir = isActive ? sortDir : null;
                    return (
                      <th
                        key={i}
                        className={[
                          col.sortable !== false ? "sortable" : "",
                          isActive ? "sort-active" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        style={{
                          width: col.width,
                          textAlign: col.align ?? "left",
                          color: isActive ? "var(--text)" : undefined,
                        }}
                        onClick={() => col.sortable !== false && handleSort(i)}
                      >
                        <span className="dt-th-inner">
                          {col.header}
                          {col.sortable !== false && <SortIcon dir={dir} />}
                        </span>
                      </th>
                    );
                  })}
                  {(onEdit || onDelete || onView) && (
                    <th className="actions-th">
                      <span
                        className="dt-th-inner"
                        style={{ justifyContent: "flex-end" }}
                      >
                        Actions
                      </span>
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {loading
                  ? Array.from({ length: SKELETON_ROWS }).map((_, ri) => (
                      <tr key={ri}>
                        {columns.map((_, ci) => (
                          <td key={ci}>
                            <div
                              className="dt-skeleton"
                              style={{
                                width: `${55 + ((ri * 3 + ci * 7) % 35)}%`,
                              }}
                            />
                          </td>
                        ))}
                        {renderActions && (
                          <td>
                            <div
                              className="dt-skeleton"
                              style={{ width: 60, marginLeft: "auto" }}
                            />
                          </td>
                        )}
                      </tr>
                    ))
                  : sortedData.map((row) => (
                      <tr key={String(row[keyField])}>
                        {columns.map((col, i) => (
                          <td
                            key={i}
                            style={{ textAlign: col.align ?? "left" }}
                          >
                            {typeof col.accessor === "function"
                              ? col.accessor(row)
                              : String(row[col.accessor] ?? "—")}
                          </td>
                        ))}
                        {(onEdit || onDelete) && (
                          <td className="actions-cell">
                            <span className="actions-wrap">
                              {onImage && (hasImage ? hasImage(row) : true) && (
                                <button
                                  className="action-btn"
                                  onClick={() => onImage(row)}
                                >
                                  Media
                                </button>
                              )}
                              {onView && (canView ? canView(row) : true) && (
                                <button
                                  className="action-btn"
                                  onClick={() => onView(row)}
                                >
                                  View
                                </button>
                              )}
                              {onEdit && (canEdit ? canEdit(row) : true) && (
                                <button
                                  className="action-btn"
                                  onClick={() => onEdit(row)}
                                >
                                  Edit
                                </button>
                              )}
                              {onDelete &&
                                (canDelete ? canDelete(row) : true) && (
                                  <button
                                    className="action-btn danger"
                                    onClick={() => onDelete(row)}
                                  >
                                    Delete
                                  </button>
                                )}
                              {(!canEdit || !canEdit(row)) &&
                                (!canView || !canView(row)) &&
                                (!canDelete || !canDelete(row)) && (
                                  <span
                                    style={{
                                      fontFamily: "'DM Mono', monospace",
                                      fontSize: 11,
                                      color: "var(--text-faint)",
                                      letterSpacing: "0.06em",
                                    }}
                                  >
                                    locked
                                  </span>
                                )}
                            </span>
                          </td>
                        )}
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {!loading && data.length === 0 && (
            <div className="dt-empty">
              <div className="dt-empty-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--text-muted)"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" strokeLinecap="round" />
                </svg>
              </div>
              <p className="dt-empty-title">No records found</p>
              <p className="dt-empty-sub">
                Try adjusting your filters or adding new data.
              </p>
            </div>
          )}

          {!loading && data.length > 0 && (
            <div className="dt-footer">
              <span className="dt-count">
                {data.length} {data.length === 1 ? "record" : "records"}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
