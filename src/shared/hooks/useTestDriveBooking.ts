// hooks/useTestDriveBooking.ts
import { useState, useEffect } from "react";
import { CreateTestDrive } from "@/features/test_drives/api";
import type { TestDrive } from "@/features/test_drives/types";

// Helper functions for localStorage management
const getStoredBookings = (): Map<string, string> => {
  const stored = localStorage.getItem("test_drive_bookings");
  if (!stored) return new Map();
  return new Map(JSON.parse(stored));
};

const saveBooking = (inventoryId: number, bookingDate: string) => {
  const bookings = getStoredBookings();
  bookings.set(inventoryId.toString(), bookingDate);
  localStorage.setItem(
    "test_drive_bookings",
    JSON.stringify(Array.from(bookings.entries())),
  );
};

export const isUnitBooked = (inventoryId: number): boolean => {
  const bookings = getStoredBookings();
  const bookingDate = bookings.get(inventoryId.toString());
  if (!bookingDate) return false;

  const today = new Date().toISOString().split("T")[0];
  return bookingDate >= today;
};

export const useTestDriveBooking = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedUnitIds, setBookedUnitIds] = useState<Set<number>>(new Set());
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
    visible: boolean;
  }>({ type: "success", message: "", visible: false });

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message, visible: true });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }));
    }, 5000);
  };

  const bookTestDrive = async (data: TestDrive) => {
    setIsSubmitting(true);

    try {
      await CreateTestDrive(data);

      const bookingDate =
        data.scheduled_at || new Date().toISOString().split("T")[0];
      saveBooking(data.inventory_id, bookingDate);

      setBookedUnitIds((prev) => new Set(prev).add(data.inventory_id));
      showNotification("success", "Test drive booked successfully!");

      return { success: true };
    } catch (error: any) {
      console.error("Error booking test drive:", error);
      showNotification(
        "error",
        error.message || "Failed to book test drive. Please try again.",
      );
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load bookings from localStorage on mount
  useEffect(() => {
    const bookings = getStoredBookings();
    const activeBookings = new Set<number>();
    const today = new Date().toISOString().split("T")[0];

    for (const [id, date] of bookings.entries()) {
      if (date >= today) {
        activeBookings.add(parseInt(id));
      } else {
        bookings.delete(id);
      }
    }

    localStorage.setItem(
      "test_drive_bookings",
      JSON.stringify(Array.from(bookings.entries())),
    );
    setBookedUnitIds(activeBookings);
  }, []);

  return {
    bookTestDrive,
    isSubmitting,
    bookedUnitIds,
    notification,
    showNotification, // Export for manual notifications
  };
};
