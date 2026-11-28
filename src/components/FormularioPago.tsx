import { useId, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Cards, { type Focused } from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { CampoFormulario } from './CampoFormulario';
import {
  detectarMarca,
  esquemaPago,
  formatearNumeroTarjeta,
  formatearVencimiento,
  type DatosPago,
} from '../schemas/esquemaPago';
import type { Plan, ResumenPago } from '../types/payment';
import './FormularioPago.css';

interface FormularioPagoProps {
  plan: Plan;
  onSuccess: (resumen: ResumenPago) => void;
}

const TITULAR_PLACEHOLDER = 'NOMBRE APELLIDO';

export function FormularioPago({ plan, onSuccess }: FormularioPagoProps) {
  const formId = useId();
  const titleId = `${formId}-title`;
  const [focused, setFocused] = useState<Focused>('');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<DatosPago>({
    resolver: zodResolver(esquemaPago),
    mode: 'onBlur',
    defaultValues: {
      titular: '',
      numero: '',
      vencimiento: '',
      cvv: '',
    },
  });

  const titular = useWatch({ control, name: 'titular' }) ?? '';
  const numero = useWatch({ control, name: 'numero' }) ?? '';
  const vencimiento = useWatch({ control, name: 'vencimiento' }) ?? '';
  const cvv = useWatch({ control, name: 'cvv' }) ?? '';

  const cvvLength = detectarMarca(numero) === 'Amex' ? 4 : 3;

  const titularField = register('titular');
  const numeroField = register('numero');
  const vencimientoField = register('vencimiento');
  const cvvField = register('cvv');

  const onSubmit = async (data: DatosPago) => {
    setPaymentError(null);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const digits = data.numero.replace(/\D/g, '');

    if (digits.endsWith('0000')) {
      setPaymentError(
        'No pudimos procesar el pago. Verificá los datos e intentá nuevamente.',
      );
      return;
    }

    onSuccess({
      planId: plan.id,
      ultimos4: digits.slice(-4),
      marca: detectarMarca(digits),
    });
  };

  return (
    <section className="pago-layout" aria-labelledby={titleId}>
      <div className="pago-card-wrap">
        <Cards
          number={numero}
          name={titular}
          expiry={vencimiento}
          cvc={cvv}
          focused={focused}
          placeholders={{ name: TITULAR_PLACEHOLDER }}
          locale={{ valid: 'válido hasta' }}
        />
      </div>

      <form className="pago-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="pago-form__header">
          <div>
            <h2 id={titleId} className="pago-form__title">
              Datos de pago
            </h2>
            <p className="pago-form__plan">
              Plan <strong>{plan.nombre}</strong>
            </p>
          </div>
          <strong className="pago-form__price">${plan.precio.toFixed(2)}</strong>
        </div>

        <CampoFormulario
          id={`${formId}-titular`}
          etiqueta="Titular"
          placeholder="Nombre y apellido"
          autoComplete="cc-name"
          minLength={3}
          maxLength={20}
          error={errors.titular?.message}
          {...titularField}
          onFocus={() => setFocused('name')}
          onBlur={(event) => {
            setFocused('');
            titularField.onBlur(event);
          }}
        />

        <CampoFormulario
          id={`${formId}-numero`}
          etiqueta="Número de tarjeta"
          placeholder="1234 5678 9012 3456"
          inputMode="numeric"
          autoComplete="cc-number"
          maxLength={23}
          error={errors.numero?.message}
          {...numeroField}
          onFocus={() => setFocused('number')}
          onBlur={(event) => {
            setFocused('');
            numeroField.onBlur(event);
          }}
          onChange={(event) => {
            const formatted = formatearNumeroTarjeta(event.target.value);
            setValue('numero', formatted, {
              shouldDirty: true,
              shouldValidate: false,
            });
          }}
        />

        <div className="pago-form__row">
          <CampoFormulario
            id={`${formId}-vencimiento`}
            etiqueta="Vencimiento"
            placeholder="MM/AA"
            inputMode="numeric"
            autoComplete="cc-exp"
            maxLength={5}
            error={errors.vencimiento?.message}
            {...vencimientoField}
            onFocus={() => setFocused('expiry')}
            onBlur={(event) => {
              setFocused('');
              vencimientoField.onBlur(event);
            }}
            onChange={(event) => {
              const formatted = formatearVencimiento(event.target.value);
              setValue('vencimiento', formatted, {
                shouldDirty: true,
                shouldValidate: false,
              });
            }}
          />

          <CampoFormulario
            id={`${formId}-cvv`}
            etiqueta="CVV"
            placeholder={'•'.repeat(cvvLength)}
            inputMode="numeric"
            autoComplete="cc-csc"
            maxLength={4}
            error={errors.cvv?.message}
            {...cvvField}
            onFocus={() => setFocused('cvc')}
            onBlur={(event) => {
              setFocused('');
              cvvField.onBlur(event);
            }}
            onChange={(event) => {
              const value = event.target.value.replace(/\D/g, '').slice(0, 4);
              setValue('cvv', value, {
                shouldDirty: true,
                shouldValidate: false,
              });
            }}
          />
        </div>

        {paymentError && (
          <p className="pago-form__error" role="alert">
            {paymentError}
          </p>
        )}

        <button
          type="submit"
          className="pago-form__submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Procesando...' : `Pagar $${plan.precio.toFixed(2)}`}
        </button>
      </form>
    </section>
  );
}
