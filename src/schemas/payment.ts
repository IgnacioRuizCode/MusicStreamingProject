import { z } from 'zod'
import { SEED_PLANS } from '../data/seed/plans'

export const paymentSchema = z.object({
  cardHolder: z
    .string()
    .trim()
    .min(3, 'El nombre del titular debe tener al menos 3 caracteres')
    .max(20, 'El nombre del titular no puede superar los 20 caracteres'),
  cardNumber: z
    .string()
    .trim()
    .regex(/^(?:\d{4}[ -]?){3}\d{4}$/, 'Ingresá un número de tarjeta válido'),
  expiry: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Formato MM/AA'),
  cvv: z
    .string()
    .trim()
    .regex(/^\d{3,4}$/, 'CVV inválido'),
})

export type PaymentValues = z.infer<typeof paymentSchema>

export const plans = SEED_PLANS
