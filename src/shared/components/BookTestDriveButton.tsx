// components/BookTestDriveButton.tsx
import { useState } from "react";
import BookTestDrive from "@/features/frontend/pages/BookTestDrive";
import {
  useTestDriveBooking,
  isUnitBooked,
} from "../hooks/useTestDriveBooking";
import { NotificationToast } from "./NotificationToast";

interface BookTestDriveButtonProps {
  inventoryId: string;
  inventoryName: string;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  onBookingSuccess?: () => void;
  onBookingError?: (error: any) => void;
}

export const BookTestDriveButton: React.FC<BookTestDriveButtonProps> = ({
  inventoryId,
  inventoryName,
  className = "",
  onBookingSuccess,
  onBookingError,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { bookTestDrive, isSubmitting, notification, bookedUnitIds } =
    useTestDriveBooking();

  const isBooked =
    bookedUnitIds.has(Number(inventoryId)) || isUnitBooked(Number(inventoryId));

  const handleBookTestDrive = async (data: any) => {
    const result = await bookTestDrive(data);

    if (result.success) {
      setIsModalOpen(false);
      onBookingSuccess?.();
    } else {
      onBookingError?.(result.error);
    }
  };

  return (
    <>
      <button
        onClick={() => !isBooked && setIsModalOpen(true)}
        disabled={isBooked}
        className={`mt-2 w-full py-2 text-xs font-medium transition-colors ${
          isBooked
            ? "text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed"
            : "text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-900 hover:text-white hover:border-gray-900"
        } ${className}`}
      >
        {isBooked ? "Already Booked" : "Book Test Drive"}
      </button>

      {isModalOpen && (
        <BookTestDrive
          inventoryId={Number(inventoryId)}
          inventoryName={inventoryName}
          onSubmit={handleBookTestDrive}
          onClose={() => setIsModalOpen(false)}
          isLoading={isSubmitting}
        />
      )}

      <NotificationToast {...notification} />
    </>
  );
};
