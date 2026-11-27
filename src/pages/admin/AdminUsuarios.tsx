import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AdminTab, type ColumnaTabla } from '../../components/admin/AdminTab';
import { Paginacion } from '../../components/admin/Paginacion';
import { ConfirmationModal } from '../../components/admin/ConfirmationModal';
import { AdminModal } from '../../components/admin/AdminModal';
import { AdminSearch } from '../../components/admin/AdminSearch';
import { ImagePreview } from '../../components/admin/ImagePreview';
import { UserForm } from '../../components/admin/UserForm';
import { useAuth } from '../../hooks/useAuth';
import { useDebounce } from '../../hooks/useDebounce';
import type { AdminUserFormData } from '../../schemas/adminUserSchema';
import type { Plan, User } from '../../types/types';
import {
  getAll,
  update,
  updateUserAdmin,
  deleteUserSafe,
} from '../../services/storageServices';

const FILAS_POR_PAGINA = 10;

function formatearFecha(fecha?: string): string {
  if (!fecha) return 'Sin fecha';
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';
  return date.toLocaleDateString('es-AR');
}

export function AdminUsuarios() {
  const { user: adminActual } = useAuth();
  const [usuarios, setUsuarios] = useState<User[]>(() => getAll('users'));
  const [planes, setPlanes] = useState<Plan[]>(() => getAll('plans'));
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('');
  const [filtroPlan, setFiltroPlan] = useState('');
  const [pagina, setPagina] = useState(1);
  const [usuarioEditando, setUsuarioEditando] = useState<User | null>(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<User | null>(null);

  const busquedaDebounced = useDebounce(busqueda, 300);

  const planesPorId = useMemo(
    () => new Map(planes.map((plan) => [plan.id, plan])),
    [planes]
  );

  const filtrados = useMemo(() => {
    const q = busquedaDebounced.trim().toLowerCase();
    return usuarios.filter((usuario) => {
      if (filtroRol && usuario.role !== filtroRol) return false;
      if (filtroPlan === 'sin-plan' && usuario.planId) return false;
      if (filtroPlan && filtroPlan !== 'sin-plan' && usuario.planId !== filtroPlan) {
        return false;
      }
      if (!q) return true;
      return (
        usuario.username.toLowerCase().includes(q) ||
        usuario.email.toLowerCase().includes(q)
      );
    });
  }, [usuarios, busquedaDebounced, filtroRol, filtroPlan]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / FILAS_POR_PAGINA));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const paginados = filtrados.slice(
    (paginaSegura - 1) * FILAS_POR_PAGINA,
    paginaSegura * FILAS_POR_PAGINA
  );

  const refrescar = () => {
    setUsuarios(getAll('users'));
    setPlanes(getAll('plans'));
  };

  const cerrarFormulario = () => setUsuarioEditando(null);

  const handleGuardar = (data: AdminUserFormData) => {
    if (!usuarioEditando || !adminActual) return;

    try {
      const username = data.username.trim();
      const duplicado = usuarios.some(
        (usuario) =>
          usuario.id !== usuarioEditando.id &&
          usuario.username.toLowerCase() === username.toLowerCase()
      );
      if (duplicado) throw new Error('Ese nombre de usuario ya está en uso.');

      updateUserAdmin(usuarioEditando.id, adminActual.id, {
        role: data.role,
        planId: data.planId || null,
      });
      update('users', usuarioEditando.id, {
        username,
        avatar: data.avatar.trim(),
      });

      refrescar();
      cerrarFormulario();
      toast.success('Usuario actualizado correctamente');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al actualizar el usuario');
    }
  };

  const handleConfirmarEliminar = () => {
    if (!usuarioAEliminar || !adminActual) return;
    try {
      deleteUserSafe(usuarioAEliminar.id, adminActual.id);
      refrescar();
      toast.success('Usuario eliminado correctamente');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar el usuario');
    } finally {
      setUsuarioAEliminar(null);
    }
  };

  const columnas: ColumnaTabla<User>[] = [
    {
      key: 'usuario',
      header: 'Usuario',
      render: (usuario) => (
        <span className="admin-user-cell">
          <ImagePreview
            src={usuario.avatar}
            alt={usuario.username}
            redonda
          />
          <span className="admin-user-cell__info">
            <strong>{usuario.username}</strong>
            <span>{usuario.email}</span>
          </span>
        </span>
      ),
    },
    {
      key: 'role',
      header: 'Rol',
      render: (usuario) => (
        <span
          className={
            usuario.role === 'admin'
              ? 'admin-badge admin-badge--admin'
              : 'admin-badge'
          }
        >
          {usuario.role === 'admin' ? 'Administrador' : 'Usuario'}
        </span>
      ),
    },
    {
      key: 'plan',
      header: 'Plan',
      render: (usuario) =>
        usuario.planId ? (
          <span className="admin-badge admin-badge--success">
            {planesPorId.get(usuario.planId)?.nombre ?? 'Plan eliminado'}
          </span>
        ) : (
          <span className="admin-badge">Sin plan</span>
        ),
    },
    {
      key: 'createdAt',
      header: 'Alta',
      render: (usuario) => formatearFecha(usuario.createdAt),
    },
  ];

  const totalAdmins = usuarios.filter((usuario) => usuario.role === 'admin').length;

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Usuarios</h1>
          <p className="admin-page__subtitle">
            Administrá roles, planes y datos de las cuentas registradas.
          </p>
        </div>
        <div className="admin-page__actions">
          <span className="admin-badge admin-badge--admin">
            {totalAdmins} administrador(es)
          </span>
        </div>
      </header>

      <div className="admin-toolbar">
        <div className="admin-toolbar__group">
          <AdminSearch
            value={busqueda}
            onChange={(value) => {
              setBusqueda(value);
              setPagina(1);
            }}
            placeholder="Buscar por usuario o correo..."
          />
          <select
            className="admin-select"
            value={filtroRol}
            aria-label="Filtrar por rol"
            onChange={(event) => {
              setFiltroRol(event.target.value);
              setPagina(1);
            }}
          >
            <option value="">Todos los roles</option>
            <option value="admin">Administradores</option>
            <option value="user">Usuarios</option>
          </select>
          <select
            className="admin-select"
            value={filtroPlan}
            aria-label="Filtrar por plan"
            onChange={(event) => {
              setFiltroPlan(event.target.value);
              setPagina(1);
            }}
          >
            <option value="">Todos los planes</option>
            <option value="sin-plan">Sin plan</option>
            {planes.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.nombre}
              </option>
            ))}
          </select>
        </div>
        <span className="admin-count">
          {filtrados.length} de {usuarios.length} usuarios
        </span>
      </div>

      <AdminTab
        columnas={columnas}
        datos={paginados}
        mensajeVacio={
          busqueda || filtroRol || filtroPlan
            ? 'No se encontraron usuarios con esos filtros.'
            : 'Todavía no hay usuarios registrados.'
        }
        renderAcciones={(usuario) => {
          const esUsuarioActual = usuario.id === adminActual?.id;
          return (
            <div className="admin-actions">
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={() => setUsuarioEditando(usuario)}
              >
                Editar
              </button>
              <button
                type="button"
                className="btn btn--danger btn--sm"
                disabled={esUsuarioActual}
                title={
                  esUsuarioActual
                    ? 'No podés eliminar tu propia cuenta'
                    : 'Eliminar usuario'
                }
                onClick={() => setUsuarioAEliminar(usuario)}
              >
                Eliminar
              </button>
            </div>
          );
        }}
      />

      <Paginacion
        paginaActual={paginaSegura}
        totalPaginas={totalPaginas}
        onCambiarPagina={setPagina}
      />

      {usuarioEditando && (
        <AdminModal
          titulo="Editar usuario"
          onCerrar={cerrarFormulario}
          tamano="md"
        >
          <UserForm
            usuario={usuarioEditando}
            planes={planes}
            esAdminActual={usuarioEditando.id === adminActual?.id}
            onGuardar={handleGuardar}
            onCancelar={cerrarFormulario}
          />
        </AdminModal>
      )}

      <ConfirmationModal
        abierto={Boolean(usuarioAEliminar)}
        titulo="Eliminar usuario"
        mensaje={`¿Seguro que querés eliminar la cuenta de "${usuarioAEliminar?.username}"? Esta acción no se puede deshacer.`}
        onConfirmar={handleConfirmarEliminar}
        onCancelar={() => setUsuarioAEliminar(null)}
      />
    </section>
  );
}
