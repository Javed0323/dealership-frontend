import { useState } from "react";

// --- Types ---
interface BrandTab {
  label: string;
  logo: string; // SVG path or letter fallback
}

interface ModelTab {
  label: string;
  brand: string;
}

type TabGroup = "brands" | "models";

// --- Data ---
const BRANDS: BrandTab[] = [
  { label: "Toyota", logo: "T" },
  { label: "BMW", logo: "B" },
  { label: "Mercedes", logo: "M" },
  { label: "Honda", logo: "H" },
  { label: "Audi", logo: "A" },
  { label: "Ford", logo: "F" },
  { label: "Nissan", logo: "N" },
  { label: "Hyundai", logo: "H" },
  { label: "All", logo: "∞" }, // ← added "All" option
];

const MODELS: ModelTab[] = [
  { label: "Camry", brand: "Toyota" },
  { label: "Corolla", brand: "Toyota" },
  { label: "3 Series", brand: "BMW" },
  { label: "C-Class", brand: "Mercedes" },
  { label: "Civic", brand: "Honda" },
  { label: "A4", brand: "Audi" },
  { label: "Mustang", brand: "Ford" },
  { label: "Altima", brand: "Nissan" },
  { label: "Elantra", brand: "Hyundai" },
  { label: "All", brand: "" }, // ← added "All" option
];

// --- Props ---
interface BrowseTabsProps {
  onBrandSelect?: (brand: string) => void;
  onModelSelect?: (model: string) => void;
}

export default function BrowseTabs({
  onBrandSelect,
  onModelSelect,
}: BrowseTabsProps) {
  const [activeGroup, setActiveGroup] = useState<TabGroup>("brands");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  function handleBrandClick(brand: string) {
    if (brand === "All") {
      setSelectedBrand(null);
      onBrandSelect?.("");
      return;
    }
    const next = selectedBrand === brand ? null : brand;
    setSelectedBrand(next);
    onBrandSelect?.(next ?? "");
  }

  function handleModelClick(model: string) {
    if (model === "All") {
      setSelectedModel(null);
      onModelSelect?.("");
      return;
    }
    const next = selectedModel === model ? null : model;
    setSelectedModel(next);
    onModelSelect?.(next ?? "");
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@500&display=swap');

        .bt-root {
          font-family: 'DM Sans', sans-serif;
          padding: 5px 0 32px;
        }

        .bt-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .bt-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #9ca3af;
        }

        .bt-toggle {
          display: flex;
          align-items: center;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          padding: 3px;
          gap: 2px;
        }

        .bt-toggle-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          padding: 5px 14px;
          border: none;
          background: transparent;
          color: #9ca3af;
          cursor: pointer;
          transition: all 0.15s ease;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .bt-toggle-btn.active {
          background: #111827;
          color: #fff;
        }

        .bt-toggle-btn:not(.active):hover {
          color: #374151;
        }

        /* Pills track */
        .bt-track {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        /* Brand pill */
        .bt-brand-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px 8px 8px;
          border: 1px solid #e5e7eb;
          background: #fff;
          cursor: pointer;
          transition: all 0.15s ease;
          user-select: none;
        }

        .bt-brand-pill:hover {
          border-color: #d1d5db;
          background: #f9fafb;
        }

        .bt-brand-pill.selected {
          border-color: #111827;
          background: #111827;
        }

        .bt-brand-logo {
          width: 28px;
          height: 28px;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          color: #6b7280;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }

        .bt-brand-pill.selected .bt-brand-logo {
          background: #1f2937;
          color: #9ca3af;
        }

        .bt-brand-name {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          letter-spacing: 0.01em;
          transition: color 0.15s ease;
        }

        .bt-brand-pill.selected .bt-brand-name {
          color: #fff;
        }

        /* Model pill */
        .bt-model-pill {
          display: flex;
          flex-direction: column;
          padding: 10px 16px;
          border: 1px solid #e5e7eb;
          background: #fff;
          cursor: pointer;
          transition: all 0.15s ease;
          user-select: none;
          min-width: 96px;
        }

        .bt-model-pill:hover {
          border-color: #d1d5db;
          background: #f9fafb;
        }

        .bt-model-pill.selected {
          border-color: #111827;
          background: #111827;
        }

        .bt-model-name {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          letter-spacing: 0.01em;
          transition: color 0.15s ease;
        }

        .bt-model-pill.selected .bt-model-name {
          color: #fff;
        }

        .bt-model-brand {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          color: #9ca3af;
          letter-spacing: 0.1em;
          margin-top: 2px;
          text-transform: uppercase;
          transition: color 0.15s ease;
        }

        .bt-model-pill.selected .bt-model-brand {
          color: #4b5563;
        }

        /* Hint */
        .bt-hint {
          margin-top: 14px;
          font-size: 11px;
          color: #9ca3af;
          letter-spacing: 0.02em;
        }

        .bt-hint span {
          color: #111827;
          font-weight: 600;
        }

        /* Fade-in animation */
        .bt-track {
          animation: bt-fade 0.18s ease;
        }

        @keyframes bt-fade {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="bt-root">
        <div className="bt-header">
          <p className="bt-label">Browse by</p>

          <div className="bt-toggle">
            <button
              className={`bt-toggle-btn ${activeGroup === "brands" ? "active" : ""}`}
              onClick={() => {
                setActiveGroup("brands");
                setSelectedBrand(null);
                setSelectedModel(null);
                onBrandSelect?.(""); // ← clear brand filter
                onModelSelect?.(""); // ← clear model filter too
              }}
            >
              Popular Brands
            </button>

            <button
              className={`bt-toggle-btn ${activeGroup === "models" ? "active" : ""}`}
              onClick={() => {
                setActiveGroup("models");
                setSelectedBrand(null);
                setSelectedModel(null);
                onModelSelect?.(""); // ← clear model filter
                onBrandSelect?.(""); // ← clear brand filter too
              }}
            >
              Popular Models
            </button>
          </div>
        </div>

        {activeGroup === "brands" && (
          <>
            <div className="bt-track">
              {BRANDS.map((brand) => (
                <button
                  key={brand.label}
                  className={`bt-brand-pill ${
                    (brand.label === "All" && !selectedBrand) ||
                    selectedBrand === brand.label
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleBrandClick(brand.label)}
                >
                  <div className="bt-brand-logo">{brand.logo}</div>
                  <span className="bt-brand-name">{brand.label}</span>
                </button>
              ))}
            </div>
            {selectedBrand && (
              <p className="bt-hint">
                Showing results for <span>{selectedBrand}</span>
              </p>
            )}
          </>
        )}

        {activeGroup === "models" && (
          <>
            <div className="bt-track">
              {MODELS.map((model) => (
                <button
                  key={model.label}
                  className={`bt-model-pill ${
                    (model.label === "All" && !selectedModel) ||
                    selectedModel === model.label
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleModelClick(model.label)}
                >
                  <span className="bt-model-name">{model.label}</span>
                  <span className="bt-model-brand">{model.brand}</span>
                </button>
              ))}
            </div>
            {selectedModel && (
              <p className="bt-hint">
                Showing results for <span>{selectedModel}</span>
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
}
