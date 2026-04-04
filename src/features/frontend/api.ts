import api from "@/shared/api/axios";
import type { TestDrive } from "../test_drives/types";
import type { Inventory } from "../inventory/types";

export async function GetInventory(id: number): Promise<Inventory> {
  try {
    const response = await api.get(`/inventories/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch car details");
  }
}

export async function CreateTestDrive(testDrive: TestDrive) {
  const response = await api.post(`/test_drives/`, testDrive);
  return response.data;
}
