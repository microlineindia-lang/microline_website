import { api } from "./api";

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  website?: string;
  loadedAt?: number;
  "cf-turnstile-response": string;
}

export const contactService = {
  submitForm: (data: ContactPayload) => {
    return api.post("/server/contactApi/", data);
  },
};