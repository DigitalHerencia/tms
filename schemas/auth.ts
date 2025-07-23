/**
 * Validation schemas for authentication-related forms
 * Using Zod for runtime validation
 *
 * All schemas are documented and deduplicated for maintainability.
 */

import { z } from 'zod';

import { SystemRoles } from '@/types/abac';

/**
 * signInSchema: Validates sign-in form fields
 */
export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  tenantId: z.string().optional(),
});

/**
 * signUpSchema: Validates sign-up form fields
 */
export const signUpSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character'
      ),
    confirmPassword: z.string(),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    companyName: z
      .string()
      .min(2, 'Company name must be at least 2 characters'),
    agreeToTerms: z.boolean().refine(val => val === true, {
      message: 'You must agree to the terms and conditions',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * forgotPasswordSchema: Validates forgot password form
 */
export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

/**
 * resetPasswordSchema: Validates reset password form
 */
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character'
      ),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const onboardingSchema = z.object({
  companyDetails: z.object({
    name: z.string().min(2, 'Company name must be at least 2 characters'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    city: z.string().min(2, 'City must be at least 2 characters'),
    state: z.string().min(2, 'State must be at least 2 characters'),
    zipCode: z.string().min(5, 'Zip code must be at least 5 characters'),
    phone: z.string().min(10, 'Phone number must be at least 10 characters'),
    dotNumber: z.string().optional(),
    mcNumber: z.string().optional(),
  }),
  businessType: z.enum([
    'sole_proprietor',
    'partnership',
    'llc',
    'corporation',
  ]),
  fleetSize: z.enum(['1_5', '6_15', '16_50', '51_100', '100_plus']),
  services: z.array(
    z.enum([
      'truckload',
      'ltl',
      'intermodal',
      'specialized',
      'refrigerated',
      'flatbed',
      'other',
    ])
  ),
  referralSource: z
    .enum(['search', 'social_media', 'referral', 'advertisement', 'other'])
    .optional(),
});

// Role validation schemas aligned with ABAC specification
export const systemRoleSchema = z.enum([
  SystemRoles.ADMIN,
  SystemRoles.DISPATCHER,
  SystemRoles.DRIVER,
  SystemRoles.COMPLIANCE,
  SystemRoles.MEMBER,
] as const);

export const userRoleAssignmentSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: systemRoleSchema,
  organizationId: z.string().min(1, 'Organization ID is required'),
});

export const updateUserRoleSchema = z.object({
  role: systemRoleSchema,
});

// Organization validation schemas
export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(100, 'Organization name must be less than 100 characters')
    .regex(
      /^[a-zA-Z0-9\s-.&.,()]+$/,
      'Organization name contains invalid characters'
    ),

  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug must be less than 50 characters')
    .regex(
      /^[a-z0-9\\-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens'
    )
    .optional(),

  createdBy: z.string().optional(),

  // Business information (optional during creation)
  dotNumber: z
    .string()
    .regex(/^\d{7,8}$/, 'DOT number must be 7-8 digits')
    .optional(),
  mcNumber: z
    .string()
    .regex(/^MC\d{6,7}$/, 'MC number must be in format MC123456')
    .optional(),
  address: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().length(2, 'State must be 2 characters').optional(),
  zip: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format')
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-(\\)]{10,15}$/, 'Invalid phone number format')
    .optional(),
  email: z.string().email('Invalid email address').optional(),

  // Additional metadata
});

export const updateOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(100, 'Organization name must be less than 100 characters')
    .regex(
      /^[a-zA-Z0-9\s\-&.,()]+$/,
      'Organization name contains invalid characters'
    )
    .optional(),

  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug must be less than 50 characters')
    .regex(
      /^[a-z0-9\\-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens'
    )
    .optional(),

  dotNumber: z
    .string()
    .regex(/^\d{7,8}$/, 'DOT number must be 7-8 digits')
    .optional(),
  mcNumber: z
    .string()
    .regex(/^MC\d{6,7}$/, 'MC number must be in format MC123456')
    .optional(),
  address: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().length(2, 'State must be 2 characters').optional(),
  zip: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format')
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\\(\\)]{10,15}$/, 'Invalid phone number format')
    .optional(),
  email: z.string().email('Invalid email address').optional(),

});

// Webhook payload validation schemas
export const webhookUserDataSchema = z.object({
  id: z.string(),
  email_addresses: z.array(
    z.object({
      email_address: z.string().email(),
      id: z.string(),
      verification: z
        .object({
          status: z.string(),
        })
        .optional(),
    })
  ),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  profile_image_url: z.string().url().optional(),
  organization_memberships: z
    .array(
      z.object({
        id: z.string(),
        organization: z.object({
          id: z.string(),
          name: z.string(),
          slug: z.string(),
        }),
        role: z.string(),
      })
    )
    .optional(),
  created_at: z.number(),
  updated_at: z.number(),
});

export const webhookOrganizationDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  members_count: z.number().optional(),
  created_at: z.number(),
  updated_at: z.number(),
});

export const webhookOrganizationMembershipDataSchema = z.object({
  id: z.string(),
  organization: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
  }),
  user_id: z.string().optional(),
  public_user_data: z
    .object({
      user_id: z.string(),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      profile_image_url: z.string().url().optional(),
    })
    .optional(),
  role: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
});
