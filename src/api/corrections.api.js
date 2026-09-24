import { apiClient } from "./client.js";

export async function getCorrections(params = {}) { const { data } = await apiClient.get("/corrections", { params }); return data.data; }
export async function createCorrection(payload) { const { data } = await apiClient.post("/corrections", payload); return data.data; }
export async function approveCorrection(id) { console.log(id,'hgfh'); const { data } = await apiClient.post(`/corrections/${id}/approve`); return data.data; }
export async function rejectCorrection(id) { const { data } = await apiClient.post(`/corrections/${id}/reject`); return data.data; }
