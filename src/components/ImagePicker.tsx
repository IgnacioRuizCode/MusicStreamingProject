import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import {
  Link2,
  Music,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import './ImagePicker.css';

type ImagePickerVariant = 'avatar' | 'cover';
type ImagePickerTab = 'upload' | 'web';

interface ImagePickerProps {
  value: string;
  onChange: (value: string) => void;
  variant?: ImagePickerVariant;
  id?: string;
  fallbackText?: string;
}

const COVER_CATEGORIES = [
  { label: 'Rock', seed: 'rock' },
  { label: 'Pop', seed: 'pop' },
  { label: 'Electrónica', seed: 'electronic' },
  { label: 'Urbana', seed: 'urban' },
  { label: 'Fiesta', seed: 'party' },
];

const AVATAR_SEEDS = [
  'CodifyBeat',
  'MelodyWave',
  'BassDrop',
  'NightGroove',
  'SynthPulse',
  'NeonEcho',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function coverUrl(seed: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/400/400`;
}

function avatarUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(seed)}`;
}

function readImageFile(file: File, maxSize: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('No se pudo leer la imagen'));
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) {
        reject(new Error('No se pudo leer la imagen'));
        return;
      }

      const image = new Image();
      image.onerror = () => reject(new Error('No se pudo procesar la imagen'));
      image.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');
        if (!context) {
          resolve(result);
          return;
        }

        context.drawImage(image, 0, 0, width, height);
        try {
          resolve(canvas.toDataURL('image/webp', 0.86));
        } catch {
          resolve(result);
        }
      };
      image.src = result;
    };

    reader.readAsDataURL(file);
  });
}

export function ImagePicker({
  value,
  onChange,
  variant = 'cover',
  id,
  fallbackText,
}: ImagePickerProps) {
  const generatedId = useId();
  const pickerId = id ?? generatedId;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<ImagePickerTab>('upload');
  const [search, setSearch] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isAvatar = variant === 'avatar';
  const manualUrl = value.startsWith('data:image/') ? '' : value;

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    setError('');
    if (!file.type.startsWith('image/')) {
      setError('Seleccioná un archivo de imagen válido.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('La imagen no puede superar los 5 MB.');
      return;
    }

    setLoading(true);
    try {
      const dataUrl = await readImageFile(file, isAvatar ? 400 : 600);
      onChange(dataUrl);
      setFileName(file.name);
      setTab('upload');
    } catch {
      setError('No se pudo procesar la imagen. Probá con otro archivo.');
    } finally {
      setLoading(false);
    }
  };

  const selectImage = (url: string) => {
    onChange(url);
    setFileName('');
    setError('');
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = search.trim();
    if (!term) return;
    selectImage(coverUrl(term));
  };

  const handleGenerateAvatar = () => {
    const seed = `Codify-${Math.random().toString(36).slice(2, 9)}`;
    selectImage(avatarUrl(seed));
  };

  const handleClear = () => {
    selectImage('');
  };

  return (
    <div
      className={`image-picker image-picker--${variant}`}
      role="group"
      aria-label={isAvatar ? 'Selector de avatar' : 'Selector de portada'}
    >
      <div className="image-picker__preview">
        {value ? (
          <img
            src={value}
            alt={isAvatar ? 'Vista previa del avatar' : 'Vista previa de la portada'}
          />
        ) : (
          <span className="image-picker__empty">
            {isAvatar ? (
              fallbackText || '?'
            ) : (
              <Music size={26} aria-hidden="true" />
            )}
          </span>
        )}
      </div>

      <div className="image-picker__body">
        <div className="image-picker__tabs" role="tablist" aria-label="Origen de la imagen">
          <button
            id={`${pickerId}-tab-upload`}
            type="button"
            role="tab"
            aria-selected={tab === 'upload'}
            aria-controls={`${pickerId}-panel-upload`}
            className={`image-picker__tab${tab === 'upload' ? ' is-active' : ''}`}
            onClick={() => setTab('upload')}
          >
            <Upload size={14} aria-hidden="true" />
            Subir archivo
          </button>
          <button
            id={`${pickerId}-tab-web`}
            type="button"
            role="tab"
            aria-selected={tab === 'web'}
            aria-controls={`${pickerId}-panel-web`}
            className={`image-picker__tab${tab === 'web' ? ' is-active' : ''}`}
            onClick={() => setTab('web')}
          >
            {isAvatar ? (
              <Sparkles size={14} aria-hidden="true" />
            ) : (
              <Search size={14} aria-hidden="true" />
            )}
            {isAvatar ? 'Elegir avatar' : 'Buscar portada'}
          </button>
        </div>

        <input
          ref={fileInputRef}
          id={`${pickerId}-file`}
          type="file"
          accept="image/*"
          className="image-picker__file"
          onChange={handleFile}
        />

        {tab === 'upload' ? (
          <div
            id={`${pickerId}-panel-upload`}
            className="image-picker__panel"
            role="tabpanel"
            aria-labelledby={`${pickerId}-tab-upload`}
          >
            <button
              type="button"
              className="image-picker__upload"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              <Upload size={16} aria-hidden="true" />
              {loading ? 'Procesando imagen...' : 'Subir desde archivo / galería'}
            </button>
            <p className="image-picker__hint">
              {fileName
                ? `Archivo: ${fileName}`
                : 'JPG, PNG, WEBP o GIF · hasta 5 MB'}
            </p>
            {value && (
              <div className="image-picker__actions">
                <button
                  type="button"
                  className="image-picker__action"
                  onClick={handleClear}
                >
                  <Trash2 size={14} aria-hidden="true" />
                  Quitar imagen
                </button>
              </div>
            )}
          </div>
        ) : (
          <div
            id={`${pickerId}-panel-web`}
            className="image-picker__panel"
            role="tabpanel"
            aria-labelledby={`${pickerId}-tab-web`}
          >
            {isAvatar ? (
              <>
                <div className="image-picker__grid image-picker__grid--avatars">
                  {AVATAR_SEEDS.map((seed) => {
                    const url = avatarUrl(seed);
                    return (
                      <button
                        key={seed}
                        type="button"
                        className={`image-picker__option${value === url ? ' is-selected' : ''}`}
                        title={`Avatar ${seed}`}
                        onClick={() => selectImage(url)}
                      >
                        <img src={url} alt={`Avatar ${seed}`} loading="lazy" />
                      </button>
                    );
                  })}
                </div>
                <div className="image-picker__actions">
                  <button
                    type="button"
                    className="image-picker__action"
                    onClick={handleGenerateAvatar}
                  >
                    <RefreshCw size={14} aria-hidden="true" />
                    Generar avatar
                  </button>
                  <button
                    type="button"
                    className="image-picker__action"
                    onClick={() => selectImage('')}
                  >
                    <Trash2 size={14} aria-hidden="true" />
                    Usar iniciales
                  </button>
                </div>
              </>
            ) : (
              <>
                <form className="image-picker__search" onSubmit={handleSearch}>
                  <input
                    type="search"
                    className="image-picker__search-input"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Ej. rock, playa, neón..."
                    aria-label="Buscar portada"
                  />
                  <button type="submit" className="image-picker__search-button">
                    <Search size={14} aria-hidden="true" />
                    Buscar
                  </button>
                </form>
                <div className="image-picker__grid image-picker__grid--covers">
                  {COVER_CATEGORIES.map((category) => {
                    const url = coverUrl(category.seed);
                    return (
                      <button
                        key={category.seed}
                        type="button"
                        className={`image-picker__option${value === url ? ' is-selected' : ''}`}
                        title={`Portada ${category.label}`}
                        onClick={() => selectImage(url)}
                      >
                        <img
                          src={url}
                          alt={`Portada ${category.label}`}
                          loading="lazy"
                        />
                        <span className="image-picker__option-label">
                          {category.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        <div className="image-picker__manual">
          <label
            htmlFor={`${pickerId}-url`}
            className="image-picker__manual-label"
          >
            <Link2 size={13} aria-hidden="true" />
            O pegá una URL
          </label>
          <div className="image-picker__manual-row">
            <input
              id={`${pickerId}-url`}
              type="url"
              className="image-picker__manual-input"
              value={manualUrl}
              onChange={(event) => selectImage(event.target.value)}
              placeholder="https://..."
            />
            {value && (
              <button
                type="button"
                className="image-picker__clear"
                onClick={handleClear}
                aria-label="Quitar imagen"
                title="Quitar imagen"
              >
                <Trash2 size={15} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {error && <p className="image-picker__error">{error}</p>}
      </div>
    </div>
  );
}
