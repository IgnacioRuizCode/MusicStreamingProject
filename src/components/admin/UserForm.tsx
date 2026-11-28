import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  adminUserSchema,
  type AdminUserFormData,
} from '../../schemas/adminUserSchema';
import type { Plan, User } from '../../types/types';
import { ImagePreview } from './ImagePreview';

interface UserFormProps {
  usuario: User;
  planes: Plan[];
  esAdminActual: boolean;
  onGuardar: (data: AdminUserFormData) => void;
  onCancelar: () => void;
}

export function UserForm({
  usuario,
  planes,
  esAdminActual,
  onGuardar,
  onCancelar,
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AdminUserFormData>({
    resolver: zodResolver(adminUserSchema),
    defaultValues: {
      username: usuario.username,
      avatar: usuario.avatar ?? '',
      role: usuario.role,
      planId: usuario.planId ?? '',
    },
  });

  const nombre = useWatch({ control, name: 'username' });
  const avatar = useWatch({ control, name: 'avatar' });

  useEffect(() => {
    reset({
      username: usuario.username,
      avatar: usuario.avatar ?? '',
      role: usuario.role,
      planId: usuario.planId ?? '',
    });
  }, [usuario, reset]);

  return (
    <form onSubmit={handleSubmit(onGuardar)} className="admin-form">
      <div className="admin-form__preview">
        <ImagePreview src={avatar} alt={nombre || usuario.email} redonda grande />
        <div className="admin-form__preview-text">
          <strong>{nombre || usuario.username}</strong>
          <span>{usuario.email}</span>
        </div>
      </div>

      <div className="admin-form__grid">
        <div className="admin-form__field">
          <label className="admin-form__label" htmlFor="usuario-nombre">
            Nombre de usuario
          </label>
          <input
            id="usuario-nombre"
            type="text"
            className="admin-input"
            {...register('username')}
          />
          {errors.username && (
            <span className="admin-form__error">{errors.username.message}</span>
          )}
        </div>

        <div className="admin-form__field">
          <label className="admin-form__label" htmlFor="usuario-email">
            Correo electrónico
          </label>
          <input
            id="usuario-email"
            type="email"
            className="admin-input"
            value={usuario.email}
            disabled
          />
          <span className="admin-form__hint">El correo no se edita desde el panel.</span>
        </div>

        <div className="admin-form__field">
          <label className="admin-form__label" htmlFor="usuario-rol">
            Rol
          </label>
          <select
            id="usuario-rol"
            className="admin-select admin-input"
            {...register('role')}
          >
            <option value="user" disabled={esAdminActual}>
              Usuario
            </option>
            <option value="admin">Administrador</option>
          </select>
          {esAdminActual && (
            <span className="admin-form__hint">
              No podés quitarte tu propio rol de administrador.
            </span>
          )}
        </div>

        <div className="admin-form__field">
          <label className="admin-form__label" htmlFor="usuario-plan">
            Plan
          </label>
          <select
            id="usuario-plan"
            className="admin-select admin-input"
            {...register('planId')}
          >
            <option value="">Sin plan</option>
            {planes.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-form__field admin-form__field--full">
          <label className="admin-form__label" htmlFor="usuario-avatar">
            Avatar
          </label>
          <input
            id="usuario-avatar"
            type="text"
            className="admin-input"
            placeholder="https://... (opcional)"
            {...register('avatar')}
          />
          {errors.avatar && (
            <span className="admin-form__error">{errors.avatar.message}</span>
          )}
        </div>
      </div>

      <div className="admin-form__actions">
        <button type="button" className="btn btn--secondary" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
          Guardar cambios
        </button>
      </div>
    </form>
  );
}
