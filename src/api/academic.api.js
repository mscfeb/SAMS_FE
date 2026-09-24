import { apiClient } from "./client.js";

export async function listAcademic(resource, params = {}) {
  const { data } = await apiClient.get(`/${resource}`, { params });
  return data.data;
}

export async function getAcademic(resource, id) {
  const { data } = await apiClient.get(`/${resource}/${id}`);
  return data.data;
}

export async function createAcademic(resource, payload) {
  const { data } = await apiClient.post(`/${resource}`, payload);
  return data.data;
}

export async function updateAcademic(resource, id, payload) {
  const { data } = await apiClient.patch(`/${resource}/${id}`, payload);
  return data.data;
}

export async function deleteAcademic(resource, id) {
  const { data } = await apiClient.delete(`/${resource}/${id}`);
  return data.data;
}
