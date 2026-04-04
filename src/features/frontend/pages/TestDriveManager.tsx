import { useEffect, useState } from "react";
import BookTestDrive from "./BookTestDrive";
import { CreateTestDrive } from "../api";
import type { TestDrive } from "@/features/test_drives/types";
import { GetInventories } from "@/features/inventory/api";
import type { Inventory } from "@/features/inventory/types";
import { CarIcon, CheckCircle, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Helper functions for localStorage management
const getStoredBookings = (): Map<string, string> => {
  const stored = localStorage.getItem("test_drive_bookings");
  if (!stored) return new Map();
  return new Map(JSON.parse(stored));
};

const saveBooking = (inventoryId: number, bookingDate: string) => {
  const bookings = getStoredBookings();
  bookings.set(inventoryId.toString(), bookingDate); // Convert to string
  localStorage.setItem(
    "test_drive_bookings",
    JSON.stringify(Array.from(bookings.entries())),
  );
};

const isUnitBooked = (inventoryId: number): boolean => {
  const bookings = getStoredBookings();
  const bookingDate = bookings.get(inventoryId.toString()); // Convert to string
  if (!bookingDate) return false;

  // Check if booking date has passed
  const today = new Date().toISOString().split("T")[0];
  return bookingDate >= today; // Still booked if future or today
};

// Usage Example Component
const TestDriveManager: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Inventory | null>(null);
  const [bookedUnitIds, setBookedUnitIds] = useState<Set<number>>(new Set());
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
    visible: boolean;
  }>({ type: "success", message: "", visible: false });
  const {
    data: units,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["inventories"],
    queryFn: GetInventories,
  });

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message, visible: true });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }));
    }, 5000);
  };

  const handleBookTestDrive = async (data: TestDrive) => {
    setIsSubmitting(true);

    try {
      await CreateTestDrive(data);

      const bookingDate =
        data.scheduled_at || new Date().toISOString().split("T")[0];
      saveBooking(data.inventory_id, bookingDate);

      setBookedUnitIds((prev) => new Set(prev).add(data.inventory_id)); // Now works with number
      showNotification("success", "Test drive booked successfully!");
      setIsModalOpen(false);
      setSelectedUnit(null);
    } catch (error: any) {
      console.error("Error booking test drive:", error);
      showNotification("error", "Failed to book test drive. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnitSelect = (unit: Inventory) => {
    if (isUnitBooked(unit.id)) {
      showNotification(
        "error",
        "You have already booked a test drive for this vehicle!",
      );
      return;
    }
    setSelectedUnit(unit);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isError) {
      showNotification("error", "Failed to load units");
    }
    // Load bookings from localStorage on mount
    const bookings = getStoredBookings();
    const activeBookings = new Set<number>();
    const today = new Date().toISOString().split("T")[0];

    for (const [id, date] of bookings.entries()) {
      if (date >= today) {
        activeBookings.add(parseInt(id));
      } else {
        // Clean up expired bookings
        bookings.delete(id);
      }
    }

    localStorage.setItem(
      "test_drive_bookings",
      JSON.stringify(Array.from(bookings.entries())),
    );
    setBookedUnitIds(activeBookings);
  }, []);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 w-64 mb-2" />
            <div className="h-4 bg-gray-200 w-96" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 animate-pulse"
              >
                <div className="aspect-square bg-gray-100" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-100 w-3/4" />
                  <div className="h-5 bg-gray-100 w-1/2" />
                  <div className="h-8 bg-gray-100 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Toast */}
      {notification.visible && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div
            className={`rounded-lg shadow-lg p-4 flex items-center gap-3 ${
              notification.type === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <p
              className={`text-sm ${
                notification.type === "success"
                  ? "text-green-800"
                  : "text-red-800"
              }`}
            >
              {notification.message}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Book a Test Drive
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Choose a vehicle to schedule your test drive experience
          </p>
        </div>

        {/* Unit Selection Grid */}
        {units.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No vehicles available for test drive at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {units.map((unit: Inventory) => {
              const primaryImage =
                unit?.media?.find((m) => m.is_primary) ?? unit?.media?.[0];
              const isBooked = bookedUnitIds.has(unit.id);

              return (
                <div
                  key={unit.id}
                  className={`bg-white border ${
                    isBooked
                      ? "border-green-200 bg-green-50/30"
                      : "border-gray-200"
                  } flex flex-col relative`}
                >
                  {/* Booked Badge */}
                  {isBooked && (
                    <div className="absolute top-2 right-2 z-10">
                      <div className="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Booked
                      </div>
                    </div>
                  )}

                  {/* Image */}
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

                  {/* Content */}
                  <div className="p-4 flex flex-col gap-2">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                      {unit.car?.year} {unit.car?.make} {unit.car?.model}
                    </h3>

                    {unit.car?.segment && (
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        {unit.car.segment}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <span className="text-base font-semibold text-gray-900">
                        ${unit.selling_price?.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {unit.mileage_km?.toLocaleString()} km
                      </span>
                    </div>

                    <button
                      className={`mt-2 w-full cursor-pointer py-1.5 text-xs font-medium transition-colors ${
                        isBooked
                          ? "text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed"
                          : "text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-900 hover:text-white hover:border-gray-900"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isBooked) {
                          handleUnitSelect(unit);
                        }
                      }}
                      disabled={isBooked}
                    >
                      {isBooked ? "Already Booked" : "Book Test Drive"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal for selected unit */}
      {isModalOpen && selectedUnit && (
        <BookTestDrive
          inventoryId={selectedUnit.id}
          inventoryName={`${selectedUnit.car?.year} ${selectedUnit.car?.make} ${selectedUnit.car?.model}`}
          onSubmit={handleBookTestDrive}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUnit(null);
          }}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};

export default TestDriveManager;
