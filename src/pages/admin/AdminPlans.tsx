import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AdminTab, type ColumnaTabla } from '../../components/admin/AdminTab';
import { Paginacion } from '../../components/admin/Paginacion';
import { ConfirmationModal } from '../../components/admin/ConfirmationModal';
import { AdminModal } from '../../components/admin/AdminModal';
import { AdminSearch } from '../../components/admin/AdminSearch';
import { PlanForm } from '../../components/admin/PlanForm';
import { useDebounce } from '../../hooks/useDebounce';
import type { Plan } from '../../types/types';
import {
  getAll,
  add,
  update,
  deletePlanSafe,
  countUsersByPlan,
} from '../../services/storageServices';

const FILAS_POR_PAGINA = 10;

export function AdminPlans() {
  const [planes, setPlanes] = useState<Plan[]>(() => getAll('plans'));
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const [modalFormAbierto, setModalFormAbierto] = useState(false);
  const [planEditando, setPlanEditando] = useState<Plan | null>(null);
  const [planAEliminar, setPlanAEliminar] = useState<Plan | null>(null);

  const busquedaDebounced = useDebounce(busqueda, 300);

  const filtrados = useMemo(() => {
    const q = busquedaDebounced.trim().toLowerCase();
    if (!q) return planes;
    return planes.filter((plan) => plan.nombre.toLowerCase().includes(q));
  }, [planes, busquedaDebounced]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / FILAS_POR_PAGINA));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const paginados = filtrados.slice(
    (paginaSegura - 1) * FILAS_POR_PAGINA,
    paginaSegura * FILAS_POR_PAGINA
  );

  const refrescar = () => setPlanes(getAll('plans'));

  const abrirCrear = () => {
    setPlanEditando(null);
    setModalFormAbierto(true);
  };

  const abrirEditar = (plan: Plan) => {
    setPlanEditando(plan);
    setModalFormAbierto(true);
  };

  const cerrarFormulario = () => {
    setModalFormAbierto(false);
    setPlanEditando(null);
  };

  const handleGuardar = (data: Omit<Plan, 'id'>) => {
    try {
      if (planEditando) {
        update('plans', planEditando.id, data);
        toast.success('Plan actualizado correctamente');
      } else {
        add('plans', data);
        toast.success('Plan creado correctamente');
      }
      refrescar();
      cerrarFormulario();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar el plan');
    }
  };

  const handleConfirmarEliminar = () => {
    if (!planAEliminar) return;
    try {
      deletePlanSafe(planAEliminar.id);
      refrescar();
      toast.success('Plan eliminado correctamente');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar el plan');
    } finally {
      setPlanAEliminar(null);
    }
  };

  const suscriptoresEliminar = planAEliminar
    ? countUsersByPlan(planAEliminar.id)
    : 0;

  const columnas: ColumnaTabla<Plan>[] = [
    {
      key: 'nombre',
      header: 'Nombre',
      render: (plan) => (
        <span className="admin-song-cell">
          <span className="admin-song-cell__info">
            <strong>{plan.nombre}</strong>
            <span>{plan.destacado ? 'Plan destacado' : 'Plan estándar'}</span>
          </span>
        </span>
      ),
    },
    {
      key: 'precio',
      header: 'Precio',
      render: (plan) =>
        plan.precio === 0 ? 'Gratis' : `$${plan.precio.toLocaleString('es-AR')}`,
    },
    {
      key: 'beneficios',
      header: 'Beneficios',
      render: (plan) => `${plan.beneficios.length} beneficio(s)`,
    },
    {
      key: 'destacado',
      header: 'Destacado',
      render: (plan) => (
        <span
          className={
            plan.destacado ? 'admin-badge admin-badge--warning' : 'admin-badge'
          }
        >
          {plan.destacado ? 'Sí' : 'No'}
        </span>
      ),
    },
    {
      key: 'subscribers',
      header: 'Suscriptores',
      render: (plan) => (
        <span className="admin-badge">{countUsersByPlan(plan.id)}</span>
      ),
    },
  ];

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Planes</h1>
          <p className="admin-page__subtitle">
            Definí precios, beneficios y planes destacados de la plataforma.
          </p>
        </div>
        <div className="admin-page__actions">
          <button type="button" className="btn btn--primary" onClick={abrirCrear}>
            + Nuevo plan
          </button>
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
            placeholder="Buscar plan..."
          />
        </div>
        <span className="admin-count">
          {filtrados.length} de {planes.length} planes
        </span>
      </div>

      <AdminTab
        columnas={columnas}
        datos={paginados}
        mensajeVacio={
          busqueda
            ? 'No se encontraron planes con esa búsqueda.'
            : 'Todavía no hay planes cargados.'
        }
        accionVacio={
          !busqueda && (
            <button type="button" className="btn btn--primary" onClick={abrirCrear}>
              Crear primer plan
            </button>
          )
        }
        renderAcciones={(plan) => (
          <div className="admin-actions">
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => abrirEditar(plan)}
            >
              Editar
            </button>
            <button
              type="button"
              className="btn btn--danger btn--sm"
              onClick={() => setPlanAEliminar(plan)}
            >
              Eliminar
            </button>
          </div>
        )}
      />

      <Paginacion
        paginaActual={paginaSegura}
        totalPaginas={totalPaginas}
        onCambiarPagina={setPagina}
      />

      {modalFormAbierto && (
        <AdminModal
          titulo={planEditando ? 'Editar plan' : 'Nuevo plan'}
          onCerrar={cerrarFormulario}
          tamano="md"
        >
          <PlanForm
            valoresIniciales={planEditando}
            onGuardar={handleGuardar}
            onCancelar={cerrarFormulario}
          />
        </AdminModal>
      )}

      <ConfirmationModal
        abierto={Boolean(planAEliminar)}
        titulo="Eliminar plan"
        mensaje={
          suscriptoresEliminar > 0
            ? `No podés eliminar "${planAEliminar?.nombre}" porque tiene ${suscriptoresEliminar} usuario(s) suscripto(s).`
            : `¿Seguro que querés eliminar el plan "${planAEliminar?.nombre}"? Esta acción no se puede deshacer.`
        }
        onConfirmar={handleConfirmarEliminar}
        onCancelar={() => setPlanAEliminar(null)}
      />
    </section>
  );
}
