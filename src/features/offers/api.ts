import api from "@/shared/api/axios";
import type { Offer } from "./types";

export async function GetOffers() {
  try {
    const response = await api.get("/offers/");

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch offers");
  }
}

export async function CreateOffer(carData: Offer) {
  try {
    const response = await api.post("/offers/", carData);

    return response.data;
  } catch (error) {
    throw new Error("Failed to add Offer");
  }
}

export async function UpdateOffer(id: number, carData: Offer) {
  try {
    const response = await api.patch(`/offers/${id}`, carData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update Offer");
  }
}

export async function DeleteOffer(id: number) {
  try {
    await api.delete(`/offers/${id}`);
  } catch (error) {
    throw new Error("Failed to delete Offer");
  }
}

export async function GetOffer(id: number) {
  try {
    const response = await api.get(`/offers/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch Offer");
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
