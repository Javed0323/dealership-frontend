import api from "@/shared/api/axios";
import type { TestDrive } from "./types";

export async function GetTestDrives() {
  try {
    const response = await api.get("/test_drives/");

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch TestDrives");
  }
}

export async function CreateTestDrive(carData: TestDrive) {
  try {
    const response = await api.post("/test_drives/", carData);

    return response.data;
  } catch (error) {
    throw new Error("Failed to add TestDrive");
  }
}

export async function UpdateTestDrive(id: number, carData: TestDrive) {
  try {
    const response = await api.patch(`/test_drives/${id}`, carData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update TestDrive");
  }
}

export async function DeleteTestDrive(id: number) {
  try {
    await api.delete(`/test_drives/${id}`);
  } catch (error) {
    throw new Error("Failed to delete TestDrive");
  }
}

export async function GetTestDrive(id: number) {
  try {
    const response = await api.get(`/test_drives/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch TestDrive");
  }
}

export async function GetInventories() {
  try {
    const response = await api.get("/inventories/");

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch inventories");
  }
}

export async function GetCustomers() {
  try {
    const response = await api.get("/customer/");

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch customers");
  }
}
