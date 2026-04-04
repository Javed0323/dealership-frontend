// Car template / model
export interface Inventory {
  id: number;
  vin: number;
  registration_number: number;
  color: String;
  purchase_price: number;
  status: "available" | "reserved" | "sold";
}

// Offer
export interface Offer {
  id: number;
  inventory_id: number;
  title: String;
  description: String;
  discount_percentage: Number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

// Sale (optional)
export interface Sale {
  id: number;
  inventory_id: number;
  customer_id: number;
  payment_status: "paid" | "pending";
  price: number;
  created_at: string;
}
