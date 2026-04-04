import { Search, X } from "lucide-react";

interface InventorySearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function InventorySearchBar({
  value,
  onChange,
  placeholder = "Search by make, model, or keyword...",
}: InventorySearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full h-11 pl-11 pr-10
          border border-gray-200 bg-white
          text-sm text-gray-900 placeholder:text-gray-400
          focus:outline-none focus:border-gray-400
          transition-colors duration-150
        "
      />

      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
