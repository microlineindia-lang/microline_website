// src/services/api.ts

import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';

// ======================
// Base URL
// ======================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

// ======================
// API Error Type
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
    'Content-Type': 'application/json',
  },

  withCredentials: false,
});

// ======================
// Request Interceptor
// ======================

api.interceptors.request.use(

  (
    config: InternalAxiosRequestConfig
  ) => {

    // Optional:
    // Trim string fields only.
    // DO NOT sanitize tokens or auth values.

    if (
      config.data &&
      typeof config.data === 'object'
    ) {

      const cleaned = { ...config.data };

      Object.keys(cleaned).forEach((key) => {

        const value = cleaned[key];

        // Skip tokens
        if (
          key === 'cf-turnstile-response'
        ) {
          return;
        }

        if (
          typeof value === 'string'
        ) {

          cleaned[key] = value.trim();

        }
      });

      config.data = cleaned;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// ======================
// Response Interceptor
// ======================

api.interceptors.response.use(

  (response) => response,

  (error: AxiosError<any>) => {

    console.error(
      'API Error:',
      error?.response?.data || error.message
    );

    const normalizedError: ApiError = {

      message:
        error.response?.data?.error ||
        error.message ||
        'Something went wrong',

      status:
        error.response?.status || 500,

      details:
        error.response?.data?.details ||
        null,
    };

    return Promise.reject(normalizedError);
  }
);