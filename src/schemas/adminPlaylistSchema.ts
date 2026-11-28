import { z } from 'zod';

export const adminPlaylistSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(20, 'El título no puede superar los 20 caracteres'),
  description: z
    .string()
    .trim()
    .min(3, 'La descripción debe tener al menos 3 caracteres')
    .max(20, 'La descripción no puede superar los 20 caracteres')
    .optional()
    .or(z.literal('')),
  cover: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === '' ||
        /^https?:\/\/.+/i.test(value) ||
        value.startsWith('data:image/'),
      'Ingresá una URL válida o dejalo vacío'
    )
    .optional()
    .or(z.literal('')),
  creatorId: z.string().min(1, 'Seleccioná un creador'),
});

export type AdminPlaylistFormData = z.infer<typeof adminPlaylistSchema>;
