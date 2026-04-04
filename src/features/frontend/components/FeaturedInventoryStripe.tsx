import { useQuery } from "@tanstack/react-query";
import { CarIcon, Fuel, Gauge, Settings, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GetInventoriesList } from "@/features/inventory/api";
import type { Inventory } from "@/features/inventory/types";
import type { CarRead } from "@/features/cars/types";

// --- Helpers ---
function formatPrice(price?: number) {
  if (!price) return "—";
  return "$" + price.toLocaleString();
}

function formatMileage(km?: number) {
  if (!km) return null;
  if (km >= 1000) return `${(km / 1000).toFixed(0)}k km`;
  return `${km} km`;
}

// --- Strip Card ---
function StripCard({
  unit,
  car,
  onClick,
}: {
  unit: Inventory;
  car: CarRead;
  onClick: () => void;
}) {
  const primary =
    unit?.media?.find((m) => m.is_primary) ?? unit?.media?.[0] ?? null;

  return (
    <div
      onClick={onClick}
      className="w-65 shrink-0 flex flex-col bg-white border border-gray-200 cursor-pointer hover:border-gray-400 transition-colors duration-200 group"
    >
      {/* Image */}
      <div className="relative w-full aspect-4/3 overflow-hidden bg-gray-100">
        {primary ? (
          <img
            src={primary.url}
            alt={primary.alt_text ?? `${car?.year} ${car?.make} ${car?.model}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CarIcon className="w-8 h-8 text-gray-300" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2">
        <div>
          <p className="text-[9px] font-semibold tracking-[0.18em] uppercase text-gray-400">
            {car?.make}
          </p>
          <p className="text-sm font-bold text-gray-900 leading-snug line-clamp-1">
            {car?.model} {car?.year}
          </p>
        </div>

        <div className="flex items-center gap-2.5 text-[10px] text-gray-400 font-medium">
          {car?.engine?.transmission && (
            <span className="flex items-center gap-1">
              <Settings className="w-2.5 h-2.5" />
              {car.engine.transmission === "automatic" ? "Auto" : "Manual"}
            </span>
          )}
          {car?.engine?.fuel_type && (
            <span className="flex items-center gap-1">
              <Fuel className="w-2.5 h-2.5" />
              {car.engine.fuel_type === "petrol" ? "Gas" : car.engine.fuel_type}
            </span>
          )}
          {unit?.mileage_km != null && (
            <span className="flex items-center gap-1">
              <Gauge className="w-2.5 h-2.5" />
              {formatMileage(unit.mileage_km)}
            </span>
          )}
        </div>

        <div className="pt-1.5 border-t border-gray-100">
          <span className="text-sm font-bold text-gray-900 tracking-tight">
            {formatPrice(unit?.selling_price)}
          </span>
        </div>
      </div>
    </div>
  );
}

// --- Skeleton ---
function StripSkeleton() {
  return (
    <div className="w-65 shrink-0 flex flex-col bg-white border border-gray-100">
      <div className="w-full aspect-4/3 bg-gray-100 animate-pulse" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-3 w-16 bg-gray-100 animate-pulse" />
        <div className="h-4 w-32 bg-gray-100 animate-pulse" />
        <div className="h-3 w-24 bg-gray-100 animate-pulse" />
        <div className="pt-1.5 border-t border-gray-100">
          <div className="h-4 w-20 bg-gray-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// --- Main ---
interface FeaturedInventoryStripProps {
  className?: string;
}

export default function FeaturedInventoryStrip({
  className = "",
}: FeaturedInventoryStripProps) {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<Inventory[]>({
    queryKey: ["inventory-featured"],
    queryFn: () => GetInventoriesList({ limit: 12 }),
  });

  const units = data ?? [];
  // Need at least a few cards to look good looping
  const doubled = units.length > 0 ? [...units, ...units] : [];

  return (
    <section className={`py-10 ${className}`}>
      {/* Header */}
      <div className="flex items-end justify-between mb-6 pb-4 border-b border-gray-200">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400 mb-1.5">
            Fresh Arrivals
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 leading-none">
            Latest Inventory
          </h2>
        </div>
        <button
          onClick={() => navigate("/inventory")}
          className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors pb-0.5"
        >
          Browse all <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Strip */}
      <div className="overflow-hidden w-full group">
        {isLoading ? (
          // Static skeleton row while loading
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <StripSkeleton key={i} />
            ))}
          </div>
        ) : units.length === 0 ? null : (
          <div className="flex gap-3 animate-marquee w-max group-hover:[animation-play-state:paused]">
            {doubled.map((unit, i) => (
              <StripCard
                key={`${unit?.id}-${i}`}
                unit={unit}
                car={unit.car}
                onClick={() => navigate(`/inventory/${unit.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edge fades */}
      <div className="relative pointer-events-none">
        <div className="absolute inset-y-0 left-0 w-16 bg-linear-to-r from-white to-transparent -translate-y-full" />
        <div className="absolute inset-y-0 right-0 w-16 bg-linear-to-l from-white to-transparent -translate-y-full" />
      </div>
    </section>
  );
}
