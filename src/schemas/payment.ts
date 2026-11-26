import { z } from 'zod'
import type { Plan } from '../types/types'

export const paymentSchema = z.object({
  cardHolder: z.string().trim().min(3, 'Ingresá el nombre del titular'),
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

export const plans: Plan[] = [
  {
    id: 'plan-free',
    name: 'Free',
    price: 0,
    benefits: ['Ad-supported music', 'Shuffle play', 'Standard audio quality'],
    featured: false,
  },
  {
    id: 'plan-individual',
    name: 'Individual',
    price: 9.99,
    benefits: ['Ad-free music', 'Download to listen offline', 'High audio quality', 'Cancel anytime'],
    featured: true,
  },
  {
    id: 'plan-duo',
    name: 'Duo',
    price: 12.99,
    benefits: ['2 Premium accounts', 'Ad-free music', 'Offline playback', 'Duo Mix playlist'],
    featured: false,
  },
  {
    id: 'plan-family',
    name: 'Family',
    price: 15.99,
    benefits: ['Up to 6 Premium accounts', 'Block explicit music', 'Ad-free music', 'Offline playback'],
    featured: false,
  },
]
