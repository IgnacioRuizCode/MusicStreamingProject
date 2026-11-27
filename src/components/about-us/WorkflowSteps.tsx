const pasos = [
  {
    titulo: 'Tablero de Trello',
    descripcion: 'Cada ticket se organiza y prioriza antes de empezar a trabajar.',
  },
  {
    titulo: 'Una rama por ticket',
    descripcion: 'Trabajamos en ramas cortas y enfocadas en una sola tarea.',
  },
  {
    titulo: 'Pull Request revisado',
    descripcion: 'Cada cambio recibe una revisión antes de integrarse al proyecto.',
  },
  {
    titulo: 'Build verificado con GitHub Actions',
    descripcion: 'La integración continua valida que el build siga funcionando.',
  },
];

export function WorkflowSteps() {
  return (
    <section className="about-section" aria-labelledby="workflow-title" data-reveal>
      <h2 id="workflow-title">Cómo trabajamos</h2>
      <ol className="workflow-list">
        {pasos.map((paso) => (
          <li className="workflow-step" key={paso.titulo}>
            <h3>{paso.titulo}</h3>
            <p>{paso.descripcion}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
