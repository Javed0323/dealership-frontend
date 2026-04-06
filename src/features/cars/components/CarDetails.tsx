import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GetCar } from "../api";
import { GetInventory } from "@/features/frontend/api";
import type { CarRead } from "../types";
import type { Inventory } from "@/features/inventory/types";
import { GetOffers } from "@/features/offers/api";
import type { Offer } from "@/features/offers/types";
import { BookTestDriveButton } from "@/shared/components/BookTestDriveButton";
import { InquiryModal } from "@/shared/components/InquiryModal";
import { useInquired } from "@/shared/hooks/UseInquired";
import { CheckCircle } from "lucide-react"; // if not already imported

// ─── Scroll spy sections ──────────────────────────────────────────────────────
const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "engine", label: "Engine" },
  { id: "dimensions", label: "Dimensions" },
  { id: "features", label: "Features" },
  { id: "safety", label: "Safety" },
  { id: "media", label: "Gallery" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatPrice(value?: number | null) {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNum(value?: number | null, unit = "") {
  if (value == null) return "—";
  return `${value.toLocaleString()}${unit ? " " + unit : ""}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-zinc-100 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
        {label}
      </span>
      <span className="text-sm font-medium text-zinc-900 text-right max-w-[60%] uppercase">
        {value}
      </span>
    </div>
  );
}

function SectionCard({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 whitespace-nowrap">
          {title}
        </h2>
        <div className="flex-1 h-px bg-zinc-200" />
      </div>
      {children}
    </section>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({
  images,
  index,
  onClose,
  onNav,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onNav: (i: number) => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav((index + 1) % images.length);
      if (e.key === "ArrowLeft")
        onNav((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, images.length, onClose, onNav]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        className="absolute top-5 right-6 text-white text-2xl font-light opacity-60 hover:opacity-100 transition-opacity"
        onClick={onClose}
      >
        ✕
      </button>
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl opacity-40 hover:opacity-100 px-4 py-2 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onNav((index - 1 + images.length) % images.length);
        }}
      >
        ‹
      </button>
      <img
        src={images[index]}
        alt=""
        className="max-h-[85vh] max-w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl opacity-40 hover:opacity-100 px-4 py-2 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onNav((index + 1) % images.length);
        }}
      >
        ›
      </button>
      <div className="absolute bottom-5 text-white/40 text-xs tracking-widest">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status?: string }) {
  const map: Record<string, string> = {
    available: "bg-emerald-50 text-emerald-700 border-emerald-200",
    sold: "bg-red-50 text-red-600 border-red-200",
    reserved: "bg-amber-50 text-amber-700 border-amber-200",
    pending: "bg-blue-50 text-blue-700 border-blue-200",
  };
  const key = status?.toLowerCase() ?? "available";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest border ${map[key] ?? map["available"]}`}
    >
      {status ?? "Available"}
    </span>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-zinc-100 animate-pulse ${className}`} />;
}

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-14 border-b border-zinc-200" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-16">
          <div className="space-y-4">
            <Skeleton className="w-full aspect-video" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-16 h-12" />
              ))}
            </div>
            <Skeleton className="w-48 h-4 mt-6" />
            <Skeleton className="w-72 h-8" />
            <Skeleton className="w-full h-16 mt-4" />
          </div>
          <div className="space-y-4">
            <Skeleton className="w-full h-52" />
            <Skeleton className="w-full h-64" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CarDetails() {
  const { inventoryId } = useParams<{ inventoryId: string }>();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [heroIndex, setHeroIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  // Step 1 — fetch the specific inventory unit
  const {
    data: inventory,
    isLoading: inventoryLoading,
    isError: inventoryError,
  } = useQuery<Inventory>({
    queryKey: ["inventory", inventoryId],
    queryFn: () => GetInventory(Number(inventoryId)),
    enabled: !!inventoryId,
  });
  const { inquired, markAsInquired } = useInquired(inventory?.id || 0);

  // Step 2 — fetch the parent car once we have car_id
  const {
    data: car,
    isLoading: carLoading,
    isError: carError,
  } = useQuery<CarRead>({
    queryKey: ["car", inventory?.car_id],
    queryFn: () => GetCar(inventory!.car_id),
    enabled: !!inventory?.car_id,
  });

  const { data: offers } = useQuery({
    queryKey: ["offers"],
    queryFn: GetOffers,
  });

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [car]);

  // ── Derived data ─────────────────────────────────────────────────────────
  const mediaUrls: string[] =
    inventory?.media?.map((m) => m.url).filter((url): url is string => !!url) ??
    [];
  const engine = car?.engine;
  const dims = car?.dimensions;
  const safety = car?.safety;
  const features = car?.features;

  // Pricing — show discounted if set, else selling_price; strike through original
  const offer =
    offers?.find(
      (o: Offer) => o.inventory_id === inventory?.id && o.is_active,
    ) ?? null;

  const sellingPrice = inventory?.selling_price ?? 0;

  const discountedPrice = offer
    ? sellingPrice - (sellingPrice * Number(offer.discount_percentage)) / 100
    : null;

  const displayPrice = discountedPrice ?? sellingPrice;

  // ── Loading / error states ────────────────────────────────────────────────
  if (inventoryLoading || carLoading) return <PageSkeleton />;

  if (inventoryError || carError || !inventory || !car) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-zinc-500">Vehicle not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-xs uppercase tracking-widest underline text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const title = [car.year, car.make, car.model, car.segment]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* ── Top Nav Bar ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-30 bg-white border-b border-zinc-200 mt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 12L6 8l4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
            Inventory
          </button>

          {/* Section tabs */}
          <div className="hidden md:flex items-center gap-1">
            {SECTIONS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(id)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`px-3 py-1 text-[11px] font-semibold uppercase tracking-widest transition-colors ${
                  activeSection === id
                    ? "text-zinc-900 border-b-2 border-zinc-900"
                    : "text-zinc-400 hover:text-zinc-700"
                }`}
              >
                {label}
              </a>
            ))}
          </div>

          <StatusBadge status={inventory.status} />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-16">
          {/* ── LEFT COLUMN ──────────────────────────────────────── */}
          <div className="space-y-16">
            {/* Overview */}
            <section id="overview" className="scroll-mt-28">
              {/* Hero image */}
              <div
                className="w-full aspect-video bg-zinc-100 overflow-hidden border border-zinc-200 cursor-zoom-in"
                onClick={() => mediaUrls.length && setLightbox(heroIndex)}
              >
                {mediaUrls.length > 0 ? (
                  <img
                    src={mediaUrls[heroIndex]}
                    alt={title}
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs uppercase tracking-widest text-zinc-300">
                      No Image
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {mediaUrls.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {mediaUrls.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setHeroIndex(i)}
                      className={`shrink-0 w-16 h-12 overflow-hidden border-2 transition-all ${
                        i === heroIndex
                          ? "border-zinc-900"
                          : "border-transparent opacity-50 hover:opacity-80"
                      }`}
                    >
                      <img
                        src={url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Vehicle identity */}
              <div className="mt-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">
                  {car.year} · {car.category ?? car.category ?? "Vehicle"}
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-none">
                  {car.make} {car.model}
                  {car.segment && (
                    <span className="text-zinc-400 font-light ml-2">
                      {car.segment}
                    </span>
                  )}
                </h1>
                {(inventory.exterior_color || inventory.interior_color) && (
                  <p className="mt-2 text-sm text-zinc-500">
                    {inventory.exterior_color}
                    {inventory.interior_color &&
                      ` · ${inventory.interior_color} Interior`}
                  </p>
                )}
              </div>

              {/* Quick stats strip */}
              <div className="mt-6 grid grid-cols-3 border border-zinc-200 divide-x divide-zinc-200">
                {[
                  {
                    label: "Mileage",
                    value: formatNum(inventory.mileage_km, "km"),
                  },
                  {
                    label: "Transmission",
                    value: engine?.transmission ?? "—",
                  },
                  { label: "Drivetrain", value: engine?.drivetrain ?? "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="py-4 px-4 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">
                      {label}
                    </p>
                    <p className="text-sm font-semibold text-zinc-900 uppercase">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Engine */}
            {engine && (
              <SectionCard id="engine" title="Engine & Performance">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-zinc-200 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
                      Powertrain
                    </p>
                    <SpecRow label="Engine" value={engine.fuel_type ?? "—"} />
                    <SpecRow
                      label="Displacement"
                      value={
                        engine.displacement_cc
                          ? `${engine.displacement_cc}L`
                          : "—"
                      }
                    />
                    <SpecRow
                      label="Cylinders"
                      value={engine.transmission_gears?.toString() ?? "—"}
                    />
                    <SpecRow
                      label="Horsepower"
                      value={
                        engine.horsepower ? `${engine.horsepower} hp` : "—"
                      }
                    />
                    <SpecRow
                      label="Torque"
                      value={
                        engine.torque_nm ? `${engine.torque_nm} lb-ft` : "—"
                      }
                    />
                  </div>
                  <div className="border border-zinc-200 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
                      Efficiency & Drive
                    </p>
                    <SpecRow
                      label="Drivetrain"
                      value={engine.drivetrain ?? "—"}
                    />
                    <SpecRow
                      label="Fuel Type"
                      value={engine.fuel_type ?? "—"}
                    />
                    <SpecRow
                      label="MPG City"
                      value={
                        engine.fuel_economy_l100
                          ? `${engine.fuel_economy_l100} mpg`
                          : "—"
                      }
                    />
                    <SpecRow
                      label="MPG Highway"
                      value={
                        engine.fuel_economy_l100
                          ? `${engine.fuel_economy_l100} mpg`
                          : "—"
                      }
                    />
                  </div>
                </div>
              </SectionCard>
            )}

            {/* Dimensions */}
            {dims && (
              <SectionCard id="dimensions" title="Dimensions & Capacity">
                <div className="border border-zinc-200 p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-10">
                  <div>
                    <SpecRow
                      label="Length"
                      value={dims.length_mm ? `${dims.length_mm} in` : "—"}
                    />
                    <SpecRow
                      label="Width"
                      value={dims.width_mm ? `${dims.width_mm} in` : "—"}
                    />
                    <SpecRow
                      label="Height"
                      value={dims.height_mm ? `${dims.height_mm} in` : "—"}
                    />
                    <SpecRow
                      label="Wheelbase"
                      value={
                        dims.wheelbase_mm ? `${dims.wheelbase_mm} in` : "—"
                      }
                    />
                  </div>
                  <div>
                    <SpecRow
                      label="Cargo Volume"
                      value={
                        dims.boot_space_l ? `${dims.boot_space_l} cu ft` : "—"
                      }
                    />
                    <SpecRow
                      label="Seating"
                      value={dims.seats?.toString() ?? "—"}
                    />
                    <SpecRow
                      label="Curb Weight"
                      value={
                        dims.curb_weight_kg ? `${dims.curb_weight_kg} lbs` : "—"
                      }
                    />
                    <SpecRow
                      label="Towing Capacity"
                      value={
                        dims.ground_clearance_mm
                          ? `${dims.ground_clearance_mm} lbs`
                          : "—"
                      }
                    />
                  </div>
                </div>
              </SectionCard>
            )}

            {/* Features */}
            {features && (
              <SectionCard id="features" title="Features">
                {(() => {
                  const groups: {
                    label: string;
                    items: { label: string; key: keyof typeof features }[];
                  }[] = [
                    {
                      label: "Comfort",
                      items: [
                        { label: "Sunroof", key: "sunroof" },
                        { label: "Panoramic Roof", key: "panoramic_roof" },
                        { label: "Heated Seats", key: "heated_seats" },
                        { label: "Ventilated Seats", key: "ventilated_seats" },
                        { label: "Leather Seats", key: "leather_seats" },
                        { label: "Memory Seats", key: "memory_seats" },
                        {
                          label: "Heated Steering Wheel",
                          key: "heated_steering_wheel",
                        },
                      ],
                    },
                    {
                      label: "Technology",
                      items: [
                        { label: "Apple CarPlay", key: "apple_carplay" },
                        { label: "Android Auto", key: "android_auto" },
                        {
                          label: "Wireless Charging",
                          key: "wireless_charging",
                        },
                        { label: "Keyless Entry", key: "keyless_entry" },
                        { label: "Push Start", key: "push_start" },
                        { label: "Remote Start", key: "remote_start" },
                        { label: "Heads-Up Display", key: "heads_up_display" },
                      ],
                    },
                    {
                      label: "Infotainment",
                      items: [{ label: "Premium Audio", key: "premium_audio" }],
                    },
                    {
                      label: "Lighting",
                      items: [
                        { label: "LED Headlights", key: "led_headlights" },
                        {
                          label: "Adaptive Headlights",
                          key: "adaptive_headlights",
                        },
                        { label: "Ambient Lighting", key: "ambient_lighting" },
                      ],
                    },
                    {
                      label: "Convenience",
                      items: [
                        { label: "Power Tailgate", key: "power_tailgate" },
                        { label: "Power Mirrors", key: "power_mirrors" },
                        {
                          label: "Auto-Dimming Mirror",
                          key: "auto_dimming_mirror",
                        },
                        { label: "Cruise Control", key: "cruise_control" },
                        {
                          label: "Adaptive Cruise",
                          key: "adaptive_cruise_control",
                        },
                      ],
                    },
                  ];

                  return (
                    <div className="space-y-6">
                      {/* Numeric specs */}
                      {(features.infotainment_screen_inch != null ||
                        features.speaker_count != null) && (
                        <div className="border border-zinc-200 p-5 grid grid-cols-2 gap-x-10">
                          {features.infotainment_screen_inch != null && (
                            <SpecRow
                              label="Screen Size"
                              value={`${features.infotainment_screen_inch}"`}
                            />
                          )}
                          {features.speaker_count != null && (
                            <SpecRow
                              label="Speakers"
                              value={`${features.speaker_count}`}
                            />
                          )}
                        </div>
                      )}

                      {/* Boolean feature groups */}
                      {groups.map((group) => {
                        const active = group.items.filter(
                          (item) => features[item.key] === true,
                        );
                        if (active.length === 0) return null;
                        return (
                          <div key={group.label}>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
                              {group.label}
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {active.map((item) => (
                                <div
                                  key={item.key}
                                  className="flex items-center gap-2 text-sm text-zinc-700"
                                >
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    className="shrink-0 text-zinc-900"
                                  >
                                    <path
                                      d="M2 6l3 3 5-5"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="square"
                                    />
                                  </svg>
                                  {item.label}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </SectionCard>
            )}

            {/* Safety */}
            {safety && (
              <SectionCard id="safety" title="Safety">
                <div className="space-y-6">
                  {/* NCAP + airbags */}
                  {(safety.ncap_rating != null ||
                    safety.airbag_count != null) && (
                    <div className="border border-zinc-200 p-5">
                      {safety.ncap_rating != null && (
                        <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-100">
                          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                            NCAP Rating
                          </span>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={`text-lg ${i < safety.ncap_rating! ? "text-zinc-900" : "text-zinc-200"}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {safety.airbag_count != null && (
                        <SpecRow
                          label="Airbags"
                          value={`${safety.airbag_count}`}
                        />
                      )}
                    </div>
                  )}

                  {/* Boolean safety features */}
                  {(() => {
                    const safetyItems: {
                      label: string;
                      key: keyof typeof safety;
                    }[] = [
                      { label: "ABS", key: "abs" },
                      { label: "ESP", key: "esp" },
                      { label: "Traction Control", key: "traction_control" },
                      { label: "Hill Start Assist", key: "hill_start_assist" },
                      {
                        label: "Hill Descent Control",
                        key: "hill_descent_control",
                      },
                      { label: "Lane Keep Assist", key: "lane_keep_assist" },
                      {
                        label: "Lane Departure Warning",
                        key: "lane_departure_warning",
                      },
                      {
                        label: "Blind Spot Monitor",
                        key: "blind_spot_monitor",
                      },
                      {
                        label: "Rear Cross Traffic Alert",
                        key: "rear_cross_traffic_alert",
                      },
                      {
                        label: "Forward Collision Warning",
                        key: "forward_collision_warning",
                      },
                      {
                        label: "Auto Emergency Braking",
                        key: "auto_emergency_braking",
                      },
                      {
                        label: "Traffic Sign Recognition",
                        key: "traffic_sign_recognition",
                      },
                      { label: "Rear Camera", key: "rear_camera" },
                      {
                        label: "Surround View Camera",
                        key: "surround_view_camera",
                      },
                      {
                        label: "Front Parking Sensors",
                        key: "parking_sensors_front",
                      },
                      {
                        label: "Rear Parking Sensors",
                        key: "parking_sensors_rear",
                      },
                      { label: "Self Parking", key: "self_parking" },
                    ];
                    const active = safetyItems.filter(
                      (item) => safety[item.key] === true,
                    );
                    if (active.length === 0) return null;
                    return (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {active.map((item) => (
                          <div
                            key={item.key}
                            className="flex items-center gap-2 text-sm text-zinc-700"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              className="shrink-0 text-zinc-900"
                            >
                              <path
                                d="M2 6l3 3 5-5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="square"
                              />
                            </svg>
                            {item.label}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </SectionCard>
            )}

            {/* Gallery */}
            {mediaUrls.length > 0 && (
              <SectionCard id="media" title="Gallery">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {mediaUrls.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setLightbox(i)}
                      className="aspect-4/3 overflow-hidden bg-zinc-100 block"
                    >
                      <img
                        src={url}
                        alt=""
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </button>
                  ))}
                </div>
              </SectionCard>
            )}
          </div>

          {/* ── RIGHT COLUMN — Sticky Sidebar ──────────────────────── */}
          <aside className="lg:self-start lg:sticky lg:top-20 space-y-4">
            {/* Price Card */}
            <div className="border border-zinc-200 p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                Selling Price
              </p>
              <p className="text-4xl font-bold tracking-tight text-zinc-900 leading-none">
                {formatPrice(displayPrice)}
              </p>
              {discountedPrice !== null && (
                <>
                  <p className="mt-1 text-sm text-zinc-400 line-through">
                    {formatPrice(sellingPrice)}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-600">
                    -{Number(offer?.discount_percentage)}% off
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-emerald-600">
                    You save {formatPrice(sellingPrice - discountedPrice)}
                  </p>
                </>
              )}
              <div className="mt-5 space-y-2">
                <button
                  onClick={() => !inquired && setInquiryOpen(true)}
                  disabled={inquired}
                  className={`w-full text-xs font-bold uppercase tracking-widest py-3.5 transition-colors flex items-center justify-center gap-2 ${
                    inquired
                      ? "bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200"
                      : "bg-zinc-900 text-white hover:bg-zinc-700"
                  }`}
                >
                  {inquired ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Inquiry Sent
                    </>
                  ) : (
                    "Inquire About This Vehicle"
                  )}
                </button>
                <BookTestDriveButton
                  inventoryId={inventory.id.toString()}
                  inventoryName={`${car?.year} ${car?.make} ${car?.model}`}
                  variant="primary"
                  onBookingSuccess={() => {
                    // Optional: Additional logic after successful booking
                    console.log(
                      "Booking successful, maybe redirect or show message",
                    );
                  }}
                  onBookingError={(error) => {
                    // Optional: Handle error differently
                    console.error("Booking failed:", error);
                  }}
                />
              </div>
            </div>

            {/* Vehicle Summary */}
            <div className="border border-zinc-200 p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
                Vehicle Summary
              </p>
              <SpecRow label="Stock #" value={inventory.stock_number ?? "—"} />
              <SpecRow label="VIN" value={inventory.vin ?? "—"} />
              <SpecRow
                label="Reg. No."
                value={inventory.registration_number ?? "—"}
              />
              <SpecRow label="Condition" value={inventory.condition} />
              <SpecRow label="Year" value={car.year?.toString() ?? "—"} />
              <SpecRow label="Make" value={car.make} />
              <SpecRow label="Model" value={car.model} />
              {car.segment && <SpecRow label="segment" value={car.segment} />}
              <SpecRow
                label="Ext. Color"
                value={inventory.exterior_color ?? "—"}
              />
              <SpecRow
                label="Int. Color"
                value={inventory.interior_color ?? "—"}
              />
              <SpecRow
                label="Mileage"
                value={formatNum(inventory.mileage_km, "km")}
              />
            </div>

            {/* Location */}
            {inventory.location && (
              <div className="border border-zinc-200 p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
                  Location
                </p>
                <p className="text-sm text-zinc-700">{inventory.location}</p>
              </div>
            )}
          </aside>
        </div>
      </main>

      {/* Lightbox */}
      {lightbox !== null && (
        <Lightbox
          images={mediaUrls}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onNav={(i) => setLightbox(i)}
        />
      )}

      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        onSuccess={markAsInquired}
        vehicle={{
          inventoryId: inventory.id,
          title: title,
          stockNumber: inventory.stock_number,
          price: formatPrice(displayPrice),
        }}
      />
    </div>
  );
}
