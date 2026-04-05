import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { User, Car, Phone, Mail, CheckCircle, X } from "lucide-react";
import type { TestDrive } from "@/features/test_drives/types";

interface TestDriveFormData {
  full_name: string;
  email: string;
  phone: string;
  inventory_id: number;
  scheduled_at: string;
  notes?: string;
  preferred_contact?: "email" | "sms" | "phone";
  receive_updates?: boolean;
}

interface BookTestDriveProps {
  inventoryId: number;
  inventoryName: string;
  inventoryImage?: string;
  onSubmit: (data: TestDrive) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

const BookTestDrive: React.FC<BookTestDriveProps> = ({
  inventoryId,
  inventoryName,
  onSubmit,
  onClose,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<TestDrive>({
    full_name: "",
    email: "",
    phone: "",
    inventory_id: inventoryId,
    scheduled_at: "",
    notes: "",
    status: "pending",
  });

  const [errors, setErrors] = useState<Partial<TestDriveFormData>>({});
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    // Handle escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (!submitted) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
      // Add padding to prevent layout shift
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [onClose, submitted]);

  const validateForm = (): boolean => {
    const newErrors: Partial<TestDriveFormData> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Please enter your full name";
    } else if (formData.full_name.length < 2) {
      newErrors.full_name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\-+()]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.scheduled_at) {
      newErrors.scheduled_at = "Please select a date and time";
    } else {
      const selectedDate = new Date(formData.scheduled_at);
      const now = new Date();
      const minDate = new Date();
      minDate.setHours(0, 0, 0, 0);

      if (selectedDate < now) {
        newErrors.scheduled_at = "Please select a future date and time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to book test drive:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof TestDriveFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const minDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 2); // Minimum 2 hours notice
    return now.toISOString().slice(0, 16);
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4"
      style={{
        isolation: "isolate",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Modal Container */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-md shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ position: "relative", zIndex: 10000 }}
      >
        {/* Success Screen */}
        {submitted ? (
          <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Booking Confirmed!
            </h3>
            <p className="text-gray-600 mb-4">
              Thank you, {formData.full_name.split(" ")[0]}! We've sent a
              confirmation to {formData.email}
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm font-medium text-gray-700">
                Test Drive Details:
              </p>
              <p className="text-sm text-gray-600 mt-1">🚗 {inventoryName}</p>
              <p className="text-sm text-gray-600">
                📅 {new Date(formData.scheduled_at).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                We'll send a reminder 24 hours before your appointment.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Book a Test Drive
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Experience the drive, no account needed
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Vehicle Display */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Car className="w-5 h-5 text-gray-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    {inventoryName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Select your preferred time below
                  </p>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  Your Information
                </h3>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className={`w-full pl-9 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.full_name
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200"
                      }`}
                    />
                  </div>
                  {errors.full_name && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.full_name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className={`w-full pl-9 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    We'll send confirmation and reminders here
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                      className={`w-full pl-9 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.phone
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200"
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Date & Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="scheduled_at"
                  value={formData.scheduled_at}
                  onChange={handleInputChange}
                  min={minDateTime()}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.scheduled_at
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
                {errors.scheduled_at && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.scheduled_at}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Available Monday-Saturday, 9:00 AM - 6:00 PM
                </p>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  maxLength={255}
                  placeholder="Any specific questions or requirements..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <div className="text-right text-xs text-gray-400 mt-1">
                  {formData.notes?.length || 0}/255
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Booking..." : "Confirm Booking"}
                </button>
              </div>

              <p className="text-xs text-center text-gray-400 pt-2">
                By confirming, you agree to our test drive terms and conditions
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );

  // Use portal to render at body level
  if (!mounted) return null;
  return createPortal(modalContent, document.body);
};

export default BookTestDrive;
