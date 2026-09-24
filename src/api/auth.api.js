import { apiClient } from "./client.js";

export async function login(role) {
  const { data } = await apiClient.post("/auth/login", { role });
  return data.data;
}

export async function getMe() {
  const { data } = await apiClient.get("/auth/me");
  return data.data.user;
}
