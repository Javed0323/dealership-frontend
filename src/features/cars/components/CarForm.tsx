import React, { useEffect } from "react";
import EntityForm, { type FormField } from "@/shared/components/DynamicForm";
import type {
  CarBase,
  CarCreate,
  CarEngineCreate,
  CarDimensionsCreate,
  CarSafetyCreate,
  CarFeaturesCreate,
} from "../types";
import {
  GetCar,
  CreateCar,
  UpdateCar,
  UpdateCarEngine,
  UpdateCarDimensions,
  UpdateCarSafety,
  UpdateCarFeatures,
} from "../api";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

// ── Field definitions ─────────────────────────────────────────────────────────

const coreFields: FormField<CarBase>[] = [
  {
    name: "make",
    label: "Make",
    type: "text",
    required: true,
    placeholder: "e.g. Toyota",
    section: "Identity",
  },
  {
    name: "model",
    label: "Model",
    type: "text",
    required: true,
    placeholder: "e.g. Camry",
    section: "Identity",
  },
  {
    name: "year",
    label: "Year",
    type: "number",
    required: true,
    placeholder: "e.g. 2024",
    section: "Identity",
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    section: "Identity",
    options: [
      { label: "Sedan", value: "sedan" },
      { label: "SUV", value: "suv" },
      { label: "Hatchback", value: "hatchback" },
      { label: "Coupe", value: "coupe" },
      { label: "Truck", value: "truck" },
      { label: "Van", value: "van" },
      { label: "Convertible", value: "convertible" },
      { label: "Wagon", value: "wagon" },
    ],
  },
  {
    name: "segment",
    label: "Segment",
    type: "select",
    section: "Identity",
    options: [
      { label: "Economy", value: "economy" },
      { label: "Mid-range", value: "mid-range" },
      { label: "Luxury", value: "luxury" },
      { label: "Sport", value: "sport" },
      { label: "Off-road", value: "off-road" },
    ],
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder:
      "Describe the vehicle condition, history, and notable features...",
    section: "Details",
  },
];

const engineFields: FormField<CarEngineCreate>[] = [
  {
    name: "fuel_type",
    label: "Fuel Type",
    type: "select",
    section: "Engine",
    options: [
      { label: "Petrol", value: "petrol" },
      { label: "Diesel", value: "diesel" },
      { label: "Electric", value: "electric" },
      { label: "Hybrid", value: "hybrid" },
      { label: "Plug-in Hybrid", value: "plug_in_hybrid" },
    ],
  },
  {
    name: "displacement_cc",
    label: "Displacement (cc)",
    type: "number",
    placeholder: "e.g. 2500",
    section: "Engine",
  },
  {
    name: "horsepower",
    label: "Horsepower (hp)",
    type: "number",
    placeholder: "e.g. 203",
    section: "Engine",
  },
  {
    name: "torque_nm",
    label: "Torque (Nm)",
    type: "number",
    placeholder: "e.g. 350",
    section: "Engine",
  },
  {
    name: "transmission",
    label: "Transmission",
    type: "select",
    section: "Engine",
    options: [
      { label: "Automatic", value: "automatic" },
      { label: "Manual", value: "manual" },
      { label: "CVT", value: "cvt" },
      { label: "Semi-Automatic", value: "semi_automatic" },
    ],
  },
  {
    name: "transmission_gears",
    label: "Transmission Gears",
    type: "number",
    placeholder: "e.g. 8",
    section: "Engine",
  },
  {
    name: "drivetrain",
    label: "Drivetrain",
    type: "select",
    section: "Engine",
    options: [
      { label: "FWD", value: "fwd" },
      { label: "RWD", value: "rwd" },
      { label: "AWD", value: "awd" },
      { label: "4WD", value: "4wd" },
    ],
  },
  {
    name: "fuel_economy_l100",
    label: "Fuel Economy (L/100km)",
    type: "number",
    placeholder: "e.g. 7.5",
    section: "Performance",
  },
  {
    name: "top_speed_kmh",
    label: "Top Speed (km/h)",
    type: "number",
    placeholder: "e.g. 210",
    section: "Performance",
  },
  {
    name: "acceleration_sec",
    label: "0–100 km/h (sec)",
    type: "number",
    placeholder: "e.g. 8.2",
    section: "Performance",
  },
];

const dimensionsFields: FormField<CarDimensionsCreate>[] = [
  {
    name: "length_mm",
    label: "Length (mm)",
    type: "number",
    placeholder: "e.g. 4850",
    section: "Body",
  },
  {
    name: "width_mm",
    label: "Width (mm)",
    type: "number",
    placeholder: "e.g. 1840",
    section: "Body",
  },
  {
    name: "height_mm",
    label: "Height (mm)",
    type: "number",
    placeholder: "e.g. 1450",
    section: "Body",
  },
  {
    name: "wheelbase_mm",
    label: "Wheelbase (mm)",
    type: "number",
    placeholder: "e.g. 2750",
    section: "Body",
  },
  {
    name: "ground_clearance_mm",
    label: "Ground Clearance (mm)",
    type: "number",
    placeholder: "e.g. 180",
    section: "Body",
  },
  {
    name: "curb_weight_kg",
    label: "Curb Weight (kg)",
    type: "number",
    placeholder: "e.g. 1650",
    section: "Capacity",
  },
  {
    name: "fuel_tank_l",
    label: "Fuel Tank (L)",
    type: "number",
    placeholder: "e.g. 60",
    section: "Capacity",
  },
  {
    name: "boot_space_l",
    label: "Boot Space (L)",
    type: "number",
    placeholder: "e.g. 450",
    section: "Capacity",
  },
  {
    name: "doors",
    label: "Doors",
    type: "number",
    placeholder: "e.g. 4",
    section: "Capacity",
  },
  {
    name: "seats",
    label: "Seats",
    type: "number",
    placeholder: "e.g. 5",
    section: "Capacity",
  },
  {
    name: "tyre_size",
    label: "Tyre Size",
    type: "text",
    placeholder: "e.g. 225/55R17",
    section: "Capacity",
  },
];

const safetyFields: FormField<CarSafetyCreate>[] = [
  {
    name: "ncap_rating",
    label: "NCAP Rating (1–5)",
    type: "number",
    placeholder: "e.g. 5",
    section: "Ratings",
  },
  {
    name: "airbag_count",
    label: "Airbag Count",
    type: "number",
    placeholder: "e.g. 8",
    section: "Ratings",
  },
  { name: "abs", label: "ABS", type: "checkbox", section: "Active Safety" },
  { name: "esp", label: "ESP", type: "checkbox", section: "Active Safety" },
  {
    name: "traction_control",
    label: "Traction Control",
    type: "checkbox",
    section: "Active Safety",
  },
  {
    name: "hill_start_assist",
    label: "Hill Start Assist",
    type: "checkbox",
    section: "Active Safety",
  },
  {
    name: "hill_descent_control",
    label: "Hill Descent Control",
    type: "checkbox",
    section: "Active Safety",
  },
  {
    name: "lane_keep_assist",
    label: "Lane Keep Assist",
    type: "checkbox",
    section: "Driver Assist",
  },
  {
    name: "lane_departure_warning",
    label: "Lane Departure Warning",
    type: "checkbox",
    section: "Driver Assist",
  },
  {
    name: "blind_spot_monitor",
    label: "Blind Spot Monitor",
    type: "checkbox",
    section: "Driver Assist",
  },
  {
    name: "rear_cross_traffic_alert",
    label: "Rear Cross Traffic Alert",
    type: "checkbox",
    section: "Driver Assist",
  },
  {
    name: "forward_collision_warning",
    label: "Forward Collision Warning",
    type: "checkbox",
    section: "Driver Assist",
  },
  {
    name: "auto_emergency_braking",
    label: "Auto Emergency Braking",
    type: "checkbox",
    section: "Driver Assist",
  },
  {
    name: "traffic_sign_recognition",
    label: "Traffic Sign Recognition",
    type: "checkbox",
    section: "Driver Assist",
  },
  {
    name: "rear_camera",
    label: "Rear Camera",
    type: "checkbox",
    section: "Parking & Vision",
  },
  {
    name: "surround_view_camera",
    label: "Surround View Camera",
    type: "checkbox",
    section: "Parking & Vision",
  },
  {
    name: "parking_sensors_front",
    label: "Front Parking Sensors",
    type: "checkbox",
    section: "Parking & Vision",
  },
  {
    name: "parking_sensors_rear",
    label: "Rear Parking Sensors",
    type: "checkbox",
    section: "Parking & Vision",
  },
  {
    name: "self_parking",
    label: "Self Parking",
    type: "checkbox",
    section: "Parking & Vision",
  },
];

const featuresFields: FormField<CarFeaturesCreate>[] = [
  { name: "sunroof", label: "Sunroof", type: "checkbox", section: "Comfort" },
  {
    name: "panoramic_roof",
    label: "Panoramic Roof",
    type: "checkbox",
    section: "Comfort",
  },
  {
    name: "heated_seats",
    label: "Heated Seats",
    type: "checkbox",
    section: "Comfort",
  },
  {
    name: "ventilated_seats",
    label: "Ventilated Seats",
    type: "checkbox",
    section: "Comfort",
  },
  {
    name: "leather_seats",
    label: "Leather Seats",
    type: "checkbox",
    section: "Comfort",
  },
  {
    name: "memory_seats",
    label: "Memory Seats",
    type: "checkbox",
    section: "Comfort",
  },
  {
    name: "heated_steering_wheel",
    label: "Heated Steering Wheel",
    type: "checkbox",
    section: "Comfort",
  },
  {
    name: "apple_carplay",
    label: "Apple CarPlay",
    type: "checkbox",
    section: "Technology",
  },
  {
    name: "android_auto",
    label: "Android Auto",
    type: "checkbox",
    section: "Technology",
  },
  {
    name: "wireless_charging",
    label: "Wireless Charging",
    type: "checkbox",
    section: "Technology",
  },
  {
    name: "keyless_entry",
    label: "Keyless Entry",
    type: "checkbox",
    section: "Technology",
  },
  {
    name: "push_start",
    label: "Push Start",
    type: "checkbox",
    section: "Technology",
  },
  {
    name: "remote_start",
    label: "Remote Start",
    type: "checkbox",
    section: "Technology",
  },
  {
    name: "heads_up_display",
    label: "Heads-Up Display",
    type: "checkbox",
    section: "Technology",
  },
  {
    name: "infotainment_screen_inch",
    label: "Infotainment Screen (in)",
    type: "number",
    placeholder: "e.g. 12",
    section: "Infotainment",
  },
  {
    name: "speaker_count",
    label: "Speaker Count",
    type: "number",
    placeholder: "e.g. 8",
    section: "Infotainment",
  },
  {
    name: "premium_audio",
    label: "Premium Audio",
    type: "checkbox",
    section: "Infotainment",
  },
  {
    name: "led_headlights",
    label: "LED Headlights",
    type: "checkbox",
    section: "Lighting",
  },
  {
    name: "adaptive_headlights",
    label: "Adaptive Headlights",
    type: "checkbox",
    section: "Lighting",
  },
  {
    name: "ambient_lighting",
    label: "Ambient Lighting",
    type: "checkbox",
    section: "Lighting",
  },
  {
    name: "power_tailgate",
    label: "Power Tailgate",
    type: "checkbox",
    section: "Convenience",
  },
  {
    name: "power_mirrors",
    label: "Power Mirrors",
    type: "checkbox",
    section: "Convenience",
  },
  {
    name: "auto_dimming_mirror",
    label: "Auto-Dimming Mirror",
    type: "checkbox",
    section: "Convenience",
  },
  {
    name: "cruise_control",
    label: "Cruise Control",
    type: "checkbox",
    section: "Convenience",
  },
  {
    name: "adaptive_cruise_control",
    label: "Adaptive Cruise Control",
    type: "checkbox",
    section: "Convenience",
  },
];

// ── Defaults ──────────────────────────────────────────────────────────────────

const defaultCore: CarBase = {
  id: 0,
  make: "",
  model: "",
  year: new Date().getFullYear(),
  category: null,
  segment: null,
  description: null,
};
const defaultEngine: CarEngineCreate = {
  fuel_type: null,
  displacement_cc: null,
  horsepower: null,
  torque_nm: null,
  transmission: null,
  transmission_gears: null,
  drivetrain: null,
  fuel_economy_l100: null,
  top_speed_kmh: null,
  acceleration_sec: null,
};
const defaultDimensions: CarDimensionsCreate = {
  length_mm: null,
  width_mm: null,
  height_mm: null,
  wheelbase_mm: null,
  ground_clearance_mm: null,
  curb_weight_kg: null,
  fuel_tank_l: null,
  boot_space_l: null,
  doors: null,
  seats: null,
  tyre_size: null,
};
const defaultSafety: CarSafetyCreate = {
  ncap_rating: null,
  airbag_count: null,
  abs: false,
  esp: false,
  traction_control: false,
  hill_start_assist: false,
  hill_descent_control: false,
  lane_keep_assist: false,
  lane_departure_warning: false,
  blind_spot_monitor: false,
  rear_cross_traffic_alert: false,
  forward_collision_warning: false,
  auto_emergency_braking: false,
  traffic_sign_recognition: false,
  rear_camera: false,
  surround_view_camera: false,
  parking_sensors_front: false,
  parking_sensors_rear: false,
  self_parking: false,
};
const defaultFeatures: CarFeaturesCreate = {
  sunroof: false,
  panoramic_roof: false,
  heated_seats: false,
  ventilated_seats: false,
  leather_seats: false,
  memory_seats: false,
  heated_steering_wheel: false,
  apple_carplay: false,
  android_auto: false,
  wireless_charging: false,
  keyless_entry: false,
  push_start: false,
  remote_start: false,
  heads_up_display: false,
  infotainment_screen_inch: null,
  speaker_count: null,
  premium_audio: false,
  led_headlights: false,
  adaptive_headlights: false,
  ambient_lighting: false,
  power_tailgate: false,
  power_mirrors: false,
  auto_dimming_mirror: false,
  cruise_control: false,
  adaptive_cruise_control: false,
};

// ── Tab config ────────────────────────────────────────────────────────────────

type Tab =
  | "Overview"
  | "Engine"
  | "Dimensions"
  | "Safety"
  | "Features"
  | "Media";

const TABS: { key: Tab; label: string }[] = [
  { key: "Overview", label: "Overview" },
  { key: "Engine", label: "Engine" },
  { key: "Dimensions", label: "Dimensions" },
  { key: "Safety", label: "Safety" },
  { key: "Features", label: "Features" },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function CarCreate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const carId = id ? Number(id) : null;
  const isEdit = !!carId;

  const [activeTab, setActiveTab] = React.useState<Tab>("Overview");
  const [core, setCore] = React.useState<CarBase>(defaultCore);
  const [engine, setEngine] = React.useState<CarEngineCreate>(defaultEngine);
  const [dimensions, setDimensions] =
    React.useState<CarDimensionsCreate>(defaultDimensions);
  const [safety, setSafety] = React.useState<CarSafetyCreate>(defaultSafety);
  const [features, setFeatures] =
    React.useState<CarFeaturesCreate>(defaultFeatures);

  useEffect(() => {
    if (!carId) return;
    GetCar(carId).then((data) => {
      const {
        engine: e,
        dimensions: d,
        safety: s,
        features: f,
        ...base
      } = data;
      setCore(base);
      if (e) setEngine(e);
      if (d) setDimensions(d);
      if (s) setSafety(s);
      if (f) setFeatures(f);
    });
  }, [carId]);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleCreate = async (coreData: CarBase) => {
    const payload: CarCreate = {
      ...coreData,
      engine,
      dimensions,
      safety,
      features,
    };
    const created = await CreateCar(payload);
    navigate(`/admin/car/${created.id}/edit`);
  };

  const queryClient = useQueryClient();

  const handleUpdateCore = async (data: CarBase) => {
    await UpdateCar(carId!, data);
    queryClient.invalidateQueries({ queryKey: ["car", carId] });
  };
  const handleUpdateEngine = async (data: CarEngineCreate) => {
    await UpdateCarEngine(carId!, data);
    queryClient.invalidateQueries({ queryKey: ["car", carId] });
  };
  const handleUpdateDimensions = async (data: CarDimensionsCreate) => {
    await UpdateCarDimensions(carId!, data);
    queryClient.invalidateQueries({ queryKey: ["car", carId] });
  };
  const handleUpdateSafety = async (data: CarSafetyCreate) => {
    await UpdateCarSafety(carId!, data);
    queryClient.invalidateQueries({ queryKey: ["car", carId] });
  };
  const handleUpdateFeatures = async (data: CarFeaturesCreate) => {
    await UpdateCarFeatures(carId!, data);
    queryClient.invalidateQueries({ queryKey: ["car", carId] });
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&display=swap');

        .cfp {
          min-height: 100vh;
          background: #06080f;
          padding: 40px 24px 80px;
        }
        .cfp-inner {
          max-width: 900px;
          margin: 0 auto;
        }

        /* ── Header ── */
        .cfp-header {
          margin-bottom: 36px;
        }
        .cfp-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #6366f1;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .cfp-eyebrow::before {
          content: '';
          width: 20px;
          height: 1px;
          background: #6366f1;
        }
        .cfp-title {
          font-family: 'Syne', sans-serif;
          font-size: 34px;
          font-weight: 800;
          color: #f8fafc;
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin: 0 0 10px;
        }
        .cfp-title span {
          background: linear-gradient(135deg, #818cf8, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .cfp-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          line-height: 1.6;
        }

        /* ── Tabs ── */
        .cfp-tabs {
          display: flex;
          gap: 2px;
          background: #0d1117;
          border: 1px solid #1f2937;
          padding: 4px;
          margin-bottom: 28px;
          overflow-x: auto;
        }
        .cfp-tab {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          background: transparent;
          border: none;
          padding: 8px 18px;
          cursor: pointer;
          white-space: nowrap;
          transition: color 0.15s, background 0.15s;
          display: flex;
          align-items: center;
          gap: 7px;
          color: #6b7280;
        }
        .cfp-tab:hover:not(.cfp-tab--disabled) {
          color: #d1d5db;
          background: #111827;
        }
        .cfp-tab.cfp-tab--active {
          color: #f8fafc;
          background: #1f2937;
        }
        .cfp-tab.cfp-tab--disabled {
          cursor: not-allowed;
          opacity: 0.35;
        }
        .cfp-tab-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6366f1;
          flex-shrink: 0;
        }
        .cfp-tab-lock {
          width: 11px;
          height: 11px;
          opacity: 0.5;
          flex-shrink: 0;
        }

        /* ── Locked overlay ── */
        .cfp-locked {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 64px 24px;
          border: 1px dashed #1f2937;
          text-align: center;
        }
        .cfp-locked-icon {
          width: 36px;
          height: 36px;
          color: #374151;
        }
        .cfp-locked-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #4b5563;
          margin: 0;
        }
        .cfp-locked-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #374151;
          margin: 0;
        }
        .cfp-locked-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #6366f1;
          background: transparent;
          border: 1px solid #312e81;
          padding: 7px 16px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          margin-top: 4px;
        }
        .cfp-locked-btn:hover {
          background: #1e1b4b;
          color: #a5b4fc;
        }
      `}</style>

      <div className="cfp">
        <div className="cfp-inner">
          {/* Header */}
          <div className="cfp-header">
            <div className="cfp-eyebrow">
              {isEdit ? "Edit Listing" : "New Listing"}
            </div>
            <h1 className="cfp-title">
              {isEdit ? (
                <>
                  Update <span>Vehicle</span>
                </>
              ) : (
                <>
                  Add a <span>New Vehicle</span>
                </>
              )}
            </h1>
            <p className="cfp-subtitle">
              {isEdit
                ? "Each section saves independently — switch tabs freely."
                : "Start with the overview to create the listing. All other sections unlock once the listing is saved."}
            </p>
          </div>

          {/* Tabs */}
          <div className="cfp-tabs">
            {TABS.map(({ key, label }) => {
              const locked = !isEdit && key !== "Overview";
              const active = activeTab === key;
              return (
                <button
                  key={key}
                  className={[
                    "cfp-tab",
                    active ? "cfp-tab--active" : "",
                    locked ? "cfp-tab--disabled" : "",
                  ].join(" ")}
                  onClick={() => !locked && setActiveTab(key)}
                  title={
                    locked
                      ? "Save the overview first to unlock this section"
                      : undefined
                  }
                >
                  {active && !locked && <span className="cfp-tab-dot" />}
                  {locked && (
                    <svg
                      className="cfp-tab-lock"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  )}
                  {label}
                </button>
              );
            })}
          </div>

          {/* ── Overview ── */}
          {activeTab === "Overview" && (
            <EntityForm
              fields={coreFields}
              initialValues={core}
              mode={isEdit ? "edit" : "create"}
              onSubmit={isEdit ? handleUpdateCore : handleCreate}
            />
          )}

          {/* ── Engine ── */}
          {activeTab === "Engine" &&
            (isEdit ? (
              <EntityForm
                fields={engineFields}
                initialValues={engine}
                mode="edit"
                onSubmit={handleUpdateEngine}
              />
            ) : (
              <LockedPanel onGoToOverview={() => setActiveTab("Overview")} />
            ))}

          {/* ── Dimensions ── */}
          {activeTab === "Dimensions" &&
            (isEdit ? (
              <EntityForm
                fields={dimensionsFields}
                initialValues={dimensions}
                mode="edit"
                onSubmit={handleUpdateDimensions}
              />
            ) : (
              <LockedPanel onGoToOverview={() => setActiveTab("Overview")} />
            ))}

          {/* ── Safety ── */}
          {activeTab === "Safety" &&
            (isEdit ? (
              <EntityForm
                fields={safetyFields}
                initialValues={safety}
                mode="edit"
                onSubmit={handleUpdateSafety}
              />
            ) : (
              <LockedPanel onGoToOverview={() => setActiveTab("Overview")} />
            ))}

          {/* ── Features ── */}
          {activeTab === "Features" &&
            (isEdit ? (
              <EntityForm
                fields={featuresFields}
                initialValues={features}
                mode="edit"
                onSubmit={handleUpdateFeatures}
              />
            ) : (
              <LockedPanel onGoToOverview={() => setActiveTab("Overview")} />
            ))}
        </div>
      </div>
    </>
  );
}

// ── Locked panel ──────────────────────────────────────────────────────────────

function LockedPanel({ onGoToOverview }: { onGoToOverview: () => void }) {
  return (
    <div className="cfp-locked">
      <svg
        className="cfp-locked-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      <p className="cfp-locked-title">This section is locked</p>
      <p className="cfp-locked-sub">
        Save the overview first to unlock all sections.
      </p>
      <button className="cfp-locked-btn" onClick={onGoToOverview}>
        Go to Overview
      </button>
    </div>
  );
}
