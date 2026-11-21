import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Ingresá un correo válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export type LoginValues = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres').max(50),
    email: z.email('Ingresá un correo válido'),
    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .regex(/[A-Z]/, 'Debe incluir una letra mayúscula')
      .regex(/\d/, 'Debe incluir un número'),
    confirmPassword: z.string().min(1, 'Confirmá tu contraseña'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    error: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export type RegisterValues = z.infer<typeof registerSchema>
