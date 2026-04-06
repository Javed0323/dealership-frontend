// pages/ContactPage.tsx
import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MessageCircle,
  Calendar,
  Navigation,
  Loader2,
} from "lucide-react";
import axios from "@/shared/api/axios";
import { useNavigate } from "react-router-dom";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  preferred_contact: "email" | "phone";
}

type SubmitState = "idle" | "submitting" | "success" | "error";

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    details: [
      "Sales: (555) 123-4567",
      "Service: (555) 123-4568",
      "Parts: (555) 123-4569",
    ],
    action: "Call Sales",
    href: "tel:+5551234567",
  },
  {
    icon: Mail,
    title: "Email",
    details: [
      "Sales: sales@autoelite.com",
      "Service: service@autoelite.com",
      "Support: support@autoelite.com",
    ],
    action: "Send Email",
    href: "mailto:sales@autoelite.com",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["123 Auto Avenue", "Los Angeles, CA 90001", "United States"],
    action: "Get Directions",
    href: "https://maps.google.com/?q=123+Auto+Avenue+Los+Angeles+CA",
  },
  {
    icon: Clock,
    title: "Hours",
    details: [
      "Mon – Fri: 9:00 AM – 8:00 PM",
      "Saturday: 10:00 AM – 6:00 PM",
      "Sunday: 11:00 AM – 5:00 PM",
    ],
    action: null,
    href: undefined,
  },
];

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter/X" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  { icon: MessageCircle, href: "https://wa.me/15551234567", label: "WhatsApp" },
];

const EMPTY_FORM: FormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  preferred_contact: "email",
};

// ---------------------------------------------------------------------------
// Small reusable field components
// ---------------------------------------------------------------------------

const inputClass =
  "w-full px-3 py-2 text-sm border border-gray-200 bg-white text-gray-900 placeholder-gray-400 " +
  "focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors";

const Label: React.FC<{
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ htmlFor, required, children }) => (
  <label
    htmlFor={htmlFor}
    className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5"
  >
    {children}
    {required && <span className="text-gray-400 ml-0.5">*</span>}
  </label>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState("submitting");
    setErrorMessage("");

    try {
      await axios.post("/contact/", formData);
      setSubmitState("success");
      setFormData(EMPTY_FORM);
    } catch (err: any) {
      const detail =
        err?.response?.data?.detail ||
        "Something went wrong. Please try again or contact us directly.";
      setErrorMessage(
        typeof detail === "string" ? detail : JSON.stringify(detail),
      );
      setSubmitState("error");
    }
  };

  const resetForm = () => {
    setSubmitState("idle");
    setErrorMessage("");
  };

  return (
    <div className="bg-white min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">
            AutoElite
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Get in Touch
          </h1>
          <p className="text-gray-400 max-w-lg leading-relaxed">
            Questions about inventory, financing, or services? Our team is ready
            to help.
          </p>
        </div>
      </section>

      {/* ── Contact Info Cards ────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="py-8 px-6 lg:px-8">
                  <div className="flex items-center gap-2.5 mb-4">
                    <Icon className="h-4 w-4 text-gray-400" />
                    <span className="text-xs font-medium tracking-widest text-gray-400 uppercase">
                      {item.title}
                    </span>
                  </div>
                  <div className="space-y-1 mb-4">
                    {item.details.map((detail, idx) => (
                      <p key={idx} className="text-sm text-gray-700">
                        {detail}
                      </p>
                    ))}
                  </div>
                  {item.action && item.href && (
                    <a
                      href={item.href}
                      className="text-xs font-medium text-gray-900 underline underline-offset-4 hover:text-gray-500 transition-colors"
                    >
                      {item.action} →
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Form + Sidebar ────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Form – takes 3 cols */}
            <div className="lg:col-span-3 bg-white border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Send a Message
              </h2>
              <p className="text-sm text-gray-500 mb-8">
                We'll respond within one business day.
              </p>

              {/* ── Success state ── */}
              {submitState === "success" && (
                <div className="flex flex-col items-center py-16 text-center">
                  <div className="w-14 h-14 bg-gray-900 flex items-center justify-center mb-5">
                    <CheckCircle className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Message Received
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 max-w-xs">
                    Thank you for reaching out. A member of our team will be in
                    touch shortly.
                  </p>
                  <button
                    onClick={resetForm}
                    className="text-xs font-medium text-gray-900 underline underline-offset-4 hover:text-gray-500 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              )}

              {/* ── Error banner ── */}
              {submitState === "error" && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 p-4 mb-6">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-700">
                      Failed to send
                    </p>
                    <p className="text-sm text-red-600 mt-0.5">
                      {errorMessage}
                    </p>
                    <button
                      onClick={resetForm}
                      className="text-xs font-medium text-red-700 underline underline-offset-2 mt-2 hover:text-red-500"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              )}

              {/* ── Form ── */}
              {submitState !== "success" && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="name" required>
                        Full Name
                      </Label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" required>
                        Email
                      </Label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(555) 123-4567"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject" required>
                        Subject
                      </Label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      >
                        <option value="">Select a subject</option>
                        <option value="sales">Sales Inquiry</option>
                        <option value="service">Service Appointment</option>
                        <option value="financing">Financing Options</option>
                        <option value="test-drive">Schedule Test Drive</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="preferred_contact">
                      Preferred Contact Method
                    </Label>
                    <div className="flex gap-6">
                      {(["email", "phone"] as const).map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="preferred_contact"
                            value={opt}
                            checked={formData.preferred_contact === opt}
                            onChange={handleChange}
                            className="accent-gray-900"
                          />
                          <span className="text-sm text-gray-700 capitalize">
                            {opt}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" required>
                      Message
                    </Label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us how we can help you..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitState === "submitting"}
                    className="w-full py-3 bg-gray-900 text-white text-sm font-medium
                               hover:bg-gray-700 transition-colors disabled:opacity-60
                               disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitState === "submitting" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar – takes 2 cols */}
            <div className="lg:col-span-2 space-y-6">
              {/* Map */}
              <div className="bg-white border border-gray-200 overflow-hidden">
                <div className="h-56 bg-gray-100">
                  <iframe
                    title="Dealership Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1x3305.594563568457!2d-118.24674278478624!3d34.05410568060417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fdf6f254608f4!2sLos%20Angeles%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    className="grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="px-5 py-4 border-t border-gray-100">
                  <a
                    href="https://maps.google.com/?q=123+Auto+Avenue+Los+Angeles+CA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-500 transition-colors"
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    Get Directions
                  </a>
                </div>
              </div>

              {/* Test Drive CTA */}
              <div className="bg-gray-900 p-6 text-white">
                <div className="flex items-start gap-4">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">
                      Schedule a Test Drive
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                      Experience your next car before committing. Slots
                      available 7 days a week.
                    </p>
                    <button
                      onClick={() => navigate("/schedule-test-drive")}
                      className="text-sm font-medium border border-white/30 px-4 py-2
                       hover:bg-white hover:text-gray-900 transition-all"
                    >
                      Book Now →
                    </button>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="bg-white border border-gray-200 p-6">
                <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">
                  Follow Us
                </p>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-xs
                                   font-medium text-gray-600 hover:border-gray-900 hover:text-gray-900
                                   transition-colors"
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {social.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-2">
              FAQ
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mb-10">
              Common Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {[
                {
                  q: "Do I need an appointment for a test drive?",
                  a: "Walk-ins are welcome, but booking ahead ensures your preferred vehicle is available and ready.",
                },
                {
                  q: "What financing options are available?",
                  a: "We work with multiple lenders to offer competitive rates. Our finance team can walk you through all options.",
                },
                {
                  q: "Do you offer trade-in evaluations?",
                  a: "Yes — free trade-in appraisals are available online or in person. Most take under 30 minutes.",
                },
                {
                  q: "What are the service department hours?",
                  a: "Mon–Fri 8 AM–6 PM and Saturday 9 AM–4 PM. We're closed Sundays.",
                },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
                    {q}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
