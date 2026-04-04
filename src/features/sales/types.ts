export interface Sale {
  id?: number;
  inventory_id: number;
  customer_name: string;
  sale_date: number;
  sale_price: number;
  sale_status: "draft" | "completed" | "canceled";
  payment_status: "pending" | "overdue" | "paid";
}

export interface Inventory {
  id: number;
  vin: number;
  registration_number: number;
  color: String;
  purchase_price: number;
  status: "available" | "reserved" | "sold";
}

// Customer (optional)
export interface Customer {
  id: number;
  full_name: number;
  phone: number;
  address: "paid" | "pending";
  city: number;
  state: string;
  country: string;
}
