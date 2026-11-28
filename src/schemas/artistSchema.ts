import { z } from 'zod';

export const artistSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(20, 'El nombre no puede superar los 20 caracteres'),
  image: z
    .string()
    .trim()
    .min(1, 'La URL o ruta de la imagen es obligatoria')
    .refine(
      (val) => val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/'),
      'Ingresá una URL válida (http/https) o una ruta local (/...)'
    ),
  monthlyListeners: z
  .number({ message: 'Debe ser un número válido' })
  .int('Debe ser un número entero')
  .min(0, 'No puede ser negativo'),
});

export type ArtistFormData = z.infer<typeof artistSchema>;

export interface Artist extends ArtistFormData {
  id: string;
}