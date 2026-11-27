import { z } from 'zod';

export const adminSongSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'El título debe tener al menos 2 caracteres')
    .max(80, 'El título no puede superar los 80 caracteres'),
  artistId: z.string().min(1, 'Seleccioná un artista'),
  cover: z.url('Ingresá una URL válida para la portada'),
  url: z.url('Ingresá una URL válida para el audio'),
  duration: z
    .number({ message: 'Ingresá una duración válida' })
    .int('La duración debe ser un número entero')
    .min(30, 'La duración mínima es de 30 segundos')
    .max(3600, 'La duración máxima es de 3600 segundos'),
});

export type AdminSongFormData = z.infer<typeof adminSongSchema>;
