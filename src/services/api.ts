import axios, { AxiosError } from "axios";

// ======================
// Base URL
// ======================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ======================
// Types
// ======================

export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}

// ======================
// Axios Instance
// ======================

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ======================
// Response Interceptor
// ======================

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<any>) => {
    const normalized: ApiError = {
      message:
        error.response?.data?.error ||
        error.message ||
        "Request failed",

      status: error.response?.status || 500,

      details: error.response?.data?.details,
    };

    return Promise.reject(normalized);
  }
);