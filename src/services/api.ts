// src/services/api.ts

import axios from 'axios';
import DOMPurify from 'dompurify';

// ======================
// Base URL
// ======================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

// ======================
// Axios Instance
// ======================

export const api = axios.create({
  baseURL: API_BASE_URL,

  timeout: 15000,

  headers: {
    'Content-Type': 'application/json',
  },
});

// ======================
// Request Interceptor
// ======================

api.interceptors.request.use(
  (config) => {

    // Sanitize outgoing data
    if (
      config.data &&
      typeof config.data === 'object'
    ) {

      const sanitized = { ...config.data };

      Object.keys(sanitized).forEach((key) => {

        if (
          typeof sanitized[key] === 'string'
        ) {

          sanitized[key] = DOMPurify.sanitize(
            sanitized[key],
            {
              ALLOWED_TAGS: [],
              ALLOWED_ATTR: [],
            }
          );

        }
      });

      config.data = sanitized;
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

  (error) => {

    console.error(
      'API Error:',
      error?.response?.data || error.message
    );

    // Normalize error messages
    const normalizedError = {
      message:
        error?.response?.data?.error ||
        error?.message ||
        'Something went wrong',

      status:
        error?.response?.status || 500,
    };

    return Promise.reject(normalizedError);
  }
);