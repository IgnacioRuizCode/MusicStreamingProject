import { z } from 'zod';

export const planSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(20, 'El nombre no puede superar los 20 caracteres'),
  precio: z
    .number({ message: 'Debe ser un número válido' })
    .min(0, 'El precio no puede ser negativo'),
  destacado: z.boolean(),
  beneficios: z
    .array(
      z.object({
        value: z
          .string()
          .trim()
          .min(3, 'El beneficio debe tener al menos 3 caracteres')
          .max(20, 'El beneficio no puede superar los 20 caracteres'),
      })
    )
    .min(1, 'Agregá al menos un beneficio'),
});

export type PlanFormData = z.infer<typeof planSchema>;
