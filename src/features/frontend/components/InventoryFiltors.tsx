// features/components/InventoryFilters.tsx

import { useMemo } from "react";
import type { Inventory } from "@/features/inventory/types";
import type { CarRead } from "@/features/cars/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InventoryFilterParams {
  selling_price__gte?: string;
  selling_price__lte?: string;
  mileage_km__gte?: string;
  mileage_km__lte?: string;
  condition?: string;
  make?: string;
  model?: string;
  year__gte?: string;
  year__lte?: string;
  body_type?: string;
  fuel_type?: string;
  transmission_type?: string;
}

export interface InventoryWithCar {
  unit: Inventory;
  car: CarRead;
}

interface InventoryFiltersProps {
  data: InventoryWithCar[];
  filters: InventoryFilterParams;
  appliedFilterCount: number; // count from parent's appliedFilters, not pendingFilters
  onFilterChange: (filters: InventoryFilterParams) => void;
  onApply: () => void;
  onReset: () => void;
  resultCount?: number;
  hasActiveFilters: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr.filter((v) => v != null && v !== "")));
}

function RangeInput({
  label,
  minKey,
  maxKey,
  values,
  onChange,
  prefix,
  suffix,
  step = 1,
}: {
  label: string;
  minKey: string;
  maxKey: string;
  values: { min: string; max: string };
  onChange: (key: string, val: string) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          {prefix && (
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
              {prefix}
            </span>
          )}
          <input
            type="number"
            placeholder="Min"
            value={values.min}
            step={step}
            onChange={(e) => onChange(minKey, e.target.value)}
            className={`w-full border border-gray-200 bg-white text-sm text-gray-900 py-1.5 pr-2 outline-none focus:border-gray-500 transition-colors ${
              prefix ? "pl-6" : "pl-2.5"
            }`}
          />
        </div>
        <span className="text-gray-300 text-xs shrink-0">—</span>
        <div className="relative flex-1">
          {prefix && (
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
              {prefix}
            </span>
          )}
          <input
            type="number"
            placeholder="Max"
            value={values.max}
            step={step}
            onChange={(e) => onChange(maxKey, e.target.value)}
            className={`w-full border border-gray-200 bg-white text-sm text-gray-900 py-1.5 pr-2 outline-none focus:border-gray-500 transition-colors ${
              prefix ? "pl-6" : suffix ? "pl-2.5 pr-10" : "pl-2.5"
            }`}
          />
          {suffix && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
              {suffix}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SelectInput({
  label,
  value,
  options,
  paramKey,
  onChange,
  placeholder = "Any",
  disabled = false,
}: {
  label: string;
  value: string;
  options: string[];
  paramKey: string;
  onChange: (key: string, val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(paramKey, e.target.value)}
          disabled={disabled}
          className="w-full border border-gray-200 bg-white text-sm text-gray-900 py-1.5 pl-2.5 pr-7 outline-none focus:border-gray-500 transition-colors appearance-none cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
          width="11"
          height="11"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="square"
          />
        </svg>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InventoryFilters({
  data,
  filters,
  appliedFilterCount,
  onFilterChange,
  onApply,
  onReset,
  resultCount,
  hasActiveFilters,
}: InventoryFiltersProps) {
  const updateFilter = (key: keyof InventoryFilterParams, value: string) => {
    if (value === "" || value == null) {
      const { [key]: _, ...rest } = filters;

      // If clearing make, also clear model
      if (key === "make") {
        const { model, ...restWithoutModel } = rest as InventoryFilterParams;
        onFilterChange(restWithoutModel);
      } else {
        onFilterChange(rest);
      }
    } else {
      const newFilters = { ...filters, [key]: value };

      // If setting a new make, clear any previously selected model
      if (key === "make") {
        const { model, ...rest } = newFilters;
        onFilterChange(rest);
      } else {
        onFilterChange(newFilters);
      }
    }
  };

  const options = useMemo(() => {
    const makes = unique(data.map((d) => d.car.make ?? "").filter(Boolean));
    const models = unique(data.map((d) => d.car.model ?? "").filter(Boolean));
    const bodyTypes = unique(
      // Fix: was `d.car.category ?? d.car.category` (same field twice)
      data.map((d) => d.car.segment ?? d.car.category ?? "").filter(Boolean),
    );
    const fuelTypes = unique(
      data.map((d) => d.car.engine?.fuel_type ?? "").filter(Boolean),
    );
    const transmissions = unique(
      data.map((d) => d.car.engine?.transmission ?? "").filter(Boolean),
    );
    const conditions = unique(data.map((d) => d.unit.condition));

    return { makes, models, bodyTypes, fuelTypes, transmissions, conditions };
  }, [data]);

  const filteredModels = useMemo(() => {
    if (!filters.make) return options.models;
    return unique(
      data
        .filter((d) => d.car.make === filters.make)
        .map((d) => d.car.model ?? "")
        .filter(Boolean),
    );
  }, [data, filters.make, options.models]);

  return (
    <div className="bg-white border border-gray-200 overflow-hidden">
      {/* Header — plain border, no background tint */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">Filters</span>
          {appliedFilterCount > 0 && (
            <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium bg-gray-900 text-white">
              {appliedFilterCount}
            </span>
          )}
        </div>
        {resultCount !== undefined && (
          <span className="text-xs text-gray-400">{resultCount} results</span>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Make / Model */}
        <SelectInput
          label="Make"
          paramKey="make"
          value={filters.make ?? ""}
          options={options.makes}
          onChange={(key, val) =>
            updateFilter(key as keyof InventoryFilterParams, val)
          }
          placeholder="All makes"
        />
        <SelectInput
          label="Model"
          paramKey="model"
          value={filters.model ?? ""}
          options={filteredModels}
          onChange={(key, val) =>
            updateFilter(key as keyof InventoryFilterParams, val)
          }
          placeholder={!filters.make ? "Select make first" : "All models"}
          disabled={!filters.make}
        />

        <div className="h-px bg-gray-100" />

        {/* Price / Year / Mileage */}
        <RangeInput
          label="Price"
          minKey="selling_price__gte"
          maxKey="selling_price__lte"
          values={{
            min: filters.selling_price__gte ?? "",
            max: filters.selling_price__lte ?? "",
          }}
          onChange={(key, val) =>
            updateFilter(key as keyof InventoryFilterParams, val)
          }
          prefix="$"
          step={1000}
        />
        <RangeInput
          label="Year"
          minKey="year__gte"
          maxKey="year__lte"
          values={{
            min: filters.year__gte ?? "",
            max: filters.year__lte ?? "",
          }}
          onChange={(key, val) =>
            updateFilter(key as keyof InventoryFilterParams, val)
          }
          step={1}
        />
        <RangeInput
          label="Mileage"
          minKey="mileage_km__gte"
          maxKey="mileage_km__lte"
          values={{
            min: filters.mileage_km__gte ?? "",
            max: filters.mileage_km__lte ?? "",
          }}
          onChange={(key, val) =>
            updateFilter(key as keyof InventoryFilterParams, val)
          }
          suffix="km"
          step={5000}
        />

        <div className="h-px bg-gray-100" />

        {/* Condition / Body / Fuel / Transmission */}
        <SelectInput
          label="Condition"
          paramKey="condition"
          value={filters.condition ?? ""}
          options={options.conditions}
          onChange={(key, val) =>
            updateFilter(key as keyof InventoryFilterParams, val)
          }
        />
        <SelectInput
          label="Body Type"
          paramKey="body_type"
          value={filters.body_type ?? ""}
          options={options.bodyTypes}
          onChange={(key, val) =>
            updateFilter(key as keyof InventoryFilterParams, val)
          }
        />
        <SelectInput
          label="Fuel Type"
          paramKey="fuel_type"
          value={filters.fuel_type ?? ""}
          options={options.fuelTypes}
          onChange={(key, val) =>
            updateFilter(key as keyof InventoryFilterParams, val)
          }
        />
        <SelectInput
          label="Transmission"
          paramKey="transmission_type"
          value={filters.transmission_type ?? ""}
          options={options.transmissions}
          onChange={(key, val) =>
            updateFilter(key as keyof InventoryFilterParams, val)
          }
        />

        {/* Action buttons */}
        <div className="pt-1 space-y-2">
          <button
            onClick={onApply}
            className="w-full bg-gray-900 text-white text-sm font-medium py-2 hover:bg-gray-800 transition-colors"
          >
            Apply Filters
          </button>
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="w-full border border-gray-200 text-sm font-medium text-gray-600 py-2 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              Reset all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
