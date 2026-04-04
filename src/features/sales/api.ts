import api from "@/shared/api/axios";
import type { Sale } from "./types";

export const GetSales = async () => {
  try {
    const response = await api.get("/sales/");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch sales");
  }
};

export const CreateSale = async (saleData: Sale) => {
  try {
    const response = await api.post("/sales/", saleData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create sale");
  }
};

export const UpdateSale = async (id: number, saleData: Sale) => {
  try {
    const response = await api.patch(`/sales/${id}`, saleData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update sale");
  }
};

export const DeleteSale = async (id: number) => {
  try {
    const response = await api.delete(`/sales/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete sale");
  }
};

export const GetSale = async (id: number) => {
  try {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch sale");
  }
};
