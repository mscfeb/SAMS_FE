import { apiClient } from "./client.js";

export async function getLowAttendance(params = {}) { const { data } = await apiClient.get("/reports/low-attendance", { params }); return data.data; }
