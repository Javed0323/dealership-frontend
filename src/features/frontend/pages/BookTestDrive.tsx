import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { User, Phone, Mail, CheckCircle, X } from "lucide-react";
import type { TestDrive } from "@/features/test_drives/types";

interface TestDriveFormData {
  full_name: string;
  email: string;
  phone: string;
  inventory_id: number;
  scheduled_at: string;
  notes?: string;
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (!submitted) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
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

    if (!formData.full_name.trim())
      newErrors.full_name = "Full name is required";
    else if (formData.full_name.length < 2)
      newErrors.full_name = "Name must be at least 2 characters";

    if (!formData.email) newErrors.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email address";

    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^[\d\s\-+()]{10,15}$/.test(formData.phone))
      newErrors.phone = "Enter a valid phone number";

    if (!formData.scheduled_at) {
      newErrors.scheduled_at = "Please select a date and time";
    } else if (new Date(formData.scheduled_at) < new Date()) {
      newErrors.scheduled_at = "Please select a future date and time";
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
    if (errors[name as keyof TestDriveFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const minDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 2);
    return now.toISOString().slice(0, 16);
  };

  // Shared input class helpers
  const inputBase =
    "w-full border bg-white text-sm text-gray-900 py-2.5 outline-none transition-colors focus:border-gray-900 placeholder:text-gray-400";
  const inputError = "border-red-400 bg-red-50";
  const inputNormal = "border-gray-200";

  const modalContent = (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        ref={modalRef}
        className="relative bg-white w-full max-w-xl max-h-[92vh] overflow-y-auto flex flex-col"
        style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.25)" }}
      >
        {submitted ? (
          /* ── Success Screen ───────────────────────────────── */
          <div className="flex flex-col items-center justify-center p-10 text-center gap-4">
            <div className="w-14 h-14 bg-gray-900 flex items-center justify-center mb-2">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
                Booking Confirmed
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                We'll send a confirmation to{" "}
                <span className="text-gray-700 font-medium">
                  {formData.email}
                </span>
              </p>
            </div>

            <div className="w-full border border-gray-100 p-4 text-left space-y-1.5 mt-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                Booking Details
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Vehicle</span>
                <span className="text-gray-900 font-medium">
                  {inventoryName}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date & Time</span>
                <span className="text-gray-900 font-medium">
                  {new Date(formData.scheduled_at).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Name</span>
                <span className="text-gray-900 font-medium">
                  {formData.full_name}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              A reminder will be sent 24 hours before your appointment.
            </p>

            <button
              onClick={onClose}
              className="w-full bg-gray-900 text-white text-sm font-medium py-3 hover:bg-gray-800 transition-colors mt-2"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* ── Header ────────────────────────────────────── */}
            <div className="sticky top-0 bg-white z-10 border-b border-gray-100">
              {/* Black accent bar */}
              <div className="h-1 w-full bg-gray-900" />
              <div className="flex items-start justify-between px-6 py-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                    Book a Test Drive
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    No account needed — takes under a minute
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-gray-100 transition-colors mt-0.5"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* ── Form ──────────────────────────────────────── */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
              {/* Vehicle tag */}
              <div className="flex items-center gap-3 border border-gray-100 bg-gray-50 px-4 py-3">
                <div className="w-1 h-8 bg-gray-900 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Vehicle
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {inventoryName}
                  </p>
                </div>
              </div>

              {/* ── Section: Your Information ── */}
              <div className="space-y-4">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Your Information
                </p>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">
                    Full Name <span className="text-gray-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className={`${inputBase} pl-9 pr-3 ${errors.full_name ? inputError : inputNormal}`}
                    />
                  </div>
                  {errors.full_name && (
                    <p className="text-xs text-red-500">{errors.full_name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">
                    Email Address <span className="text-gray-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className={`${inputBase} pl-9 pr-3 ${errors.email ? inputError : inputNormal}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">
                    Phone Number <span className="text-gray-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                      className={`${inputBase} pl-9 pr-3 ${errors.phone ? inputError : inputNormal}`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-500">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* ── Section: Scheduling ── */}
              <div className="space-y-4">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Scheduling
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">
                    Preferred Date & Time{" "}
                    <span className="text-gray-400">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduled_at"
                    value={formData.scheduled_at}
                    onChange={handleInputChange}
                    min={minDateTime()}
                    className={`${inputBase} px-3 ${errors.scheduled_at ? inputError : inputNormal}`}
                  />
                  {errors.scheduled_at ? (
                    <p className="text-xs text-red-500">
                      {errors.scheduled_at}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">
                      Mon – Sat, 9:00 AM – 6:00 PM · Minimum 2 hours notice
                    </p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">
                  Special Requests{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  maxLength={255}
                  placeholder="Any specific questions or requirements..."
                  className={`${inputBase} px-3 resize-none`}
                  style={{ borderColor: "#e5e7eb" }}
                />
                <p className="text-right text-xs text-gray-300">
                  {formData.notes?.length ?? 0}/255
                </p>
              </div>

              {/* ── Actions ── */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border border-gray-200 text-sm font-medium text-gray-600 py-2.5 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-2 px-6 bg-gray-900 text-white text-sm font-medium py-2.5 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Booking…" : "Confirm Booking"}
                </button>
              </div>

              <p className="text-xs text-center text-gray-300 pb-1">
                By confirming you agree to our test drive terms & conditions
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
};

export default BookTestDrive;
