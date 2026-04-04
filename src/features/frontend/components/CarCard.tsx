// features/inventory/components/InventoryCard.tsx

import { CarIcon, Fuel, Gauge, Settings } from "lucide-react";
import type { Inventory } from "@/features/inventory/types";
import type { CarRead } from "@/features/cars/types";
import type { Offer } from "@/features/offers/types";

interface InventoryCardProps {
  unit: Inventory;
  car: CarRead;
  offer?: Offer | null; // add this
  onClick?: () => void;
}

export default function InventoryCard({
  unit,
  car,
  offer,
  onClick,
}: InventoryCardProps) {
  const primary =
    unit?.media?.find((m) => m.is_primary) ?? unit?.media?.[0] ?? null;

  const sellingPrice = unit?.selling_price ?? 0;

  const discountedPrice = offer?.is_active
    ? sellingPrice - (sellingPrice * Number(offer.discount_percentage)) / 100
    : null;

  const displayPrice = discountedPrice ?? sellingPrice;

  const formatMileage = (km?: number) => {
    if (km === 0) return 0;
    if (!km) return null;
    if (km >= 1_000_000) return `${(km / 1_000_000).toFixed(1)}M`;
    if (km >= 1000) return `${(km / 1000).toFixed(0)}k`;
    return km.toLocaleString();
  };

  return (
    <div
      onClick={onClick}
      className="group flex flex-col bg-white border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors duration-200"
    >
      {/* Image */}
      <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
        {primary ? (
          <img
            src={primary.url}
            alt={primary.alt_text ?? `${car?.year} ${car?.make} ${car?.model}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CarIcon className="w-10 h-10 text-gray-300" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-2">
        {/* Title */}
        <p className="text-[11px] font-medium tracking-widest text-gray-400 uppercase mb-0.5">
          {car?.make}
        </p>
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-1">
            {car?.model}
          </h3>
          <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-1">
            {car?.year}
          </h3>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Specs row */}
        <div className="flex items-center gap-2.5 text-[11px] text-gray-500">
          {car?.engine?.transmission && (
            <div className="flex items-center gap-1">
              <Settings className="w-3 h-3 shrink-0" />
              <span className="font-medium">
                {car.engine.transmission === "automatic" ? "Auto" : "Manual"}
              </span>
            </div>
          )}
          {car?.engine?.fuel_type && (
            <div className="flex items-center gap-1">
              <Fuel className="w-3 h-3 shrink-0" />
              <span className="font-medium capitalize">
                {car.engine.fuel_type === "petrol"
                  ? "Gas"
                  : car.engine.fuel_type}
              </span>
            </div>
          )}
          {unit?.mileage_km != null && (
            <div className="flex items-center gap-1">
              <Gauge className="w-3 h-3 shrink-0" />
              <span className="font-medium">
                {formatMileage(unit.mileage_km)} km
              </span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-base font-bold text-gray-900 tracking-tight">
            ${displayPrice.toLocaleString()}
          </span>
          {discountedPrice !== null && (
            <span className="text-xs text-gray-400 line-through">
              ${sellingPrice.toLocaleString()}
            </span>
          )}
          {discountedPrice !== null && (
            <span className="text-[10px] font-semibold text-emerald-600 tracking-wide uppercase">
              -{Number(offer!.discount_percentage)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
