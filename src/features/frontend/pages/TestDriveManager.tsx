// TestDriveManager.tsx (refactored)
import { useQuery } from "@tanstack/react-query";
import { BookTestDriveButton } from "@/shared/components/BookTestDriveButton";
import { NotificationToast } from "@/shared/components/NotificationToast";
import { useTestDriveBooking } from "@/shared/hooks/useTestDriveBooking";
import { GetInventories } from "@/features/inventory/api";
import type { Inventory } from "@/features/inventory/types";
import { CarIcon, CheckCircle } from "lucide-react";

const TestDriveManager: React.FC = () => {
  const { bookedUnitIds, notification } = useTestDriveBooking();
  const { data: units, isLoading } = useQuery({
    queryKey: ["inventories"],
    queryFn: GetInventories,
  });

  if (isLoading) {
    return <div>Loading...</div>; // Your loading skeleton
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationToast {...notification} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Book a Test Drive
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Choose a vehicle to schedule your test drive experience
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {units?.map((unit: Inventory) => {
            const isBooked = bookedUnitIds.has(unit.id);
            const primaryImage =
              unit?.media?.find((m) => m.is_primary) ?? unit?.media?.[0];

            return (
              <div
                key={unit.id}
                className="bg-white border border-gray-200 flex flex-col relative"
              >
                {isBooked && (
                  <div className="absolute top-2 right-2 z-10">
                    <div className="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Booked
                    </div>
                  </div>
                )}

                <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
                  {primaryImage ? (
                    <img
                      src={primaryImage.url}
                      alt={`${unit.car?.make} ${unit.car?.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <CarIcon className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    {unit.car?.year} {unit.car?.make} {unit.car?.model}
                  </h3>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <span className="text-base font-semibold text-gray-900">
                      ${unit.selling_price?.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {unit.mileage_km?.toLocaleString()} km
                    </span>
                  </div>

                  <BookTestDriveButton
                    inventoryId={String(unit.id)}
                    inventoryName={`${unit.car?.year} ${unit.car?.make} ${unit.car?.model}`}
                    variant="outline"
                    className="w-full mt-2"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TestDriveManager;
