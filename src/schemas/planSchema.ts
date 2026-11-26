import { z } from 'zod';

export const planSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(60, 'El nombre no puede superar los 60 caracteres'),
  price: z
    .number({ message: 'Debe ser un número válido' })
    .min(0, 'El precio no puede ser negativo'),
  featured: z.boolean(),
  benefits: z
    .array(
      z.object({
        value: z.string().trim().min(2, 'El beneficio no puede estar vacío'),
      })
    )
    .min(1, 'Agregá al menos un beneficio'),
});

export type PlanFormData = z.infer<typeof planSchema>;