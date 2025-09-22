import { z } from 'zod'

export const registerFormSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters long' })
      .max(50, { message: 'Name must be less than 50 characters' }),
    email: z
      .string()
      .email({ message: 'Please enter a valid email address' }),
    phone: z
      .string()
      .min(10, { message: 'Phone number must be at least 10 digits' })
      .regex(/^\+\d{1,4}\d{7,14}$/, {
        message: 'Please enter a valid phone number with country code'
      }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number'
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const loginFormSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' }),
})

export type RegisterFormData = z.infer<typeof registerFormSchema>
export type LoginFormData = z.infer<typeof loginFormSchema>