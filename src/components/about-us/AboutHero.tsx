import { FaMusic } from 'react-icons/fa';

export function AboutHero() {
  return (
    <section className="about-hero" aria-labelledby="about-hero-title" data-reveal>
      <div className="about-hero__logo">
        <FaMusic aria-hidden="true" />
        <span>CODIFY</span>
      </div>
      <h1 id="about-hero-title">El equipo detrás de CODIFY</h1>
      <p>Una plataforma de streaming de música hecha por estudiantes de Rolling Code School</p>
    </section>
  );
}
