// ── Enums ──────────────────────────────────────────────────────────────────

import type { CarRead } from "../cars/types";

export type UnitCondition = "new" | "used" | "refurbished";

export type InventoryStatus = "available" | "reserved" | "sold" | "maintenance";

// ── Inventory ──────────────────────────────────────────────────────────────

export interface Inventory {
  id: number;
  car_id: number;

  // Identification
  vin: string | null;
  registration_number: string | null;
  stock_number: string | null;

  // Physical
  exterior_color: string | null;
  interior_color: string | null;
  mileage_km: number | null;

  // Condition & Status
  condition: UnitCondition;
  status: InventoryStatus;

  // Pricing
  purchase_price: number | null;
  selling_price: number;
  discounted_price: number | null;

  // Purchase Info
  purchased_at: string | null; // ISO datetime string
  location: string;

  // Internal
  notes: string | null;

  // Timestamps
  created_at: string;
  updated_at: string | null;
  car: CarRead;
  media: CarMediaRead[] | null;
}

// ── Create / Update Payloads ───────────────────────────────────────────────

export interface CreateInventoryPayload {
  car_id: number;
  vin?: string | null;
  registration_number?: string | null;
  stock_number?: string | null;
  exterior_color?: string | null;
  interior_color?: string | null;
  mileage_km?: number | null;
  condition: UnitCondition;
  status?: InventoryStatus;
  purchase_price?: number | null;
  selling_price: number;
  discounted_price?: number | null;
  purchased_at?: string | null;
  location?: string;
  notes?: string | null;
}

export interface UpdateInventoryPayload {
  vin?: string | null;
  registration_number?: string | null;
  stock_number?: string | null;
  exterior_color?: string | null;
  interior_color?: string | null;
  mileage_km?: number | null;
  condition?: UnitCondition;
  status?: InventoryStatus;
  purchase_price?: number | null;
  selling_price?: number;
  discounted_price?: number | null;
  purchased_at?: string | null;
  location?: string;
  notes?: string | null;
}

// ─────────────────────────────────────────────
// CAR MEDIA
// ─────────────────────────────────────────────
export interface CarMediaRead {
  id: number;
  inventory_id: number;
  media_type: string;
  url: string;
  alt_text?: string | null;
  is_primary: boolean;
  uploaded_at: string; // ISO datetime string
}
