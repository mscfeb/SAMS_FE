import { apiClient } from "./client.js";

export async function getAdminDashboard() {
  const { data } = await apiClient.get("/dashboard/admin");
  return data.data;
}

export async function getFacultyDashboard(limit = 10) {
  const { data } = await apiClient.get("/dashboard/faculty", { params: { limit } });
  return data.data;
}

export async function getStudentDashboard(limit = 10) {
  const { data } = await apiClient.get("/dashboard/student", { params: { limit } });
  return data.data;
}
