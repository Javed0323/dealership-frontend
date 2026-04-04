import React, { useEffect, useState } from "react";
import useFormDirty from "../hooks/useFormDirty";

type FieldType =
  | "text"
  | "email"
  | "number"
  | "select"
  | "checkbox"
  | "date"
  | "textarea";

export interface FormField<T> {
  name: keyof T;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  options?: { label: string; value: any }[];
  section?: string;
}

interface EntityFormProps<T> {
  fields: FormField<T>[];
  initialValues: T;
  mode: "create" | "edit";
  onSubmit: (values: T) => Promise<void> | void;
  loading?: boolean;
  title?: string;
  subtitle?: string;
  disabled?: boolean;
  disabledMessage?: string;
  onFieldChange?: (name: keyof T, value: unknown) => void; // add this
}

function FloatingInput({
  label,
  type = "text",
  value,
  onChange,
  required,
  placeholder,
  prefix,
  suffix,
  error,
}: {
  label: string;
  type?: string;
  value: any;
  onChange: (v: any) => void;
  required?: boolean;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  const filled = value !== "" && value !== null && value !== undefined;
  const floated = focused || filled;

  return (
    <div className="relative">
      <div
        style={{
          position: "relative",
          background: focused ? "#0f1117" : "#0a0c12",
          border: `1.5px solid ${error ? "#ef4444" : focused ? "#6366f1" : filled ? "#374151" : "#1f2937"}`,
          borderRadius: "12px",
          transition: "all 0.2s ease",
          overflow: "hidden",
        }}
      >
        {prefix && (
          <span
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#6b7280",
              fontSize: "13px",
              fontFamily: "'DM Mono', monospace",
              pointerEvents: "none",
              zIndex: 2,
            }}
          >
            {prefix}
          </span>
        )}
        <label
          style={{
            position: "absolute",
            left: prefix ? "32px" : "14px",
            top: floated ? "8px" : "50%",
            transform: floated ? "none" : "translateY(-50%)",
            fontSize: floated ? "10px" : "14px",
            color: error ? "#ef4444" : focused ? "#818cf8" : "#6b7280",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            letterSpacing: floated ? "0.08em" : "0",
            textTransform: floated ? "uppercase" : "none",
            transition: "all 0.18s ease",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          {label}
          {required && (
            <span style={{ color: "#f43f5e", marginLeft: "3px" }}>*</span>
          )}
        </label>
        <input
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={floated ? placeholder : ""}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            paddingTop: "22px",
            paddingBottom: "10px",
            paddingLeft: prefix ? "32px" : "14px",
            paddingRight: suffix ? "40px" : "14px",
            color: "#f1f5f9",
            fontSize: "14px",
            fontFamily: "'DM Sans', sans-serif",
            boxSizing: "border-box",
          }}
        />
        {suffix && (
          <span
            style={{
              position: "absolute",
              right: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#6b7280",
              fontSize: "12px",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p
          style={{
            color: "#ef4444",
            fontSize: "11px",
            marginTop: "4px",
            paddingLeft: "14px",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

function FloatingSelect({
  label,
  value,
  onChange,
  options,
  required,
  error,
}: {
  label: string;
  value: any;
  onChange: (v: any) => void;
  options: { label: string; value: any }[];
  required?: boolean;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  const filled = value !== "" && value !== null && value !== undefined;
  const floated = focused || filled;

  return (
    <div className="relative">
      <div
        style={{
          position: "relative",
          background: focused ? "#0f1117" : "#0a0c12",
          border: `1.5px solid ${error ? "#ef4444" : focused ? "#6366f1" : filled ? "#374151" : "#1f2937"}`,
          borderRadius: "12px",
          transition: "all 0.2s ease",
        }}
      >
        <label
          style={{
            position: "absolute",
            left: "14px",
            top: floated ? "8px" : "50%",
            transform: floated ? "none" : "translateY(-50%)",
            fontSize: floated ? "10px" : "14px",
            color: error ? "#ef4444" : focused ? "#818cf8" : "#6b7280",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            letterSpacing: floated ? "0.08em" : "0",
            textTransform: floated ? "uppercase" : "none",
            transition: "all 0.18s ease",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          {label}
          {required && (
            <span style={{ color: "#f43f5e", marginLeft: "3px" }}>*</span>
          )}
        </label>
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            paddingTop: "22px",
            paddingBottom: "10px",
            paddingLeft: "14px",
            paddingRight: "36px",
            color: filled ? "#f1f5f9" : "#6b7280",
            fontSize: "14px",
            fontFamily: "'DM Sans', sans-serif",
            appearance: "none",
            cursor: "pointer",
          }}
        >
          <option value="">—</option>
          {options.map((opt, i) => (
            <option
              key={i}
              value={opt.value}
              style={{ background: "#0f1117", color: "#f1f5f9" }}
            >
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "#6b7280",
          }}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      {error && (
        <p
          style={{
            color: "#ef4444",
            fontSize: "11px",
            marginTop: "4px",
            paddingLeft: "14px",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

function FloatingTextarea({
  label,
  value,
  onChange,
  required,
  placeholder,
  error,
}: {
  label: string;
  value: any;
  onChange: (v: any) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  const filled = value !== "" && value !== null && value !== undefined;
  const floated = focused || filled;

  return (
    <div className="relative">
      <div
        style={{
          position: "relative",
          background: focused ? "#0f1117" : "#0a0c12",
          border: `1.5px solid ${error ? "#ef4444" : focused ? "#6366f1" : filled ? "#374151" : "#1f2937"}`,
          borderRadius: "12px",
          transition: "all 0.2s ease",
        }}
      >
        <label
          style={{
            position: "absolute",
            left: "14px",
            top: floated ? "10px" : "18px",
            fontSize: floated ? "10px" : "14px",
            color: error ? "#ef4444" : focused ? "#818cf8" : "#6b7280",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            letterSpacing: floated ? "0.08em" : "0",
            textTransform: floated ? "uppercase" : "none",
            transition: "all 0.18s ease",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          {label}
          {required && (
            <span style={{ color: "#f43f5e", marginLeft: "3px" }}>*</span>
          )}
        </label>
        <textarea
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={floated ? placeholder : ""}
          rows={4}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            paddingTop: "28px",
            paddingBottom: "12px",
            paddingLeft: "14px",
            paddingRight: "14px",
            color: "#f1f5f9",
            fontSize: "14px",
            fontFamily: "'DM Sans', sans-serif",
            resize: "vertical",
            boxSizing: "border-box",
          }}
        />
      </div>
      {error && (
        <p
          style={{
            color: "#ef4444",
            fontSize: "11px",
            marginTop: "4px",
            paddingLeft: "14px",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

function CheckboxField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      onClick={() => onChange(!value)}
      className="flex items-center gap-2.5 cursor-pointer p-3 bg-[#0a0c12] border-[1.5px] border-[#1f2937] rounded-xl transition-colors duration-200 select-none"
    >
      <div
        className={`
          w-4.5 h-4.5 rounded-md border-2 flex items-center justify-center transition-all duration-200 shrink-0
          ${value ? "bg-[#6366f1] border-[#6366f1]" : "bg-transparent border-[#374151]"}
        `}
      >
        {value && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span className="text-[#d1d5db] text-sm font-['DM_Sans',sans-serif]">
        {label}
      </span>
    </label>
  );
}

export default function EntityForm<T extends Record<string, any>>({
  fields,
  initialValues,
  mode,
  onSubmit,
  loading = false,
  onFieldChange, // add this
}: EntityFormProps<T>) {
  const {
    currentData: formData,
    setCurrentData: setFormData,
    hasChanges,
    markAsSubmitted,
    resetToLastSubmitted,
  } = useFormDirty<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  useEffect(() => {
    if (loading) setSubmitState("loading");
  }, [loading]);

  const handleChange = (name: keyof T, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    onFieldChange?.(name, value); // add this line
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof T, string>> = {};

    for (const field of fields) {
      const val = formData[field.name];

      // Required check
      if (field.required && (val === "" || val === null || val === undefined)) {
        newErrors[field.name] = `${field.label} is required`;
        continue; // skip further checks if already invalid
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    // Convert number fields from string → number before submitting
    const coerced = { ...formData };
    for (const field of fields) {
      if (field.type === "number" && coerced[field.name] !== "") {
        (coerced as any)[field.name] = Number(coerced[field.name]);
      }
    }

    setSubmitState("loading");
    try {
      if (!hasChanges) return;
      await onSubmit(coerced);
      setSubmitState("success");
      markAsSubmitted(); // Track successful submit
      setTimeout(() => setSubmitState("idle"), 3000);
    } catch (err: any) {
      setSubmitState("error");
      setErrorMessage(err?.message || "Something went wrong.");
      setTimeout(() => setSubmitState("idle"), 4000);
    }
  };

  // Group fields by section
  const sections = fields.reduce<Record<string, FormField<T>[]>>(
    (acc, field) => {
      const section = field.section || "General";
      if (!acc[section]) acc[section] = [];
      acc[section].push(field);
      return acc;
    },
    {},
  );

  const sectionNames = Object.keys(sections);

  const renderField = (field: FormField<T>) => {
    const error = errors[field.name];

    if (field.type === "select") {
      return (
        <FloatingSelect
          key={String(field.name)}
          label={field.label}
          value={formData[field.name]}
          onChange={(v) => handleChange(field.name, v)}
          options={field.options ?? []}
          required={field.required}
          error={error}
        />
      );
    }

    if (field.type === "checkbox") {
      return (
        <CheckboxField
          key={String(field.name)}
          label={field.label}
          value={formData[field.name] ?? false}
          onChange={(v) => handleChange(field.name, v)}
        />
      );
    }

    if (field.type === "textarea") {
      return (
        <FloatingTextarea
          key={String(field.name)}
          label={field.label}
          value={formData[field.name]}
          onChange={(v) => handleChange(field.name, v)}
          required={field.required}
          placeholder={field.placeholder}
          error={error}
        />
      );
    }

    return (
      <FloatingInput
        key={String(field.name)}
        label={field.label}
        type={
          field.type === "date"
            ? "date"
            : field.type === "number"
              ? "number"
              : "text"
        }
        value={formData[field.name]}
        onChange={(v) => handleChange(field.name, v)}
        required={field.required}
        placeholder={field.placeholder}
        prefix={field.prefix}
        suffix={field.suffix}
        error={error}
      />
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&display=swap');

        .entity-form-wrapper * {
          box-sizing: border-box;
        }

        .section-card {
          background: linear-gradient(145deg, #0d0f18 0%, #0a0c12 100%);
          border: 1px solid #1a1f2e;
          border-radius: 16px;
          padding: 28px;
          position: relative;
          overflow: hidden;
        }

        .section-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #6366f130, transparent);
        }

        .fields-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .fields-grid .full-width {
          grid-column: 1 / -1;
        }

        @media (max-width: 640px) {
          .fields-grid {
            grid-template-columns: 1fr;
          }
        }

        .submit-btn {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #6366f1, #818cf8);
          border: none;
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 14px 32px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px #6366f140;
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .submit-btn.success {
          background: linear-gradient(135deg, #10b981, #34d399);
        }

        .submit-btn.error-state {
          background: linear-gradient(135deg, #ef4444, #f87171);
        }

        .toast {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          animation: slideInRight 0.3s ease;
        }

        .toast.success {
          background: #10b98115;
          border: 1px solid #10b98130;
          color: #34d399;
        }

        .toast.error {
          background: #ef444415;
          border: 1px solid #ef444430;
          color: #f87171;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(16px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .section-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #6366f1;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, #6366f120, transparent);
        }
      `}</style>

      <div className="entity-form-wrapper">
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          {hasChanges && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-amber-600">
                📝 You have unsaved changes
              </span>
              <button
                type="button"
                onClick={resetToLastSubmitted}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Discard
              </button>
            </div>
          )}
          {sectionNames.map((sectionName) => (
            <div key={sectionName} className="section-card">
              <div className="section-label">{sectionName}</div>
              <div className="fields-grid">
                {sections[sectionName].map((field) => (
                  <div
                    key={String(field.name)}
                    className={
                      field.type === "textarea" ? "full-width" : undefined
                    }
                  >
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              paddingTop: "4px",
            }}
          >
            <div style={{ flex: 1 }}>
              {submitState === "success" && (
                <div className="toast success">
                  <svg
                    width="16"
                    height="16"
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
                  {mode === "create"
                    ? "Created successfully!"
                    : "Updated successfully!"}
                </div>
              )}
              {submitState === "error" && (
                <div className="toast error">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
                  </svg>
                  {errorMessage}
                </div>
              )}
              {Object.keys(errors).length > 0 && submitState === "idle" && (
                <div className="toast error">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Please fix {Object.keys(errors).length} field
                  {Object.keys(errors).length > 1 ? "s" : ""} above
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitState === "loading" || !hasChanges}
              className={`submit-btn ${submitState === "success" ? "success" : submitState === "error" ? "error-state" : ""}`}
            >
              {submitState === "loading" ? (
                <span className="flex items-center gap-2.5">
                  <span className="spinner" />
                  Saving...
                </span>
              ) : submitState === "success" ? (
                <span className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
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
                  Saved!
                </span>
              ) : mode === "create" ? (
                "Create"
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
