// features/inventory/components/InventoryFilters.tsx

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
    <div className="space-y-2">
      <label className="text-xs font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          {prefix && (
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
              {prefix}
            </span>
          )}
          <input
            type="number"
            placeholder="Min"
            value={values.min}
            step={step}
            onChange={(e) => onChange(minKey, e.target.value)}
            className={`w-full border border-gray-200 rounded-md bg-white text-sm text-gray-900 py-1.5 pr-2 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all ${prefix ? "pl-6" : "pl-2.5"}`}
          />
        </div>
        <span className="text-gray-300 text-xs">—</span>
        <div className="relative flex-1">
          {prefix && (
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
              {prefix}
            </span>
          )}
          <input
            type="number"
            placeholder="Max"
            value={values.max}
            step={step}
            onChange={(e) => onChange(maxKey, e.target.value)}
            className={`w-full border border-gray-200 rounded-md bg-white text-sm text-gray-900 py-1.5 pr-2 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all ${prefix ? "pl-6" : "pl-2.5"}`}
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
    <div className="space-y-2">
      <label className="text-xs font-medium text-gray-700">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(paramKey, e.target.value)}
          disabled={disabled}
          className="w-full border border-gray-200 rounded-md bg-white text-sm text-gray-900 py-1.5 pl-2.5 pr-7 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all appearance-none cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
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
          width="12"
          height="12"
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
  onFilterChange,
  onApply,
  onReset,
  resultCount,
  hasActiveFilters,
}: InventoryFiltersProps) {
  // Helper to update a single filter
  const updateFilter = (key: keyof InventoryFilterParams, value: string) => {
    if (value === "" || value == null) {
      // Remove the filter
      const { [key]: _, ...rest } = filters;
      onFilterChange(rest);

      // If clearing make, also clear model
      if (key === "make") {
        const { model, ...restWithoutModel } = rest as InventoryFilterParams;
        onFilterChange(restWithoutModel);
      }
    } else {
      // Add or update filter
      const newFilters = { ...filters, [key]: value };

      // If setting make, clear model
      if (key === "make") {
        const { model, ...rest } = newFilters;
        onFilterChange(rest);
      } else {
        onFilterChange(newFilters);
      }
    }
  };

  // Derive dynamic options from the full dataset
  const options = useMemo(() => {
    const makes = unique(data.map((d) => d.car.make ?? "").filter(Boolean));
    const models = unique(data.map((d) => d.car.model ?? "").filter(Boolean));
    const bodyTypes = unique(
      data.map((d) => d.car.category ?? d.car.category ?? "").filter(Boolean),
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

  // Filter models based on selected make
  const filteredModels = useMemo(() => {
    const selectedMake = filters.make;
    if (!selectedMake) return options.models;

    const modelsForMake = unique(
      data
        .filter((d) => d.car.make === selectedMake)
        .map((d) => d.car.model ?? "")
        .filter(Boolean),
    );

    return modelsForMake;
  }, [data, filters.make, options.models]);

  const activeFilterCount = Object.keys(filters).length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
            {resultCount !== undefined && (
              <p className="text-xs text-gray-500 mt-0.5">
                {resultCount} results
              </p>
            )}
          </div>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
              {activeFilterCount} active
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Make */}
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

        {/* Model */}
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

        {/* Price */}
        <RangeInput
          label="Price Range"
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

        {/* Year */}
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

        {/* Mileage */}
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

        {/* Condition */}
        <SelectInput
          label="Condition"
          paramKey="condition"
          value={filters.condition ?? ""}
          options={options.conditions}
          onChange={(key, val) =>
            updateFilter(key as keyof InventoryFilterParams, val)
          }
        />

        {/* Body Type */}
        <SelectInput
          label="Body Type"
          paramKey="body_type"
          value={filters.body_type ?? ""}
          options={options.bodyTypes}
          onChange={(key, val) =>
            updateFilter(key as keyof InventoryFilterParams, val)
          }
        />

        {/* Fuel Type */}
        <SelectInput
          label="Fuel Type"
          paramKey="fuel_type"
          value={filters.fuel_type ?? ""}
          options={options.fuelTypes}
          onChange={(key, val) =>
            updateFilter(key as keyof InventoryFilterParams, val)
          }
        />

        {/* Transmission */}
        <SelectInput
          label="Transmission"
          paramKey="transmission_type"
          value={filters.transmission_type ?? ""}
          options={options.transmissions}
          onChange={(key, val) =>
            updateFilter(key as keyof InventoryFilterParams, val)
          }
        />

        {/* Action Buttons */}
        <div className="pt-2 space-y-2">
          <button
            onClick={onApply}
            className="w-full bg-gray-900 text-white text-sm font-medium py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Apply Filters
          </button>
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="w-full border border-gray-200 text-sm font-medium text-gray-600 py-2 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              Reset all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
