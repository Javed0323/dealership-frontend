// shared/components/InquiryModal.tsx
import { useEffect, useRef, useState } from "react";
import { X, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import axios from "@/shared/api/axios";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // ← called after successful submission
  vehicle: {
    inventoryId: number;
    title: string;
    stockNumber?: string | null;
    price?: string | null;
  };
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

type SubmitState = "idle" | "submitting" | "success" | "error";

const EMPTY: FormData = { name: "", email: "", phone: "", message: "" };

const inputClass =
  "w-full px-3 py-2 text-sm border border-zinc-200 bg-white text-zinc-900 " +
  "placeholder-zinc-400 focus:outline-none focus:border-zinc-900 " +
  "focus:ring-1 focus:ring-zinc-900 transition-colors";

export function InquiryModal({
  isOpen,
  onClose,
  onSuccess,
  vehicle,
}: InquiryModalProps) {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    firstInputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY);
      setState("idle");
      setErrorMsg("");
    }
  }, [isOpen]);

  const handleClose = () => {
    if (state === "submitting") return;
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    const defaultMessage =
      `Hi, I'm interested in the ${vehicle.title}` +
      (vehicle.stockNumber ? ` (Stock #${vehicle.stockNumber})` : "") +
      `. Please get in touch with me.`;

    try {
      await axios.post("/contact/", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: "sales",
        message: form.message || defaultMessage,
        preferred_contact: "email",
        vehicle_title: vehicle.title,
        inventory_id: vehicle.inventoryId,
      });
      setState("success");
      onSuccess?.();
    } catch (err: any) {
      const detail =
        err?.response?.data?.detail ||
        "Something went wrong. Please try again or call us directly.";
      setErrorMsg(typeof detail === "string" ? detail : JSON.stringify(detail));
      setState("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-label="Inquire about this vehicle"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative bg-white w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-zinc-200 shrink-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
              Vehicle Inquiry
            </p>
            <h2 className="text-base font-bold text-zinc-900 leading-tight">
              {vehicle.title}
            </h2>
            <div className="flex items-center gap-3 mt-1">
              {vehicle.stockNumber && (
                <span className="text-xs text-zinc-400">
                  Stock #{vehicle.stockNumber}
                </span>
              )}
              {vehicle.price && (
                <span className="text-xs font-semibold text-zinc-700">
                  {vehicle.price}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={state === "submitting"}
            className="ml-4 shrink-0 text-zinc-400 hover:text-zinc-900 transition-colors disabled:opacity-40"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 flex-1">
          {state === "success" && (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="w-12 h-12 bg-zinc-900 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 mb-2">
                Inquiry Sent
              </h3>
              <p className="text-sm text-zinc-500 max-w-xs">
                We've received your message about the {vehicle.title}. A member
                of our team will reach out shortly.
              </p>
              <button
                onClick={handleClose}
                className="mt-6 text-xs font-medium uppercase tracking-widest text-zinc-900 underline underline-offset-4 hover:text-zinc-500 transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {state === "error" && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 p-4 mb-5">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-700">
                  Failed to send
                </p>
                <p className="text-sm text-red-600 mt-0.5">{errorMsg}</p>
                <button
                  onClick={() => {
                    setState("idle");
                    setErrorMsg("");
                  }}
                  className="text-xs font-medium text-red-700 underline underline-offset-2 mt-2 hover:text-red-500"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {state !== "success" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                    Full Name <span className="text-zinc-300">*</span>
                  </label>
                  <input
                    ref={firstInputRef}
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                    Email <span className="text-zinc-300">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                    className={inputClass}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder={`I'm interested in the ${vehicle.title}. Please get in touch with me.`}
                    className={`${inputClass} resize-none`}
                  />
                  <p className="text-[10px] text-zinc-400 mt-1">
                    Leave blank to send a default inquiry message.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={state === "submitting"}
                className="w-full py-3 bg-zinc-900 text-white text-xs font-bold uppercase
                           tracking-widest hover:bg-zinc-700 transition-colors
                           disabled:opacity-60 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
              >
                {state === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Inquiry
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
