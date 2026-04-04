// cars/api.ts
import api from "@/shared/api/axios";
import type {
  CarCreate,
  CarUpdate,
  CarRead,
  CarEngineCreate,
  CarDimensionsCreate,
  CarSafetyCreate,
  CarFeaturesCreate,
} from "./types";

export async function GetCars(): Promise<CarRead[]> {
  const response = await api.get("/cars/");
  return response.data;
}

export async function GetCar(id: number): Promise<CarRead> {
  const response = await api.get(`/cars/${id}`);
  return response.data;
}

export async function CreateCar(data: CarCreate): Promise<CarRead> {
  const response = await api.post("/cars/", data);
  return response.data;
}

export async function UpdateCar(id: number, data: CarUpdate): Promise<CarRead> {
  const response = await api.patch(`/cars/${id}`, data);
  return response.data;
}

export async function UpdateCarEngine(
  id: number,
  data: CarEngineCreate,
): Promise<CarRead> {
  const response = await api.put(`/cars/${id}/engine`, data);
  return response.data;
}

export async function UpdateCarDimensions(
  id: number,
  data: CarDimensionsCreate,
): Promise<CarRead> {
  const response = await api.put(`/cars/${id}/dimensions`, data);
  return response.data;
}

export async function UpdateCarSafety(
  id: number,
  data: CarSafetyCreate,
): Promise<CarRead> {
  const response = await api.put(`/cars/${id}/safety`, data);
  return response.data;
}

export async function UpdateCarFeatures(
  id: number,
  data: CarFeaturesCreate,
): Promise<CarRead> {
  const response = await api.put(`/cars/${id}/features`, data);
  return response.data;
}

export async function DeleteCar(id: number): Promise<void> {
  await api.delete(`/cars/${id}`);
}

export async function SearchCars(
  params: Record<string, string | number>,
): Promise<{
  total: number;
  limit: number;
  offset: number;
  results: CarRead[];
}> {
  const response = await api.get("/cars/search", { params });
  return response.data;
}

// api/carMedia.ts

interface UploadMediaPayload {
  file: File;
  media_type: "image" | "video" | "360";
  alt_text?: string;
  is_primary?: boolean;
}

export async function GetCarMedia(inventoryId: number) {
  try {
    const response = await api.get(`/cars/${inventoryId}/media/`);
    return response.data;
  } catch {
    throw new Error("Failed to fetch car media");
  }
}

export async function UploadCarMedia(
  inventoryId: number,
  payload: UploadMediaPayload,
) {
  try {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("media_type", payload.media_type);
    formData.append("alt_text", payload.alt_text ?? "");
    formData.append("is_primary", String(payload.is_primary ?? false));

    const response = await api.post(`/cars/${inventoryId}/media/`, formData);
    return response.data;
  } catch {
    throw new Error("Failed to upload media");
  }
}

export async function DeleteCarMedia(inventoryId: number, mediaId: number) {
  try {
    const response = await api.delete(`/cars/${inventoryId}/media/${mediaId}`);
    return response.data;
  } catch {
    throw new Error("Failed to delete media");
  }
}

export async function SetPrimaryMedia(inventoryId: number, mediaId: number) {
  try {
    const response = await api.patch(
      `/cars/${inventoryId}/media/${mediaId}/set-primary`,
    );
    return response.data;
  } catch {
    throw new Error("Failed to set primary media");
  }
}

export async function UpdateCarMediaAlt(
  inventoryId: number,
  mediaId: number,
  altText: string,
) {
  try {
    const response = await api.patch(`/cars/${inventoryId}/media/${mediaId}`, {
      alt_text: altText,
    });
    return response.data;
  } catch {
    throw new Error("Failed to update alt text");
  }
}
