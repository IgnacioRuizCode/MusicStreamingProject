import { z } from 'zod'

export const songSchema = z.object({
  name: z.string().trim().min(2, 'El título es demasiado corto').max(80),
  artist: z.string().trim().min(2, 'El artista es demasiado corto').max(80),
  album: z.string().trim().min(2, 'El álbum es demasiado corto').max(80),
  image: z.url('Ingresá una URL válida para la portada'),
  audio: z.url('Ingresá una URL válida para el archivo'),
  year: z.number().int().min(1900, 'Año inválido').max(2100, 'Año inválido'),
  genre: z.string().trim().min(2, 'El género es demasiado corto').max(40),
  duration: z.number().int().min(30, 'Mínimo 30 segundos').max(3600, 'Máximo 1 hora'),
})

export type SongValues = z.infer<typeof songSchema>
