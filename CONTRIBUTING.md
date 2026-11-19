:root {
  /* ====================
     🎨 COLORES DE MARCA
     ==================== */
  --primary-color: #120A8F;         /* Azul base para botones Play, checks, toggles */
  --primary-hover: #1e14b8;         /* Azul más claro para cuando pasas el mouse */
  --primary-active: #0a065c;        /* Azul más oscuro para cuando haces click */

  /* ====================
     🌑 FONDOS (DARK THEME)
     ==================== */
  --bg-base: #121212;               /* Fondo principal de la aplicación (el más oscuro) */
  --bg-surface: #181818;            /* Fondo de la barra lateral (Sidebar) y cards base */
  --bg-elevated: #282828;           /* Fondo de las cards cuando pasas el mouse (Hover) */
  --bg-elevated-hover: #3E3E3E;     /* Fondo de elementos seleccionados o modales */
  --bg-player: #000000;             /* Fondo del reproductor inferior y del Navbar al hacer scroll */

  /* ====================
     ✍️ TEXTOS E ICONOS
     ==================== */
  --text-primary: #FFFFFF;          /* Títulos principales, nombres de canciones (Resaltado) */
  --text-secondary: #A7A7A7;        /* Nombres de artistas, subtítulos (Gris claro) */
  --text-secondary-hover: #FFFFFF;  /* El gris debe volverse blanco al pasar el mouse */
  --text-muted: #727272;            /* Textos menos importantes o fechas */
  
  /* ====================
     🔤 TIPOGRAFÍA
     ==================== */
  --font-family: 'Inter', 'Circular Std', Helvetica, Arial, sans-serif;
  --font-size-sm: 0.875rem;         /* 14px - Letra chica, metadatos */
  --font-size-md: 1rem;             /* 16px - Texto normal (p) */
  --font-size-lg: 1.125rem;         /* 18px - Títulos de cards */
  --font-size-xl: 1.5rem;           /* 24px - Títulos de secciones */
  --font-size-xxl: 2rem;            /* 32px - Títulos principales de playlists */
  
  --font-weight-regular: 400;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* ====================
     📐 BORDES Y EFECTOS
     ==================== */
  --radius-sm: 4px;                 /* Para portadas de álbumes dentro de cards */
  --radius-md: 8px;                 /* Para las tarjetas (cards) completas */
  --radius-pill: 500px;             /* Para los botones de Play o botones de login */
  --transition-base: 0.3s ease;     /* Para que los hovers sean suaves */
}


📏 2. Estructura y Tamaños

Para que no quede cada parte de un tamaño distinto, estas son las medidas fijas que vamos a respetar al maquetar:

Reproductor inferior (Player):

Alto: 90px (Debe ir fijo abajo con position: fixed; bottom: 0;).

Barra lateral (Sidebar):

Ancho: 240px (Fija a la izquierda).

Barra superior (Navbar):

Alto: 64px.

Tarjetas de Playlist/Álbumes:

Ancho: Entre 180px y 200px.

Padding interno: 16px.

Importante: Las imágenes de las portadas deben ser siempre cuadradas (aspect-ratio: 1/1).

Botones principales (ej: Play):

Alto: 48px.

Forma: Píldora (border-radius: var(--radius-pill)).

💻 3. Convenciones de Código (Reglas de Escritura)

Variables y Funciones: Todo en camelCase (ejemplo: playSong, getUserData).

Componentes de React: Todo en PascalCase (ejemplo: SidebarMenu, SongCard).

Idioma: Las variables, componentes, nombres de clases y funciones deben estar en inglés.

🚀 4. Flujo de Trabajo (Git y GitHub) - IMPORTANTE

Nadie debe hacer commits directamente a la rama main. Cada uno crea una rama para su tarea y luego hace un Pull Request.

Regla de Oro:

Todas las ramas y los mensajes de commit DEBEN ESTAR EN INGLÉS.

¿Cómo nombrar tu rama (Branch)?

Formato: `<tipo>/<ID-del-ticket>-<descripcion-corta>`

| Tipo | Cuándo |
|---|---|
| `feature/` | Funcionalidad nueva |
| `fix/` | Corrección de un bug |
| `chore/` | Mantenimiento, configuración, dependencias, limpieza |

Ejemplos:

```
feature/RC-12-hero-section
fix/RC-31-checkout-button-overflow
chore/RC-40-remove-vite-boilerplate
```

¿Cómo hacer los Commits?

- **En inglés.**
- Siguen [Conventional Commits](https://www.conventionalcommits.org/): `<type>(<scope opcional>): <description>`
- Tipos: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `build`, `ci`.
- Descripción en imperativo, minúscula y sin punto final.
- Commits chicos y con un solo propósito.

Ejemplos:

```
feat(hero): add main headline and call to action
fix(checkout): prevent price from overflowing on mobile
chore: remove unused vite assets
docs: add design style guide
```

## Mantener la rama actualizada: solo REBASE

Para traer los cambios nuevos de `main` a tu rama se usa **rebase**. Nada de merge.

```bash
git pull --rebase origin main
```

- Nunca hagas `git merge main` ni `git pull` sin `--rebase`.
- Si hay conflictos, se resuelven durante el rebase (`git rebase --continue`).

## 🗄️ LocalStorage Service & Seed Data

All `localStorage` access **must** go through `src/services/storageService.ts`. Direct calls to `localStorage` inside components are forbidden.

### Storage Keys (`streaming:` prefix)
- `streaming:users`
- `streaming:artists`
- `streaming:songs`
- `streaming:playlists`
- `streaming:plans`
- `streaming:session` (never stores passwords)

### Test Credentials (Seed)
- **Admin:** `admin@streaming.com` / `Admin123!`
- **User:** `demo@streaming.com` / `User123!`

### Dev Reset
To wipe `localStorage` and reload the initial seed, call `resetData()` from `src/services/storageService.ts`.