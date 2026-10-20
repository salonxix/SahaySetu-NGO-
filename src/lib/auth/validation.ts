import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const registerNgoSchema = z
  .object({
    ngoName: z.string().trim().min(2, 'NGO Name must be at least 2 characters'),
    registrationNumber: z
      .string()
      .trim()
      .min(3, 'Registration / Darpan ID is required (min 3 characters)'),
    focusSector: z.string().trim().min(2, 'Focus sector is required'),
    contactPerson: z
      .string()
      .trim()
      .min(2, 'Contact person name is required'),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Please enter a valid email address'),
    phoneNumber: z
      .string()
      .trim()
      .regex(/^[0-9+\s-]{8,15}$/, 'Please enter a valid phone number'),
    state: z.string().trim().min(2, 'State is required'),
    city: z.string().trim().optional(),
    address: z.string().trim().optional(),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const registerUserSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Full name must be at least 2 characters'),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Please enter a valid email address'),
    phoneNumber: z
      .string()
      .trim()
      .regex(/^[0-9+\s-]{8,15}$/, 'Please enter a valid phone number')
      .optional()
      .or(z.literal('')),
    state: z.string().trim().optional().or(z.literal('')),
    preferredLanguage: z.string().trim().optional().or(z.literal('')),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['ngo', 'user']).optional(),
});

export type RegisterNgoInput = z.infer<typeof registerNgoSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
