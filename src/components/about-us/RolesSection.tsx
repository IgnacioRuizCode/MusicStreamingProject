import { roles } from '../../data/equipo';

export function RolesSection() {
  return (
    <section className="about-section" aria-labelledby="roles-title" data-reveal>
      <h2 id="roles-title">Qué hace cada rol</h2>
      <dl className="roles-list">
        {roles.map((rol) => (
          <div className="roles-list__item" key={rol.rol}>
            <dt>{rol.etiqueta}</dt>
            <dd>{rol.descripcion}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
