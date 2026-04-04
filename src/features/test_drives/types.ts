// Inventory template / model
// test drive
export interface TestDrive {
  id?: number;
  full_name: string;
  email: string;
  phone: string;
  inventory_id: number;
  scheduled_at: string;
  status: "pending" | "completed" | "canceled";
  notes: string;
}
