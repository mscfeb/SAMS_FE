import { apiClient } from "./client.js";

export async function getAttendanceSessions(params = {}) { const { data } = await apiClient.get("/attendance/sessions", { params }); return data.data; }
export async function createAttendanceSession(payload) { const { data } = await apiClient.post("/attendance/sessions", payload); return data.data; }
export async function getAttendanceSession(id) { const { data } = await apiClient.get(`/attendance/sessions/${id}`); return data.data; }
export async function updateAttendanceRecord(id, status) { const { data } = await apiClient.patch(`/attendance/records/${id}`, { status }); return data.data; }
export async function submitAttendanceSession(id) { const { data } = await apiClient.post(`/attendance/sessions/${id}/submit`); return data.data; }
export async function getStudentAttendance(params = {}) { const { data } = await apiClient.get("/students/me/attendance", { params }); return data.data; }
export async function getStudentAttendanceHistory(params = {}) { const { data } = await apiClient.get("/students/me/attendance/history", { params }); return data.data; }
