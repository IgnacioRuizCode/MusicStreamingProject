import { useEffect } from 'react';
import { FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { equipo, REPOSITORIO_URL, roles } from '../../data/equipo';
import { AboutHero } from './AboutHero';
import { RolesSection } from './RolesSection';
import { TeamMemberCard } from './TeamMemberCard';
import { TechStack } from './TechStack';
import { useRevealOnScroll } from './useRevealOnScroll';
import { WorkflowSteps } from './WorkflowSteps';
import './AboutPage.css';

export function AboutPage() {
  const contenedorRef = useRevealOnScroll<HTMLDivElement>();

  useEffect(() => {
    document.title = 'CODIFY · Nosotros';

    return () => {
      document.title = 'CODIFY';
    };
  }, []);

  return (
    <div className="about-page" ref={contenedorRef}>
      <AboutHero />

      <section className="about-section" aria-labelledby="proyecto-title" data-reveal>
        <h2 id="proyecto-title">Sobre el proyecto</h2>
        <p>
          CODIFY nace como un proyecto de estudiantes de Rolling Code School para acercar la música
          a través de una plataforma propia, construida en equipo y pensada para cualquier dispositivo.
        </p>
        <p>
          Incluye un reproductor, playlists, planes de acceso y un panel de administración para
          gestionar el catálogo y a los usuarios.
        </p>
      </section>

      <section className="about-section" aria-labelledby="equipo-title">
        <h2 id="equipo-title">El equipo</h2>
        <div className="team-grid">
          {equipo.map((integrante) => (
            <TeamMemberCard
              key={integrante.id}
              integrante={integrante}
              etiquetaRol={roles.find((rol) => rol.rol === integrante.rol)?.etiqueta ?? ''}
            />
          ))}
        </div>
      </section>

      <RolesSection />
      <TechStack />
      <WorkflowSteps />

      <section className="about-closing" aria-labelledby="cierre-title" data-reveal>
        <h2 id="cierre-title">Sumate a escuchar</h2>
        <p>Descubrí todo lo que CODIFY tiene para vos.</p>
        <div className="about-closing__actions">
          <Link className="about-button" to="/">Explorar CODIFY</Link>
          <a
            className="about-link"
            href={REPOSITORIO_URL}
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub aria-hidden="true" />
            Ver repositorio
          </a>
        </div>
      </section>
    </div>
  );
}
