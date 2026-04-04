interface InventoryPageHeaderProps {
  totalCount?: number;
}

export default function InventoryPageHeader({
  totalCount,
}: InventoryPageHeaderProps) {
  return (
    <div className="border-b border-gray-200 pb-6 mb-0 py-2">
      <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400 mb-2">
        Vehicle Inventory
      </p>
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 leading-none">
          Browse Cars
        </h1>
        {totalCount !== undefined && (
          <span className="text-sm font-medium text-gray-400 pb-1">
            <span className="text-gray-900 font-bold">{totalCount}</span>{" "}
            {totalCount === 1 ? "vehicle" : "vehicles"} available
          </span>
        )}
      </div>
    </div>
  );
}
