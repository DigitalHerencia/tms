// Shared Zod schema fragments for DRY compliance
import { z } from 'zod';

export const addressSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'ZIP code is required'),
});

export const contactSchema = z.object({
  contact: z.string().min(1, 'Contact is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email address'),
});
