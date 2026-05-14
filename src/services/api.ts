import axios from 'axios'
import DOMPurify from 'dompurify'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Sanitize request data
    if (config.data && typeof config.data === 'object') {
      const sanitized = { ...config.data }
      Object.keys(sanitized).forEach(key => {
        if (typeof sanitized[key] === 'string') {
          sanitized[key] = DOMPurify.sanitize(sanitized[key])
        }
      })
      config.data = sanitized
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// export const contactService = {
//   submitForm: async (data: any) => {
//     // In production, replace with actual API endpoint
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({ success: true, message: 'Form submitted successfully' })
//       }, 1000)
//     })
//   },
// }