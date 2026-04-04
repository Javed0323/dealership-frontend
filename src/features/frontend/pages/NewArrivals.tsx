// features/inventory/pages/NewArrivalsPage.tsx

import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { GetLatestInventories } from "@/features/inventory/api";
import type { Inventory } from "@/features/inventory/types";
import { Sparkles, ArrowRight } from "lucide-react";
import InventoryCard from "../components/CarCard";

export function NewArrivalsPage() {
  const navigate = useNavigate();
  const { data: inventory, isLoading } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => GetLatestInventories({ limit: 9, ordering: "-created_at" }),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading new arrivals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 mb-3">
            <Sparkles className="h-4 w-4" />
            <span>Fresh Arrivals</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Just Landed
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Be the first to drive these recently added vehicles
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventory?.map((unit: Inventory) => (
            <InventoryCard
              key={unit.id}
              unit={unit}
              car={unit.car}
              onClick={() => navigate(`/inventory/${unit.id}`)}
            />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/inventory")}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            View All Inventory
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
