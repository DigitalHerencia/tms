import { z } from 'zod';

export const ProfileSetupSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  phone: z.string().optional(),
});

export const CompanySetupSchema = z.object({
  dotNumber: z.string().optional(),
  mcNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  phone: z.string().optional(),
  timezone: z.string().default('America/Denver'),
  dateFormat: z.string().default('MM/dd/yyyy'),
  distanceUnit: z.enum(['miles', 'kilometers']).default('miles'),
  fuelUnit: z.enum(['gallons', 'liters']).default('gallons'),
});

export const OnboardingStepSchema = z.object({
  step: z.enum(['profile', 'company']),
  data: z.union([ProfileSetupSchema, CompanySetupSchema]),
});

export type ProfileSetupFormData = z.infer<typeof ProfileSetupSchema>;
export type CompanySetupFormData = z.infer<typeof CompanySetupSchema>;

export const CompleteOnboardingSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  role: z.string().min(1),
  companyName: z.string(),
  dotNumber: z.string().optional(),
  mcNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  phone: z.string().optional(),
  organizationId: z.string().optional(),
  inviteCode: z.string().optional(),
});

export type CompleteOnboardingData = z.infer<typeof CompleteOnboardingSchema>;
