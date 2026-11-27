import { tecnologias } from '../../data/equipo';

export function TechStack() {
  return (
    <section className="about-section" aria-labelledby="tech-title" data-reveal>
      <h2 id="tech-title">Tecnologías que usamos</h2>
      <ul className="tech-list">
        {tecnologias.map(({ nombre, icono: Icono }) => (
          <li className="tech-badge" key={nombre}>
            <Icono aria-hidden="true" />
            <span>{nombre}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
