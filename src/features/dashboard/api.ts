import api from "@/shared/api/axios";

export async function GetDashboardData() {
  try {
    const res = await api.get("/dashboard/");
    return res.data;
  } catch (error) {
    throw new Error("failed to load dashboard");
  }
}
