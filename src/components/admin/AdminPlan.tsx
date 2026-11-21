import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AdminTab, type ColumnaTabla } from '../../components/admin/AdminTab';
import { Paginacion } from '../../components/admin/Paginacion';
import { ConfirmationModal } from '../../components/admin/ConfirmationModal';
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
import './AdminPlanes.css';

const FILAS_POR_PAGINA = 10;

export function AdminPlanes() {
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
    return planes.filter((p) => p.name.toLowerCase().includes(q));
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
      setModalFormAbierto(false);
      setPlanEditando(null);
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

  const columnas: ColumnaTabla<Plan>[] = [
    { key: 'name', header: 'Nombre', render: (p) => p.name },
    {
      key: 'price',
      header: 'Precio',
      render: (p) => (p.price === 0 ? 'Gratis' : `$${p.price.toLocaleString('es-AR')}`),
    },
    {
      key: 'benefits',
      header: 'Beneficios',
      render: (p) => `${p.benefits.length} beneficio(s)`,
    },
    {
      key: 'featured',
      header: 'Destacado',
      render: (p) => (p.featured ? 'Sí' : 'No'),
    },
    {
      key: 'subscribers',
      header: 'Suscriptores',
      render: (p) => countUsersByPlan(p.id),
    },
  ];

  return (
    <section>
      <div className="admin-planes__header">
        <h1 className="admin-planes__titulo">Planes</h1>
        <div className="admin-planes__controles">
          <input
            type="search"
            placeholder="Buscar plan..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPagina(1);
            }}
          />
          <button type="button" onClick={abrirCrear}>
            + Nuevo plan
          </button>
        </div>
      </div>

      <AdminTab
        columnas={columnas}
        datos={paginados}
        mensajeVacio={
          busqueda ? 'No se encontraron planes con esa búsqueda.' : 'Todavía no hay planes cargados.'
        }
        accionVacio={
          !busqueda && (
            <button type="button" onClick={abrirCrear}>
              Crear primer plan
            </button>
          )
        }
        renderAcciones={(plan) => (
          <div className="admin-planes__acciones-fila">
            <button type="button" onClick={() => abrirEditar(plan)}>
              Editar
            </button>
            <button type="button" onClick={() => setPlanAEliminar(plan)}>
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
        <div role="dialog" aria-modal="true" className="admin-planes__modal-overlay">
          <div className="admin-planes__modal-contenido">
            <h2 className="admin-planes__modal-titulo">
              {planEditando ? 'Editar plan' : 'Nuevo plan'}
            </h2>
            <PlanForm
              valoresIniciales={planEditando}
              onGuardar={handleGuardar}
              onCancelar={() => {
                setModalFormAbierto(false);
                setPlanEditando(null);
              }}
            />
          </div>
        </div>
      )}

      <ConfirmationModal
        abierto={Boolean(planAEliminar)}
        titulo="Eliminar plan"
        mensaje={`¿Seguro que querés eliminar el plan "${planAEliminar?.name}"?`}
        onConfirmar={handleConfirmarEliminar}
        onCancelar={() => setPlanAEliminar(null)}
      />
    </section>
  );
}