import React, { useEffect, useRef, useState } from "react";
import EntityForm, { type FormField } from "@/shared/components/DynamicForm";
import type { CreateInventoryPayload, Inventory } from "../types";
import {
  GetCars,
  GetInventoryUnit,
  BulkUploadInventory,
  CreateInventory,
} from "../api";
import { useParams } from "react-router-dom";

type Mode = "single" | "bulk";

type BulkResult = {
  message: string;
  created: number;
  skipped: number;
  errors: string[];
};

type UploadState = "idle" | "dragging" | "uploading" | "done" | "error";

// ─── CSV template columns the API expects ────────────────────────────────────
const CSV_TEMPLATE = `vin,purchase_price\nWBA3A5C51CF256651,24500\nJTEBU5JR6A5005647,31000`;

function downloadTemplate() {
  const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "inventory_template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  .inv-root {
    --bg:          #ffffff;
    --surface:     #f8f8f7;
    --surface2:    #f2f0ec;
    --border:      #e8e6e1;
    --border-soft: #f0ede8;
    --text:        #1a1916;
    --text-muted:  #8a8680;
    --text-faint:  #b5b2ad;
    --accent:      #1a1916;
    --accent-fg:   #ffffff;
    --danger:      #dc2626;
    --success:     #16a34a;
    --warning:     #ca8a04;
    --radius:      12px;
    --shadow:      0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04);
    font-family: 'Figtree', sans-serif;
    color: var(--text);
    padding: 40px 24px 80px;
    min-height: 100vh;
    background: #f5f3ef;
  }

  @media (prefers-color-scheme: dark) {
    .inv-root {
      --bg:          #111110;
      --surface:     #161614;
      --surface2:    #1a1916;
      --border:      #282724;
      --border-soft: #1e1d1b;
      --text:        #e8e6e1;
      --text-muted:  #6b6966;
      --text-faint:  #3d3c3a;
      --accent:      #e8e6e1;
      --accent-fg:   #111110;
      --shadow:      0 1px 3px rgba(0,0,0,0.3);
      background: #0c0c0b;
    }
  }

  .inv-container { max-width: 900px; margin: 0 auto; }

  /* Header */
  .inv-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .inv-eyebrow::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 1px;
    background: var(--text-muted);
  }

  .inv-title {
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.15;
    margin-bottom: 28px;
  }

  /* Mode toggle */
  .inv-toggle {
    display: inline-flex;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 3px;
    gap: 2px;
    margin-bottom: 28px;
  }

  .inv-toggle-btn {
    font-family: 'Figtree', sans-serif;
    font-size: 13px;
    font-weight: 500;
    padding: 7px 18px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .inv-toggle-btn.active {
    background: var(--bg);
    color: var(--text);
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    border: 1px solid var(--border);
  }

  .inv-toggle-btn svg { flex-shrink: 0; }

  /* Card */
  .inv-card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: var(--shadow);
  }

  /* ── Bulk upload ── */
  .bulk-inner { padding: 28px; display: flex; flex-direction: column; gap: 20px; }

  /* Car selector inside bulk */
  .bulk-select-wrap {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .bulk-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-family: 'DM Mono', monospace;
  }

  .bulk-select {
    width: 100%;
    padding: 10px 14px;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    color: var(--text);
    font-family: 'Figtree', sans-serif;
    font-size: 14px;
    appearance: none;
    outline: none;
    cursor: pointer;
    transition: border-color 0.15s;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238a8680' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
  }
  .bulk-select:focus { border-color: var(--accent); }

  /* Drop zone */
  .drop-zone {
    border: 1.5px dashed var(--border);
    border-radius: 12px;
    padding: 40px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.18s;
    text-align: center;
    background: var(--surface);
    position: relative;
  }

  .drop-zone:hover,
  .drop-zone.dragging {
    border-color: var(--accent);
    background: var(--surface2);
  }

  .drop-zone input[type=file] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }

  .drop-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    background: var(--bg);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
    transition: transform 0.15s;
  }

  .drop-zone:hover .drop-icon,
  .drop-zone.dragging .drop-icon { transform: translateY(-2px); }

  .drop-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
  }

  .drop-sub {
    font-size: 12.5px;
    color: var(--text-muted);
    line-height: 1.5;
  }

  .drop-file-name {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--text);
    background: var(--surface2);
    border: 1px solid var(--border);
    padding: 5px 12px;
    border-radius: 7px;
    margin-top: 4px;
  }

  /* Template download link */
  .template-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12.5px;
    color: var(--text-muted);
    cursor: pointer;
    text-decoration: none;
    transition: color 0.15s;
    font-family: 'Figtree', sans-serif;
  }
  .template-link:hover { color: var(--text); }

  /* Upload button */
  .upload-btn {
    width: 100%;
    padding: 13px;
    background: var(--accent);
    color: var(--accent-fg);
    border: none;
    border-radius: 11px;
    font-family: 'Figtree', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .upload-btn:hover:not(:disabled) { opacity: 0.88; }
  .upload-btn:disabled { opacity: 0.45; cursor: not-allowed; }

  /* Progress bar */
  .progress-track {
    height: 3px;
    background: var(--border);
    border-radius: 99px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: var(--accent);
    border-radius: 99px;
    transition: width 0.3s ease;
  }

  /* Result panel */
  .result-panel {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--border);
    animation: fadeUp 0.25s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .result-summary {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-bottom: 1px solid var(--border);
  }

  .result-stat {
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .result-stat + .result-stat {
    border-left: 1px solid var(--border);
  }

  .result-stat-val {
    font-family: 'DM Mono', monospace;
    font-size: 22px;
    font-weight: 500;
  }

  .result-stat-label {
    font-size: 11px;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-family: 'DM Mono', monospace;
  }

  .result-errors {
    padding: 14px 18px;
    background: var(--surface);
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-height: 180px;
    overflow-y: auto;
  }

  .result-error-title {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--warning);
    font-family: 'DM Mono', monospace;
    margin-bottom: 2px;
  }

  .result-error-row {
    font-family: 'DM Mono', monospace;
    font-size: 11.5px;
    color: var(--text-muted);
    padding: 5px 10px;
    background: var(--bg);
    border-radius: 6px;
    border: 1px solid var(--border-soft);
    line-height: 1.4;
  }

  /* Spinner */
  .spin {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

`;

export default function InventoryCreate() {
  const [mode, setMode] = useState<Mode>("single");
  const [initialValues, setInitialValues] = useState<Inventory | null>(null);
  const [carOptions, setCarOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const { id } = useParams();

  // ── Bulk state ────────────────────────────────────────────────────────────
  const [bulkCarId, setBulkCarId] = useState<number | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<BulkResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSave = async (inventory: CreateInventoryPayload) => {
    await CreateInventory(inventory);
    // redirect back to inventory list
  };

  // ── Load data ─────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const data = await GetCars();
      setCarOptions(
        data.map((c: any) => ({
          label: `${c.make} ${c.model} (${c.year})`,
          value: c.id,
        })),
      );
    })();
  }, []);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const data = await GetInventoryUnit(Number(id));
      setInitialValues(data);
    })();
  }, [id]);

  // ── Single form fields ────────────────────────────────────────────────────
  const fields: FormField<CreateInventoryPayload>[] = [
    {
      name: "car_id",
      label: "Car",
      type: "select",
      required: true,
      options: carOptions,
      section: "Details",
    },
    {
      name: "vin",
      label: "VIN",
      type: "text",
      required: true,
      placeholder: "e.g. WBA3A5C51CF256651",
      section: "Details",
    },
    {
      name: "registration_number",
      label: "Registration No.",
      type: "text",
      placeholder: "e.g. DXB-A-12345",
      section: "Details",
    },
    {
      name: "stock_number",
      label: "Stock No.",
      type: "text",
      placeholder: "e.g. STocK-A-12345",
      section: "Details",
    },
    {
      name: "exterior_color",
      label: "Exterior color",
      type: "select",
      section: "Apearances",
      options: [
        { label: "Black", value: "black" },
        { label: "White", value: "white" },
        { label: "Silver", value: "silver" },
        { label: "Red", value: "red" },
        { label: "Blue", value: "blue" },
        { label: "Grey", value: "grey" },
      ],
    },
    {
      name: "interior_color",
      label: "Interior color",
      type: "select",
      section: "Apearances",
      options: [
        { label: "Black", value: "black" },
        { label: "White", value: "white" },
        { label: "Silver", value: "silver" },
        { label: "Red", value: "red" },
        { label: "Blue", value: "blue" },
        { label: "Grey", value: "grey" },
      ],
    },
    {
      name: "mileage_km",
      label: "Mileage (km).",
      type: "number",
      placeholder: "e.g. 00222",
      section: "Apearances",
    },
    {
      name: "condition",
      label: "Condition",
      type: "select",
      section: "Apearances",
      options: [
        { label: "New", value: "new" },
        { label: "Used", value: "used" },
        { label: "Refurbished", value: "refurbished" },
      ],
    },
    {
      name: "purchase_price",
      label: "Purchase Price",
      type: "number",
      required: true,
      prefix: "$",
      section: "Pricing",
    },
    {
      name: "selling_price",
      label: "Selling Price",
      type: "number",
      required: true,
      prefix: "$",
      section: "Pricing",
    },
    {
      name: "discounted_price",
      label: "Discounted Price",
      type: "number",
      required: true,
      prefix: "$",
      section: "Pricing",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      section: "Pricing",
      options: [
        { label: "Available", value: "available" },
        { label: "Reserved", value: "reserved" },
        { label: "Sold", value: "sold" },
      ],
    },
    {
      name: "notes",
      label: "Notes",
      type: "textarea",
      section: "Notes",
    },
  ];

  const defaultValues: CreateInventoryPayload = {
    car_id: 0,
    vin: "",
    registration_number: "",
    stock_number: "",
    mileage_km: 0,
    condition: "new",
    purchase_price: 0,
    selling_price: 0,
    discounted_price: 0,
    exterior_color: "white",
    interior_color: "black",
    status: "available",
    notes: "",
  };

  // ── Drag & drop ───────────────────────────────────────────────────────────
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.name.endsWith(".csv")) setFile(dropped);
  };

  // ── Bulk submit ───────────────────────────────────────────────────────────
  const handleBulkUpload = async () => {
    if (!file || !bulkCarId) return;
    setUploadState("uploading");
    setProgress(0);
    setResult(null);

    // Fake progress ticks while awaiting
    const ticker = setInterval(
      () => setProgress((p) => Math.min(p + 12, 88)),
      200,
    );
    try {
      const res = await BulkUploadInventory(Number(bulkCarId), file);
      clearInterval(ticker);
      setProgress(100);
      setResult(res);
      setUploadState("done");
    } catch {
      clearInterval(ticker);
      setUploadState("error");
    }
  };

  const resetBulk = () => {
    setFile(null);
    setResult(null);
    setUploadState("idle");
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <style>{css}</style>
      <div className="inv-root">
        <div className="inv-container">
          {/* Header */}
          <div className="inv-eyebrow">{id ? "Edit Record" : "New Record"}</div>
          <h1 className="inv-title">
            {id ? "Edit Inventory" : "Create Inventory"}
          </h1>

          {/* Mode toggle — only show on create */}
          {!id && (
            <div className="inv-toggle">
              <button
                className={`inv-toggle-btn${mode === "single" ? " active" : ""}`}
                onClick={() => setMode("single")}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M12 8v8M8 12h8" strokeLinecap="round" />
                </svg>
                Single Entry
              </button>
              <button
                className={`inv-toggle-btn${mode === "bulk" ? " active" : ""}`}
                onClick={() => setMode("bulk")}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <path d="M14 2v6h6M8 13h8M8 17h5" strokeLinecap="round" />
                </svg>
                Bulk CSV Upload
              </button>
            </div>
          )}

          {/* ── Single ── */}
          {(mode === "single" || id) && (
            <div className="">
              <div className="">
                <EntityForm
                  fields={fields}
                  initialValues={initialValues ?? defaultValues}
                  mode={id ? "edit" : "create"}
                  onSubmit={onSave}
                  disabled={initialValues?.status === "sold"}
                  disabledMessage="Sold inventory cannot be modified"
                />
              </div>
            </div>
          )}

          {/* ── Bulk ── */}
          {mode === "bulk" && !id && (
            <div className="inv-card">
              <div className="bulk-inner">
                {/* Car selector */}
                <div className="bulk-select-wrap">
                  <label className="bulk-label">
                    Select Car Model <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <select
                    className="bulk-select"
                    value={bulkCarId}
                    onChange={(e) => setBulkCarId(Number(e.target.value))}
                  >
                    <option value="">Choose a car model…</option>
                    {carOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Drop zone */}
                <div
                  className={`drop-zone${dragging ? " dragging" : ""}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setFile(f);
                    }}
                  />
                  <div className="drop-icon">
                    {file ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--success)"
                        strokeWidth="1.8"
                      >
                        <path
                          d="M20 6L9 17l-5-5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--text-muted)"
                        strokeWidth="1.6"
                      >
                        <path
                          d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
                          strokeLinecap="round"
                        />
                        <path
                          d="M17 8l-5-5-5 5M12 3v12"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  {file ? (
                    <>
                      <p className="drop-title">File ready</p>
                      <span className="drop-file-name">{file.name}</span>
                      <p className="drop-sub" style={{ fontSize: 11.5 }}>
                        {(file.size / 1024).toFixed(1)} KB · click to replace
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="drop-title">Drop your CSV here</p>
                      <p className="drop-sub">
                        or click to browse · .csv files only
                      </p>
                    </>
                  )}
                </div>

                {/* Template hint */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <span className="template-link" onClick={downloadTemplate}>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M7 10l5 5 5-5M12 15V3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Download CSV template
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 11,
                      color: "var(--text-faint)",
                    }}
                  >
                    Required columns: vin, purchase_price
                  </span>
                </div>

                {/* Progress */}
                {uploadState === "uploading" && (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        fontSize: 11,
                        color: "var(--text-muted)",
                      }}
                    >
                      Uploading… {progress}%
                    </span>
                  </div>
                )}

                {/* Result */}
                {uploadState === "done" && result && (
                  <div className="result-panel">
                    <div className="result-summary">
                      <div className="result-stat">
                        <span
                          className="result-stat-val"
                          style={{ color: "var(--success)" }}
                        >
                          {result.created}
                        </span>
                        <span className="result-stat-label">Created</span>
                      </div>
                      <div className="result-stat">
                        <span
                          className="result-stat-val"
                          style={{
                            color:
                              result.skipped > 0
                                ? "var(--warning)"
                                : "var(--text-faint)",
                          }}
                        >
                          {result.skipped}
                        </span>
                        <span className="result-stat-label">Skipped</span>
                      </div>
                    </div>
                    {result.errors.length > 0 && (
                      <div className="result-errors">
                        <div className="result-error-title">⚠ Skipped rows</div>
                        {result.errors.map((e, i) => (
                          <div key={i} className="result-error-row">
                            {e}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {uploadState === "error" && (
                  <div
                    style={{
                      padding: "12px 16px",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      color: "var(--danger)",
                      fontSize: 13,
                      fontFamily: "'Figtree',sans-serif",
                    }}
                  >
                    Upload failed — please check the file and try again.
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    className="upload-btn"
                    disabled={
                      !file || !bulkCarId || uploadState === "uploading"
                    }
                    onClick={
                      uploadState === "done" || uploadState === "error"
                        ? resetBulk
                        : handleBulkUpload
                    }
                  >
                    {uploadState === "uploading" ? (
                      <>
                        <span className="spin" /> Uploading…
                      </>
                    ) : uploadState === "done" ? (
                      <>
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path
                            d="M20 6L9 17l-5-5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Upload another file
                      </>
                    ) : (
                      <>
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path
                            d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
                            strokeLinecap="round"
                          />
                          <path
                            d="M17 8l-5-5-5 5M12 3v12"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Upload CSV
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
