import { z } from 'zod';

export const adminPlaylistSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'El título debe tener al menos 2 caracteres')
    .max(80, 'El título no puede superar los 80 caracteres'),
  description: z
    .string()
    .trim()
    .max(200, 'La descripción no puede superar los 200 caracteres')
    .optional()
    .or(z.literal('')),
  cover: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || /^https?:\/\/.+/i.test(value),
      'Ingresá una URL válida o dejalo vacío'
    )
    .optional()
    .or(z.literal('')),
  creatorId: z.string().min(1, 'Seleccioná un creador'),
});

export type AdminPlaylistFormData = z.infer<typeof adminPlaylistSchema>;
