import { z } from 'zod';

const isAtLeast13YearsOld = (dateString: string): boolean => {
  const birth = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return false;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age >= 13;
};

export const perfilSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(20, 'El nombre de usuario no puede superar los 20 caracteres'),
  birthDate: z
    .string()
    .min(1, 'Ingresá tu fecha de nacimiento')
    .refine(isAtLeast13YearsOld, 'Debés tener al menos 13 años'),
  avatar: z
    .string()
    .trim()
    .refine(
      (val) => val === '' || /^https?:\/\/.+/i.test(val) || val.startsWith('data:image/'),
      'Ingresá una URL válida (http:// o https://) o dejalo vacío',
    ),
});

export type PerfilValues = z.infer<typeof perfilSchema>;

export const cambioPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Ingresá tu contraseña actual'),
    newPassword: z
      .string()
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Za-z]/, 'Debe incluir al menos una letra')
      .regex(/\d/, 'Debe incluir al menos un número'),
    confirmNewPassword: z.string().min(1, 'Confirmá la nueva contraseña'),
  })
  .refine((values) => values.newPassword === values.confirmNewPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmNewPassword'],
  })
  .refine((values) => values.currentPassword !== values.newPassword, {
    message: 'La nueva contraseña debe ser distinta a la actual',
    path: ['newPassword'],
  });

export type CambioPasswordValues = z.infer<typeof cambioPasswordSchema>;

export const invitadoPlanSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Ingresá el nombre del invitado (mín. 2 caracteres)')
    .max(40, 'El nombre no puede superar los 40 caracteres'),
  email: z
    .string()
    .trim()
    .min(1, 'Ingresá el correo electrónico del invitado')
    .email('Ingresá un correo válido'),
});

export type InvitadoPlanValues = z.infer<typeof invitadoPlanSchema>;

export const crearPlaylistSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'El título debe tener al menos 2 caracteres')
    .max(50, 'El título no puede superar los 50 caracteres'),
  description: z
    .string()
    .trim()
    .max(160, 'La descripción no puede superar los 160 caracteres')
    .optional()
    .or(z.literal('')),
  cover: z
    .string()
    .trim()
    .refine(
      (val) => val === '' || /^https?:\/\/.+/i.test(val),
      'Ingresá una URL válida de imagen o dejalo vacío',
    )
    .optional()
    .or(z.literal('')),
});

export type CrearPlaylistValues = z.infer<typeof crearPlaylistSchema>;