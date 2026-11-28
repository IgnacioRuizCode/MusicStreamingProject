import { z } from 'zod'

export const songSchema = z.object({
  name: z.string().trim().min(3, 'El título debe tener al menos 3 caracteres').max(20),
  artist: z.string().trim().min(3, 'El artista debe tener al menos 3 caracteres').max(20),
  album: z.string().trim().min(3, 'El álbum debe tener al menos 3 caracteres').max(20),
  image: z.url('Ingresá una URL válida para la portada'),
  audio: z.url('Ingresá una URL válida para el archivo'),
  year: z.number().int().min(1900, 'Año inválido').max(2100, 'Año inválido'),
  genre: z.string().trim().min(3, 'El género debe tener al menos 3 caracteres').max(20),
  duration: z.number().int().min(30, 'Mínimo 30 segundos').max(3600, 'Máximo 1 hora'),
})

export type SongValues = z.infer<typeof songSchema>
