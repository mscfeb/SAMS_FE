import axios from "axios";
import { clearToken, getToken } from "../auth/auth-storage.js";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error("VITE_API_BASE_URL is required to run the frontend.");
}

export const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" }
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== "/login") {
      clearToken();
      window.location.assign("/login");
    }
    const backendError = error.response?.data?.error;
    const normalized = new Error(backendError?.message || "The request could not be completed.");
    normalized.code = backendError?.code || "REQUEST_FAILED";
    normalized.status = error.response?.status;
    normalized.details = backendError?.details;
    return Promise.reject(normalized);
  }
);
