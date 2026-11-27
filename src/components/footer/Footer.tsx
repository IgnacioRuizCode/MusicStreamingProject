import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import './Footer.css';

interface FooterLinkItem {
  label: string;
  to: string;
}

interface FooterColumn {
  title: string;
  links: FooterLinkItem[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Compañía',
    links: [
      { label: 'Acerca de', to: '/nosotros' },
      { label: 'Empleo', to: '/careers' },
      { label: 'Prensa', to: '/press' },
    ],
  },
  {
    title: 'Comunidades',
    links: [
      { label: 'Para artistas', to: '/artists' },
      { label: 'Desarrolladores', to: '/developers' },
      { label: 'Publicidad', to: '/advertising' },
    ],
  },
  {
    title: 'Enlaces útiles',
    links: [
      { label: 'Ayuda', to: '/ayuda' },
      { label: 'Planes', to: '/planes' },
      { label: 'Contacto', to: '/contact' },
    ],
  },
];

const LEGAL_LINKS: FooterLinkItem[] = [
  { label: 'Privacidad', to: '/legal/privacy' },
  { label: 'Cookies', to: '/legal/cookies' },
  { label: 'Términos', to: '/legal/terms' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" aria-label="Pie de página">
      <div className="footer__top">
        <div className="footer__columns">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="footer__column">
              <h3 className="footer__heading">{column.title}</h3>
              <ul className="footer__list">
                {column.links.map((item) => (
                  <li key={item.to} className="footer__item">
                    <Link to={item.to} className="footer__link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__social" aria-label="Redes sociales">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="footer__social-link"
            aria-label="Instagram"
          >
            <FaInstagram className="footer__social-icon" aria-hidden="true" />
          </a>

          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            className="footer__social-link"
            aria-label="Twitter / X"
          >
            <FaXTwitter className="footer__social-icon" aria-hidden="true" />
          </a>

          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="footer__social-link"
            aria-label="Facebook"
          >
            <FaFacebookF className="footer__social-icon" aria-hidden="true" />
          </a>
        </div>
      </div>

      <hr className="footer__divider" />

      <div className="footer__bottom">
        <nav className="footer__legal" aria-label="Enlaces legales">
          {LEGAL_LINKS.map((item) => (
            <Link key={item.to} to={item.to} className="footer__legal-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="footer__copyright">
          &copy; {currentYear} Codify. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}