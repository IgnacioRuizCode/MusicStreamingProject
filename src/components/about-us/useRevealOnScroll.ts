import { useEffect, useRef } from 'react';

export function useRevealOnScroll<T extends HTMLElement>() {
  const referencia = useRef<T>(null);

  useEffect(() => {
    const contenedor = referencia.current;

    if (!contenedor) {
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const objetivo = Array.from(contenedor.querySelectorAll<HTMLElement>('[data-reveal]'));

    if (reduceMotion.matches) {
      objetivo.forEach((elemento) => elemento.classList.add('is-visible'));
      return;
    }

    contenedor.classList.add('is-reveal-ready');

    const mostrarTodo = () => {
      contenedor.classList.remove('is-reveal-ready');
      objetivo.forEach((elemento) => elemento.classList.add('is-visible'));
    };

    if (!('IntersectionObserver' in window)) {
      mostrarTodo();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    objetivo.forEach((elemento) => observer.observe(elemento));
    reduceMotion.addEventListener('change', mostrarTodo);

    return () => {
      observer.disconnect();
      reduceMotion.removeEventListener('change', mostrarTodo);
    };
  }, []);

  return referencia;
}
