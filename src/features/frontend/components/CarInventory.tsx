// features/inventory/InventoryPage.tsx

import { Fragment, useCallback, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SearchCars } from "@/features/cars/api";
import InventoryFilters, {
  type InventoryFilterParams,
  type InventoryWithCar,
} from "./InventoryFiltors";
import InventoryCard from "../components/CarCard";
import { GetOffers } from "@/features/offers/api";
import type { Offer } from "@/features/offers/types";
import BrowseTabs from "./BrowseTabs";
import InventoryPageHeader from "./InventoryPageHeader";
import InventorySearchBar from "./InventorySearchBar";
import { useDebounce } from "@/shared/hooks/useDebounce";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="bg-white border border-neutral-200 flex flex-col animate-pulse">
      <div className="aspect-video bg-zinc-100" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-zinc-100 w-3/4" />
        <div className="h-3 bg-zinc-100 w-1/2" />
        <div className="h-px bg-zinc-100 mt-auto" />
        <div className="flex justify-between pt-1">
          <div className="h-5 bg-zinc-100 w-24" />
          <div className="h-3 bg-zinc-100 w-20" />
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const PAGE_SIZE = 12;

export default function InventoryPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pendingFilters, setPendingFilters] = useState<InventoryFilterParams>(
    {},
  );
  const isInventoryPage = useLocation().pathname === "/inventory";
  const [appliedFilters, setAppliedFilters] = useState<InventoryFilterParams>(
    {},
  );
  const [filterMake, setFilterMake] = useState<string | null>(null);
  const [filterModel, setFilterModel] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Debounce search — this drives the query directly, no Apply needed
  const debouncedSearch = useDebounce(search, 400);

  const offset = Number(searchParams.get("offset") ?? 0);
  const sort = searchParams.get("sort") ?? undefined;

  const applyFilters = useCallback(() => {
    setAppliedFilters(pendingFilters);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("offset");
      return next;
    });
  }, [pendingFilters, setSearchParams]);

  const resetFilters = useCallback(() => {
    setPendingFilters({});
    setAppliedFilters({});
    setSearchParams((prev) => {
      const next = new URLSearchParams();
      if (prev.has("sort")) next.set("sort", prev.get("sort")!);
      return next;
    });
  }, [setSearchParams]);

  // Build query params — debouncedSearch is included directly so React Query
  // refetches automatically when it changes, with no useEffect needed.
  const queryParams = {
    limit: PAGE_SIZE,
    offset,
    ...(sort ? { sort } : {}),
    ...appliedFilters,
    ...(filterMake ? { make: filterMake } : {}),
    ...(filterModel ? { model: filterModel } : {}),
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["inventory-search", queryParams],
    queryFn: () => SearchCars(queryParams),
    placeholderData: (prev) => prev,
  });

  const { data: offers } = useQuery({
    queryKey: ["offers"],
    queryFn: GetOffers,
  });

  // Fetch all data once for filter option derivation
  const { data: allData } = useQuery({
    queryKey: ["inventory-search-all"],
    queryFn: () => SearchCars({ limit: 1000, offset: 0 }),
    staleTime: 5 * 60 * 1000,
  });

  const handlePageChange = (newOffset: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("offset", String(newOffset));
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const units: InventoryWithCar[] = (data?.results ?? []).map((item: any) => ({
    unit: item,
    car: item.car,
  }));

  const allUnits: InventoryWithCar[] = (allData?.results ?? []).map(
    (item: any) => ({
      unit: item,
      car: item.car,
    }),
  );

  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  const hasActiveFilters = Object.keys(appliedFilters).length > 0;
  const appliedFilterCount = Object.keys(appliedFilters).length;

  return (
    <div className="min-h-screen px-6 py-10">
      {isInventoryPage && (
        <>
          <InventoryPageHeader totalCount={total} />
          <InventorySearchBar value={search} onChange={setSearch} />
        </>
      )}

      {/* ── Sticky sort bar ─────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end h-12">
            {isInventoryPage && (
              <div className="flex items-center gap-4">
                {!isLoading && total > 0 && (
                  <span className="text-xs text-gray-400 hidden sm:inline">
                    {total} vehicles
                  </span>
                )}
                <select
                  value={sort ?? ""}
                  onChange={(e) => {
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);
                      if (e.target.value) next.set("sort", e.target.value);
                      else next.delete("sort");
                      next.delete("offset");
                      return next;
                    });
                  }}
                  className="border border-gray-200 bg-white text-xs text-gray-700 py-1.5 pl-3 pr-7 outline-none focus:border-gray-400 transition-all cursor-pointer"
                >
                  <option value="">Sort: Featured</option>
                  <option value="selling_price">Price: Low to High</option>
                  <option value="-selling_price">Price: High to Low</option>
                  <option value="-year">Year: Newest First</option>
                  <option value="year">Year: Oldest First</option>
                  <option value="mileage_km">Mileage: Low to High</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          {isInventoryPage && (
            <div className="lg:w-72 shrink-0">
              <div className="sticky top-16">
                <InventoryFilters
                  data={allUnits}
                  filters={pendingFilters}
                  appliedFilterCount={appliedFilterCount}
                  onFilterChange={setPendingFilters}
                  onApply={applyFilters}
                  onReset={resetFilters}
                  resultCount={total}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
            </div>
          )}

          {/* Results grid */}
          <div className="flex-1 min-w-0">
            <BrowseTabs
              onBrandSelect={(brand) => setFilterMake(brand)}
              onModelSelect={(model) => setFilterModel(model)}
            />

            {isError ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <p className="text-sm text-gray-500">
                  Failed to load inventory.
                </p>
                <button
                  onClick={() => refetch()}
                  className="text-xs font-medium text-gray-600 hover:text-gray-900 underline"
                >
                  Try again
                </button>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : units.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="text-center">
                  <p className="text-base font-medium text-gray-900 mb-1">
                    No vehicles found
                  </p>
                  <p className="text-sm text-gray-500">
                    Try adjusting your filters or search term.
                  </p>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 ${
                    isInventoryPage ? "lg:grid-cols-3" : "lg:grid-cols-4"
                  } gap-5`}
                >
                  {units.map(({ unit, car }) => {
                    const offer =
                      offers?.find(
                        (o: Offer) => o.inventory_id === unit.id && o.is_active,
                      ) ?? null;

                    // Key must be on the outermost element returned from map
                    return (
                      <Fragment key={unit.id}>
                        <InventoryCard
                          unit={unit}
                          car={car}
                          offer={offer}
                          onClick={() => navigate(`/inventory/${unit.id}`)}
                        />
                      </Fragment>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-200">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(offset - PAGE_SIZE)}
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }).map((_, i) => {
                        const page = i + 1;
                        const isActive = page === currentPage;
                        const show =
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1;
                        const showEllipsis =
                          !show && (page === 2 || page === totalPages - 1);

                        if (showEllipsis) {
                          return (
                            <span
                              key={i}
                              className="text-gray-400 text-sm px-1"
                            >
                              ···
                            </span>
                          );
                        }
                        if (!show) return null;

                        return (
                          <button
                            key={i}
                            onClick={() => handlePageChange(i * PAGE_SIZE)}
                            className={`min-w-8 h-8 text-sm font-medium transition-colors ${
                              isActive
                                ? "bg-gray-900 text-white"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(offset + PAGE_SIZE)}
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
