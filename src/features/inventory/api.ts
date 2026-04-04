import api from "@/shared/api/axios";
import type { CreateInventoryPayload, Inventory } from "./types";

export async function GetInventories() {
  try {
    const response = await api.get("/inventories/");

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch inventories");
  }
}

export async function GetInventoriesList({ limit }: { limit?: number }) {
  try {
    const response = await api.get("/inventories/", { params: { limit } });

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch inventories");
  }
}

export async function GetLatestInventories({
  limit,
  ordering,
}: { limit?: number; ordering?: string } = {}) {
  try {
    const response = await api.get("/inventories/", {
      params: { limit, ordering },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch inventories",
    );
  }
}

export async function GetInventoriesAdmin() {
  try {
    const response = await api.get("/inventories/admin/");

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch inventories");
  }
}

export async function CreateInventory(carData: CreateInventoryPayload) {
  try {
    const response = await api.post("/inventories/", carData);

    return response.data;
  } catch (error) {
    throw new Error("Failed to add Inventory");
  }
}

export async function UpdateInventory(id: number, carData: Inventory) {
  try {
    const response = await api.patch(`/inventories/${id}`, carData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update Inventory");
  }
}

export async function DeleteInventory(id: number) {
  try {
    await api.delete(`/inventories/${id}`);
  } catch (error) {
    throw new Error("Failed to delete Inventory");
  }
}

export async function GetInventoryUnit(id: number) {
  try {
    const response = await api.get(`/inventories/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch Inventory");
  }
}

export async function GetInventoryUnitAdmin(id: number) {
  try {
    const response = await api.get(`/inventories/admin/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch Inventory");
  }
}

export async function GetCars() {
  try {
    const response = await api.get("/cars/");

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch cars");
  }
}

export async function BulkUploadInventory(carId: number, file: File) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
      `/inventories/bulk-upload/${carId}`,
      formData,
    );

    return response.data as {
      message: string;
      created: number;
      skipped: number;
      errors: string[];
    };
  } catch (error) {
    throw new Error("Failed to bulk upload inventory");
  }
}

export async function GetOffers() {
  const response = await api.get("/offers/");
  return response.data;
}

export async function GetOfferByInventoryId(inventoryId: number) {
  const response = await api.get(`/offers/inventory_id=${inventoryId}`);
  return response.data; // return first active match
}
