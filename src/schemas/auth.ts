import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Ingresá tu correo electrónico')
    .email('Ingresá un correo válido'),
  password: z.string().min(1, 'Ingresá tu contraseña'),
});

export type LoginValues = z.infer<typeof loginSchema>;

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

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
      .max(20, 'El nombre de usuario no puede superar los 20 caracteres'),
    email: z
      .string()
      .trim()
      .min(1, 'Ingresá tu correo electrónico')
      .email('Ingresá un correo válido'),
    birthDate: z
      .string()
      .min(1, 'Ingresá tu fecha de nacimiento')
      .refine(isAtLeast13YearsOld, 'Debés tener al menos 13 años para registrarte'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Za-z]/, 'Debe incluir al menos una letra')
      .regex(/\d/, 'Debe incluir al menos un número'),
    confirmPassword: z.string().min(1, 'Confirmá tu contraseña'),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'Debés aceptar los términos y condiciones',
    }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type RegisterValues = z.infer<typeof registerSchema>;
