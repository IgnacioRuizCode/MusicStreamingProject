import { z } from 'zod';

export type MarcaTarjeta =
  | 'Visa'
  | 'Mastercard'
  | 'Amex'
  | 'Discover'
  | 'Diners'
  | 'JCB'
  | 'Tarjeta';

export function luhnCheck(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return /^\d{13,19}$/.test(digits);
}

export function detectarMarca(value: string): MarcaTarjeta {
  const digits = value.replace(/\D/g, '');
  const firstFour = Number(digits.slice(0, 4));

  if (/^4/.test(digits)) return 'Visa';
  if (/^5[1-5]/.test(digits) || (firstFour >= 2221 && firstFour <= 2720)) {
    return 'Mastercard';
  }
  if (/^3[47]/.test(digits)) return 'Amex';
  if (/^(6011|65|64[4-9])/.test(digits)) return 'Discover';
  if (/^3(0[0-5]|[68])/.test(digits)) return 'Diners';
  if (/^35/.test(digits)) return 'JCB';

  return 'Tarjeta';
}

export function formatearNumeroTarjeta(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function formatearVencimiento(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);

  if (digits.length === 0) return '';
  if (digits.length === 1) {
    return Number(digits) > 1 ? `0${digits}/` : digits;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`.replace(/\/$/, '');
}

const soloLetrasYEspacios = /^[\p{L}\s]+$/u;

function noEstaVencida(value: string): boolean {
  const [mesTexto, anioTexto] = value.split('/');
  const mes = Number(mesTexto);
  const anio = Number(anioTexto);

  if (!mes || !anioTexto) return false;

  const ahora = new Date();
  const anioActual = ahora.getFullYear() % 100;
  const mesActual = ahora.getMonth() + 1;

  return anio > anioActual || (anio === anioActual && mes >= mesActual);
}

export const esquemaPago = z
  .object({
    titular: z
      .string()
      .trim()
      .min(1, 'Ingresá el nombre del titular')
      .regex(soloLetrasYEspacios, 'El titular solo puede contener letras y espacios'),
    numero: z
      .string()
      .trim()
      .min(1, 'Ingresá el número de tarjeta')
      .refine((value) => {
        const digits = value.replace(/\D/g, '');
        return /^\d{13,19}$/.test(digits);
      }, 'El número debe tener entre 13 y 19 dígitos'),
    vencimiento: z
      .string()
      .trim()
      .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Usá el formato MM/AA')
      .refine(noEstaVencida, 'La tarjeta está vencida'),
    cvv: z
      .string()
      .trim()
      .regex(/^\d{3,4}$/, 'El CVV debe tener 3 o 4 dígitos'),
  })
  .superRefine((data, ctx) => {
    const digits = data.numero.replace(/\D/g, '');
    const expectedLength = digits.startsWith('34') || digits.startsWith('37') ? 4 : 3;

    if (!new RegExp(`^\\d{${expectedLength}}$`).test(data.cvv)) {
      ctx.addIssue({
        code: 'custom',
        path: ['cvv'],
        message: `El CVV debe tener ${expectedLength} dígitos para esta tarjeta`,
      });
    }
  });

export type DatosPago = z.infer<typeof esquemaPago>;