import type { ReactNode } from 'react';
import './AdminTab.css';

export interface ColumnaTabla<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
}

interface TablaAdminProps<T extends { id: string }> {
  columnas: ColumnaTabla<T>[];
  datos: T[];
  renderAcciones?: (item: T) => ReactNode;
  mensajeVacio?: string;
  accionVacio?: ReactNode;
}

export function AdminTab<T extends { id: string }>({
  columnas,
  datos,
  renderAcciones,
  mensajeVacio = 'No hay registros para mostrar.',
  accionVacio,
}: TablaAdminProps<T>) {
  if (datos.length === 0) {
    return (
      <div className="tabla-vacia">
        <p>{mensajeVacio}</p>
        {accionVacio}
      </div>
    );
  }

  return (
    <div className="tabla-wrapper">
      <table className="tabla-admin">
        <thead>
          <tr>
            {columnas.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
            {renderAcciones && <th className="col-acciones">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {datos.map((item) => (
            <tr key={item.id}>
              {columnas.map((col) => (
                <td key={col.key}>{col.render(item)}</td>
              ))}
              {renderAcciones && (
                <td className="col-acciones">{renderAcciones(item)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}