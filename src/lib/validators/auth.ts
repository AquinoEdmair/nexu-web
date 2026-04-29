import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('validation.invalidEmail'),
  password: z.string().min(1, 'validation.required'),
  captcha_token: z.string().optional(),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, 'validation.minChars').max(100),
    email: z.email('validation.invalidEmail'),
    password: z
      .string()
      .min(8, 'validation.minChars')
      .regex(/[A-Z]/, 'validation.uppercase')
      .regex(/[a-z]/, 'validation.lowercase')
      .regex(/[0-9]/, 'validation.number'),
    password_confirmation: z.string(),
    phone: z.string().optional().or(z.literal('')),
    referral_code: z.string().max(10).optional().or(z.literal('')),
    captcha_token: z.string().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'validation.passwordMismatch',
    path: ['password_confirmation'],
  });

export const forgotPasswordSchema = z.object({
  email: z.email('validation.invalidEmail'),
});

export const resetPasswordSchema = z
  .object({
    email: z.email('validation.invalidEmail'),
    token: z.string().min(1),
    password: z
      .string()
      .min(8, 'validation.minChars')
      .regex(/[A-Z]/, 'validation.uppercase')
      .regex(/[a-z]/, 'validation.lowercase')
      .regex(/[0-9]/, 'validation.number'),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'validation.passwordMismatch',
    path: ['password_confirmation'],
  });

// Inferred types
export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
