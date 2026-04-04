// types.ts
// ─────────────────────────────────────────────
// CAR ENGINE

// ─────────────────────────────────────────────
export interface CarEngineBase {
  fuel_type?: string | null; // Petrol, Diesel, Electric, Hybrid
  displacement_cc?: number | null;
  horsepower?: number | null;
  torque_nm?: number | null;
  transmission?: string | null; // Manual, Automatic, CVT
  transmission_gears?: number | null;
  drivetrain?: string | null; // FWD, RWD, AWD, 4WD
  fuel_economy_l100?: number | null;
  top_speed_kmh?: number | null;
  acceleration_sec?: number | null;
}

export interface CarEngineCreate extends CarEngineBase {}

export interface CarEngineRead extends CarEngineBase {
  id: number;
  car_id: number;
}

// ─────────────────────────────────────────────
// CAR DIMENSIONS
// ─────────────────────────────────────────────
export interface CarDimensionsBase {
  length_mm?: number | null;
  width_mm?: number | null;
  height_mm?: number | null;
  wheelbase_mm?: number | null;
  ground_clearance_mm?: number | null;
  curb_weight_kg?: number | null;
  fuel_tank_l?: number | null;
  boot_space_l?: number | null;
  doors?: number | null;
  seats?: number | null;
  tyre_size?: string | null;
}

export interface CarDimensionsCreate extends CarDimensionsBase {}

export interface CarDimensionsRead extends CarDimensionsBase {
  id: number;
  car_id: number;
}

// ─────────────────────────────────────────────
// CAR SAFETY
// ─────────────────────────────────────────────
export interface CarSafetyBase {
  ncap_rating?: number | null;
  airbag_count?: number | null;
  abs: boolean;
  esp: boolean;
  traction_control: boolean;
  hill_start_assist: boolean;
  hill_descent_control: boolean;
  lane_keep_assist: boolean;
  lane_departure_warning: boolean;
  blind_spot_monitor: boolean;
  rear_cross_traffic_alert: boolean;
  forward_collision_warning: boolean;
  auto_emergency_braking: boolean;
  traffic_sign_recognition: boolean;
  rear_camera: boolean;
  surround_view_camera: boolean;
  parking_sensors_front: boolean;
  parking_sensors_rear: boolean;
  self_parking: boolean;
}

export interface CarSafetyCreate extends CarSafetyBase {}

export interface CarSafetyRead extends CarSafetyBase {
  id: number;
  car_id: number;
}

// ─────────────────────────────────────────────
// CAR FEATURES
// ─────────────────────────────────────────────
export interface CarFeaturesBase {
  // Comfort
  sunroof: boolean;
  panoramic_roof: boolean;
  heated_seats: boolean;
  ventilated_seats: boolean;
  leather_seats: boolean;
  memory_seats: boolean;
  heated_steering_wheel: boolean;
  // Tech
  apple_carplay: boolean;
  android_auto: boolean;
  wireless_charging: boolean;
  keyless_entry: boolean;
  push_start: boolean;
  remote_start: boolean;
  heads_up_display: boolean;
  // Infotainment
  infotainment_screen_inch?: number | null;
  speaker_count?: number | null;
  premium_audio: boolean;
  // Lighting
  led_headlights: boolean;
  adaptive_headlights: boolean;
  ambient_lighting: boolean;
  // Convenience
  power_tailgate: boolean;
  power_mirrors: boolean;
  auto_dimming_mirror: boolean;
  cruise_control: boolean;
  adaptive_cruise_control: boolean;
}

export interface CarFeaturesCreate extends CarFeaturesBase {}

export interface CarFeaturesRead extends CarFeaturesBase {
  id: number;
  car_id: number;
}

// ─────────────────────────────────────────────
// CAR (core)
// ─────────────────────────────────────────────
export interface CarBase {
  id: number;
  make: string;
  model: string;
  year: number;
  category?: string | null; // Sedan, SUV, Truck
  segment?: string | null; // Compact, Midsize, Fullsize
  description?: string | null;
}

export interface CarCreate extends CarBase {
  engine?: CarEngineCreate | null;
  dimensions?: CarDimensionsCreate | null;
  safety?: CarSafetyCreate | null;
  features?: CarFeaturesCreate | null;
}

export interface CarUpdate {
  // All optional — partial updates
  make?: string | null;
  model?: string | null;
  year?: number | null;
  category?: string | null;
  segment?: string | null;
  description?: string | null;
  engine?: CarEngineCreate | null;
  dimensions?: CarDimensionsCreate | null;
  safety?: CarSafetyCreate | null;
  features?: CarFeaturesCreate | null;
}

export interface CarRead extends CarBase {
  id: number;
  created_at: string; // ISO datetime string
  updated_at?: string | null; // ISO datetime string

  engine?: CarEngineRead | null;
  dimensions?: CarDimensionsRead | null;
  safety?: CarSafetyRead | null;
  features?: CarFeaturesRead | null;
}
