// src/services/contactService.ts

import { api } from './api'

export interface ContactPayload {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  website?: string
  loadedAt?: number
  'cf-turnstile-response': string
}

export const contactService = {
  submitForm: async (data: ContactPayload) => {
    const response = await api.post('', data)
    return response.data
  },
}