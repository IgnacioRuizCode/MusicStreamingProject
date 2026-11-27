import { z } from 'zod';

export const adminUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(20, 'El nombre de usuario no puede superar los 20 caracteres'),
  avatar: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === '' ||
        /^https?:\/\/.+/i.test(value) ||
        value.startsWith('data:image/'),
      'Ingresá una URL válida o dejalo vacío'
    ),
  role: z.enum(['user', 'admin']),
  planId: z.string(),
});

export type AdminUserFormData = z.infer<typeof adminUserSchema>;
