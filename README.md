<p align="center">
  <img src="./public/logo/logo.png" alt="CODIFY" width="320">
</p>

<p align="center">
  Plataforma web de streaming de música inspirada en Spotify.<br>
  Proyecto grupal de <b>Rolling Code School</b> · Full Stack Web Development.
</p>

---

## Sobre el proyecto

**CODIFY** es una aplicación web de streaming de música donde los usuarios pueden explorar artistas y playlists, buscar canciones, reproducirlas y suscribirse a un plan. También cuenta con un panel de administración para gestionar el contenido.

> **Proyecto educativo:** no tiene backend. Los datos se guardan en `localStorage`, y la sesión y los pagos son **simulados**. No usar datos reales de tarjetas.

**Deploy:** _próximamente_

## Capturas

| Escritorio | Mobile |
| --- | --- |
| ![Home escritorio](./docs/home-escritorio.png) | ![Home mobile](./docs/home-mobile.png) |

## Funcionalidades

- Registro e inicio de sesión con validaciones.
- Home con playlists y artistas, páginas de playlist y de artista.
- Reproductor persistente en todas las páginas.
- Búsqueda de canciones, artistas y playlists.
- Planes de suscripción y formulario de pago con tarjeta interactiva.
- Perfil de usuario: datos, plan y biblioteca.
- Panel de administración (CRUD de artistas, canciones, playlists, planes y usuarios).
- Rutas protegidas según rol (invitado, usuario y administrador).
- Diseño responsive (escritorio y mobile).

## Tecnologías

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/)
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- `localStorage` como base de datos simulada
- ESLint + Prettier

## Instalación

Requisitos: [Node.js](https://nodejs.org/) (versión LTS) y Git.

```bash
# 1. Clonar el repositorio
git clone https://github.com/<usuario-o-organizacion>/MusicStreamingProject.git

# 2. Entrar a la carpeta
cd MusicStreamingProject

# 3. Instalar dependencias
npm install

# 4. Levantar el servidor de desarrollo
npm run dev
```

La app queda disponible en `http://localhost:5173`.

### Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Vista previa del build |
| `npm run lint` | Revisión con ESLint |

## Usuario de prueba

Para probar el panel de administración:

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Administrador | `admin@codify.com` | `Admin1234` |

Los usuarios comunes se crean desde la pantalla de registro. Los datos iniciales se cargan automáticamente la primera vez que se abre la app.

## Estructura del proyecto

```
src/
├── assets/        # Imágenes y recursos
├── components/   # Componentes reutilizables (cards, formularios, etc.)
├── context/     # AuthContext, PlayerContext
├── schemas/      # Esquemas de validación (Zod)
├── hooks/         # Hooks personalizados
├── layouts/       # Layout principal, de autenticación y de admin
├── pages/       # Páginas de la aplicación
├── seed/          # Datos iniciales de ejemplo
├── services/     # Acceso a localStorage y funciones de datos
├── types/         # Tipos de TypeScript
└── utils/         # Funciones auxiliares
```

## Guía de diseño

Tema oscuro, con fuente **Inter** y color de marca `#120A8F`. Las variables CSS (colores, tipografía, bordes y transiciones) están definidas en `src/estilos`.

## Flujo de trabajo con Git

- **Ramas:**
  - `main`: versión estable, protegida. Solo recibe cambios desde `develop`.
  - `develop`: integración del trabajo del equipo.
  - `feature/<nombre-del-ticket>` y `fix/<descripcion>`: una rama por ticket, creada desde `develop`.
- **Commits:** mensajes cortos y claros, con prefijo: `feat:`, `fix:`, `style:`, `docs:`, `refactor:`.
- **Pull Requests:** cada ticket entra a `develop` por Pull Request, con la revisión de al menos un compañero.
- Nunca subir archivos `.env` ni claves al repositorio.

## Equipo

| Integrante | Rol | GitHub |
| --- | --- | --- |
| Ruiz, Ignacio | Tech Leader |
| Russo, Emilse | Scrum Master |
| Saravia, Juan Manuel | Desarrollador |
| Nieva Corvalan, Samihel | Desarrollador |

## Aclaración

CODIFY es un proyecto con fines educativos y no tiene relación con Spotify. Las imágenes y los audios de ejemplo son de prueba.