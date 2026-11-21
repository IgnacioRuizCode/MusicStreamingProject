import { z } from 'zod'
import type { Plan } from '@/tipos'

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
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Escuchá música sin costo, con anuncios.',
    features: ['Catálogo completo', 'Playlist personal', 'Reproducción simulada'],
    featured: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    description: 'Toda la música, sin interrupciones.',
    features: ['Sin anuncios', 'Descargas offline', 'Calidad alta', 'Canciones ilimitadas'],
    featured: true,
  },
  {
    id: 'family',
    name: 'Family',
    price: 14.99,
    description: 'Hasta 6 cuentas para toda la familia.',
    features: ['6 cuentas', 'Playlist familiar', 'Control parental', 'Sin anuncios'],
    featured: false,
  },
]
