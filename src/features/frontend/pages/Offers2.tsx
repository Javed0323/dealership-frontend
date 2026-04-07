import { useQuery } from "@tanstack/react-query";
import { Tag, Clock } from "lucide-react";
import { GetOffers } from "@/features/inventory/api";
import type { Offer } from "@/features/offers/types";

// --- Helpers ---
function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDaysLeft(endDateStr: string) {
  const diff = new Date(endDateStr).getTime() - Date.now();
  if (diff <= 0) return null;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// --- Sub-components ---
function OfferCard({ offer }: { offer: Offer }) {
  const daysLeft = getDaysLeft(offer.end_date);
  const isExpiringSoon = daysLeft !== null && daysLeft <= 5;

  return (
    <div className="group flex flex-col bg-white border border-gray-200 hover:border-gray-900 transition-colors duration-200 cursor-default">
      {/* Top accent bar */}
      <div className="h-0.5 w-0 bg-gray-900 group-hover:w-full transition-all duration-300" />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Discount + badge row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-baseline gap-0.5">
            <span className="text-5xl font-black tracking-tighter text-gray-900 leading-none">
              {String(offer.discount_percentage)}
            </span>
            <span className="text-lg font-bold text-gray-900 pb-1">% OFF</span>
          </div>

          {daysLeft !== null && (
            <span
              className={`flex items-center gap-1 text-[10px] font-semibold tracking-widest uppercase px-2 py-1 border mt-1 ${
                isExpiringSoon
                  ? "border-red-200 bg-red-50 text-red-600"
                  : "border-gray-200 bg-gray-50 text-gray-500"
              }`}
            >
              <Clock className="w-2.5 h-2.5" />
              {isExpiringSoon ? `${daysLeft}d left` : `${daysLeft}d left`}
            </span>
          )}
        </div>

        {/* Title & description */}
        <div className="flex flex-col gap-1.5 flex-1">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide leading-snug">
            {String(offer.title)}
          </h3>
          {offer.description && (
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
              {String(offer.description)}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-semibold tracking-[0.18em] uppercase text-gray-400">
              Valid
            </span>
            <span className="text-[11px] text-gray-500 font-medium">
              {formatDate(offer.start_date)} — {formatDate(offer.end_date)}
            </span>
          </div>
          <Tag className="w-3.5 h-3.5 text-gray-300 shrink-0" />
        </div>
      </div>
    </div>
  );
}

function OfferSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-gray-100 p-5 gap-4">
      <div className="flex items-start justify-between">
        <div className="h-12 w-28 bg-gray-100 animate-pulse" />
        <div className="h-6 w-16 bg-gray-100 animate-pulse mt-1" />
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-4 w-3/4 bg-gray-100 animate-pulse" />
        <div className="h-3 w-full bg-gray-100 animate-pulse" />
        <div className="h-3 w-2/3 bg-gray-100 animate-pulse" />
      </div>
      <div className="pt-3 border-t border-gray-100">
        <div className="h-3 w-40 bg-gray-100 animate-pulse" />
      </div>
    </div>
  );
}

// --- Props ---
interface OffersSectionProps {
  /** Max number of offers to display. Omit to show all. */
  limit?: number;
  /** Show a "View all offers" link */
  showViewAll?: boolean;
  onViewAll?: () => void;
  className?: string;
}

// --- Main Component ---
export default function OffersSection({
  limit,
  className = "",
}: OffersSectionProps) {
  const {
    data: offers,
    isLoading,
    isError,
  } = useQuery<Offer[]>({
    queryKey: ["offers"],
    queryFn: GetOffers,
  });

  const activeOffers = (offers?.filter((o) => o.is_active) ?? []).slice(
    0,
    limit,
  );

  if (!isLoading && !isError && activeOffers.length === 0) return null;

  return (
    <section className={`py-10 px-6 ${className}`}>
      {/* Header */}
      <div className="flex items-end justify-between mb-6 pb-4 border-b border-gray-200">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400 mb-1.5">
            Limited Time
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 leading-none">
            Current Offers
          </h2>
        </div>
      </div>

      {/* Grid */}
      {isError ? (
        <p className="text-sm text-gray-400">Could not load offers.</p>
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
          {Array.from({ length: limit ?? 3 }).map((_, i) => (
            <OfferSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
          {activeOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </section>
  );
}
