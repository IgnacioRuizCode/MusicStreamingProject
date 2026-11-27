import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Calendar,
  CreditCard,
  Edit3,
  Eye,
  EyeOff,
  Heart,
  KeyRound,
  LogOut,
  Mail,
  Plus,
  Shield,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import {
  getAll,
  getPlanById,
  getUserPlaylists,
} from '../services/storageServices';
import {
  cambioPasswordSchema,
  invitadoPlanSchema,
  perfilSchema,
  type CambioPasswordValues,
  type InvitadoPlanValues,
  type PerfilValues,
} from '../schemas/perfilSchema';
import { obtenerIniciales } from '../utils/obtenerIniciales';
import { CardPlaylist } from '../components/cardplaylist/CardPlaylist';
import { ArtistCard } from '../components/ArtistCard/ArtistCard';
import { ConfirmationModal } from '../components/admin/ConfirmationModal';
import { CrearPlaylistModal } from '../components/CrearPlaylistModal';
import './PerfilPage.css';

const AVATAR_PRESETS = [
  'https://api.dicebear.com/9.x/thumbs/svg?seed=CodifyBeat',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=MelodyWave',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=BassDrop',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=NightGroove',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=SynthPulse',
];

function getMaxInvitadosPorPlan(planId: string | null): number {
  if (planId === 'plan-duo') return 1;
  if (planId === 'plan-familiar') return 5;
  return 0;
}

export function PerfilPage() {
  const {
    user,
    logout,
    actualizarPerfil,
    cambiarPassword,
    cancelarSuscripcion,
    agregarInvitadoPlan,
    eliminarInvitadoPlan,
    toggleLikedSong,
    eliminarCuenta,
  } = useAuth();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [cancelPlanModal, setCancelPlanModal] = useState(false);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);
  const [libraryVersion, setLibraryVersion] = useState(0);

  const plan = user?.planId ? getPlanById(user.planId) : undefined;
  const maxInvitados = getMaxInvitadosPorPlan(user?.planId ?? null);
  const invitados = user?.invitedMembers ?? [];

  const profileForm = useForm<PerfilValues>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      username: user?.username ?? '',
      birthDate: user?.birthDate ?? '',
      avatar: user?.avatar ?? '',
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        username: user.username,
        birthDate: user.birthDate,
        avatar: user.avatar ?? '',
      });
    }
  }, [user, profileForm]);

  const passwordForm = useForm<CambioPasswordValues>({
    resolver: zodResolver(cambioPasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const inviteForm = useForm<InvitadoPlanValues>({
    resolver: zodResolver(invitadoPlanSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const userPlaylists = useMemo(() => {
    void libraryVersion;
    if (!user) return [];
    return getUserPlaylists(user.id);
  }, [user, libraryVersion]);

  const followedArtistsList = useMemo(() => {
    if (!user) return [];
    const allArtists = getAll('artists');
    return allArtists.filter((a) => user.followedArtists.includes(a.id));
  }, [user]);

  const likedSongsList = useMemo(() => {
    if (!user) return [];
    const allSongs = getAll('songs');
    const allArtists = getAll('artists');
    const likedIds = user.likedSongs ?? [];

    return allSongs
      .filter((s) => likedIds.includes(s.id))
      .map((song) => ({
        ...song,
        artistName:
          allArtists.find((a) => a.id === song.artistId)?.name ?? 'Artista desconocido',
      }));
  }, [user]);

  const currentAvatarPreview = useWatch({
    control: profileForm.control,
    name: 'avatar',
  });

  if (!user) return null;

  const onSaveProfile = (values: PerfilValues) => {
    const res = actualizarPerfil(values);
    if (!res.success) {
      toast.error(res.error);
      return;
    }
    toast.success('Perfil actualizado correctamente');
    setEditMode(false);
  };

  const onChangePassword = (values: CambioPasswordValues) => {
    const res = cambiarPassword(values.currentPassword, values.newPassword);
    if (!res.success) {
      passwordForm.setError('currentPassword', { message: res.error });
      toast.error(res.error);
      return;
    }
    toast.success('Contraseña actualizada con éxito');
    passwordForm.reset();
  };

  const onInviteMember = (values: InvitadoPlanValues) => {
    const res = agregarInvitadoPlan(values.name, values.email);
    if (!res.success) {
      toast.error(res.error);
      return;
    }
    toast.success(
      `Se envió un correo de invitación a ${values.email.trim().toLowerCase()}`,
    );
    inviteForm.reset();
  };

  const handleConfirmCancelPlan = () => {
    const res = cancelarSuscripcion();
    setCancelPlanModal(false);
    if (!res.success) {
      toast.error(res.error);
      return;
    }
    toast.success('Tu suscripción fue cancelada');
  };

  const handleConfirmDeleteAccount = () => {
    if (deleteConfirmText.trim() !== user.username) {
      toast.error('Escribí exactamente tu nombre de usuario para confirmar.');
      return;
    }
    const res = eliminarCuenta();
    if (!res.success) {
      toast.error(res.error);
      return;
    }
    toast.success('Tu cuenta fue eliminada');
    navigate('/');
  };

  const formatDate = (isoOrDate: string) => {
    const normalized = isoOrDate.includes('T') ? isoOrDate : `${isoOrDate}T00:00:00`;
    const parsed = new Date(normalized);
    if (Number.isNaN(parsed.getTime())) return isoOrDate;
    return new Intl.DateTimeFormat('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(parsed);
  };

  return (
    <div className="perfil-page">
      <header className="perfil-header">
        <div className="perfil-header__main">
          <div className="perfil-avatar" aria-hidden="true">
            {user.avatar && failedAvatarUrl !== user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="perfil-avatar__img"
                onError={() => setFailedAvatarUrl(user.avatar ?? null)}
              />
            ) : (
              obtenerIniciales(user.username)
            )}
          </div>

          <div>
            <div className="perfil-header__badges">
              <span className="perfil-badge">Perfil</span>
              {user.role === 'admin' && (
                <span className="perfil-badge perfil-badge--admin">Administrador</span>
              )}
            </div>
            <h1 className="perfil-header__title">{user.username}</h1>
            <div className="perfil-header__stats">
              <span className="perfil-stat-pill">{userPlaylists.length} playlists</span>
              <span className="perfil-stat-pill">
                {followedArtistsList.length} artistas seguidos
              </span>
              <span className="perfil-stat-pill">
                {likedSongsList.length} canciones favoritas
              </span>
            </div>
          </div>
        </div>

        <div className="perfil-header__actions">
          {user.role === 'admin' && (
            <Link to="/admin" className="btn btn--secondary">
              <Shield size={16} /> Panel Admin
            </Link>
          )}
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </header>

      <div className="perfil-grid">
        <section className="perfil-card" aria-labelledby="datos-cuenta-heading">
          <div className="perfil-card__header">
            <h2 id="datos-cuenta-heading" className="perfil-card__title">
              Datos de la cuenta
            </h2>
            {!editMode && (
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setEditMode(true)}
              >
                <Edit3 size={15} /> Editar
              </button>
            )}
          </div>

          {!editMode ? (
            <dl className="perfil-info-list">
              <div className="perfil-info-item">
                <dt>Correo electrónico</dt>
                <dd>{user.email}</dd>
              </div>
              <div className="perfil-info-item">
                <dt>Nombre de usuario</dt>
                <dd>{user.username}</dd>
              </div>
              <div className="perfil-info-item">
                <dt>Fecha de nacimiento</dt>
                <dd>{formatDate(user.birthDate)}</dd>
              </div>
            </dl>
          ) : (
            <form
              className="perfil-form"
              onSubmit={profileForm.handleSubmit(onSaveProfile)}
              noValidate
            >
              <div className="perfil-field">
                <label htmlFor="perfil-email">Correo electrónico (no editable)</label>
                <input id="perfil-email" type="email" value={user.email} disabled />
              </div>

              <div className="perfil-field">
                <label htmlFor="perfil-username">Nombre de usuario</label>
                <input
                  id="perfil-username"
                  type="text"
                  {...profileForm.register('username')}
                />
                {profileForm.formState.errors.username && (
                  <span className="perfil-error">
                    {profileForm.formState.errors.username.message}
                  </span>
                )}
              </div>

              <div className="perfil-field">
                <label htmlFor="perfil-birthdate">Fecha de nacimiento</label>
                <input
                  id="perfil-birthdate"
                  type="date"
                  {...profileForm.register('birthDate')}
                />
                {profileForm.formState.errors.birthDate && (
                  <span className="perfil-error">
                    {profileForm.formState.errors.birthDate.message}
                  </span>
                )}
              </div>

              <div className="perfil-field">
                <label htmlFor="perfil-avatar">
                  Foto de perfil (URL o elegí un avatar)
                </label>
                <input
                  id="perfil-avatar"
                  type="url"
                  placeholder="Dejalo vacío para usar tus iniciales"
                  {...profileForm.register('avatar')}
                />
                {profileForm.formState.errors.avatar && (
                  <span className="perfil-error">
                    {profileForm.formState.errors.avatar.message}
                  </span>
                )}

                <div className="perfil-presets">
                  <button
                    type="button"
                    className={`perfil-preset-btn${!currentAvatarPreview ? ' is-selected' : ''}`}
                    title="Usar iniciales"
                    onClick={() =>
                      profileForm.setValue('avatar', '', { shouldDirty: true })
                    }
                  >
                    <span className="perfil-preset-btn__initials">
                      {obtenerIniciales(user.username)}
                    </span>
                  </button>
                  {AVATAR_PRESETS.map((presetUrl, index) => (
                    <button
                      key={presetUrl}
                      type="button"
                      className={`perfil-preset-btn${currentAvatarPreview === presetUrl ? ' is-selected' : ''}`}
                      title={`Avatar predefinido ${index + 1}`}
                      onClick={() =>
                        profileForm.setValue('avatar', presetUrl, { shouldDirty: true })
                      }
                    >
                      <img src={presetUrl} alt={`Preset ${index + 1}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="perfil-form__actions">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => {
                    profileForm.reset();
                    setEditMode(false);
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={!profileForm.formState.isDirty}
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          )}
        </section>

        <section className="perfil-card" aria-labelledby="seguridad-heading">
          <div className="perfil-card__header">
            <h2 id="seguridad-heading" className="perfil-card__title">
              <KeyRound size={18} /> Cambiar contraseña
            </h2>
          </div>

          <form
            className="perfil-form"
            onSubmit={passwordForm.handleSubmit(onChangePassword)}
            noValidate
          >
            <div className="perfil-field">
              <label htmlFor="pwd-current">Contraseña actual</label>
              <div className="perfil-password-wrap">
                <input
                  id="pwd-current"
                  type={showCurrentPwd ? 'text' : 'password'}
                  {...passwordForm.register('currentPassword')}
                />
                <button
                  type="button"
                  className="perfil-password-toggle"
                  aria-label="Mostrar u ocultar contraseña actual"
                  onClick={() => setShowCurrentPwd((v) => !v)}
                >
                  {showCurrentPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordForm.formState.errors.currentPassword && (
                <span className="perfil-error">
                  {passwordForm.formState.errors.currentPassword.message}
                </span>
              )}
            </div>

            <div className="perfil-field">
              <label htmlFor="pwd-new">Nueva contraseña</label>
              <div className="perfil-password-wrap">
                <input
                  id="pwd-new"
                  type={showNewPwd ? 'text' : 'password'}
                  {...passwordForm.register('newPassword')}
                />
                <button
                  type="button"
                  className="perfil-password-toggle"
                  aria-label="Mostrar u ocultar nueva contraseña"
                  onClick={() => setShowNewPwd((v) => !v)}
                >
                  {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordForm.formState.errors.newPassword && (
                <span className="perfil-error">
                  {passwordForm.formState.errors.newPassword.message}
                </span>
              )}
            </div>

            <div className="perfil-field">
              <label htmlFor="pwd-confirm">Confirmar nueva contraseña</label>
              <input
                id="pwd-confirm"
                type={showNewPwd ? 'text' : 'password'}
                {...passwordForm.register('confirmNewPassword')}
              />
              {passwordForm.formState.errors.confirmNewPassword && (
                <span className="perfil-error">
                  {passwordForm.formState.errors.confirmNewPassword.message}
                </span>
              )}
            </div>

            <div className="perfil-form__actions">
              <button
                type="submit"
                className="btn btn--primary"
                disabled={!passwordForm.formState.isDirty}
              >
                Actualizar contraseña
              </button>
            </div>
          </form>
        </section>

        <section className="perfil-card perfil-card--full" aria-labelledby="mi-plan-heading">
          <div className="perfil-card__header">
            <h2 id="mi-plan-heading" className="perfil-card__title">
              <CreditCard size={18} /> Mi plan
            </h2>
          </div>

          {!plan ? (
            <div className="perfil-plan-box">
              <p className="perfil-plan-box__empty-text">
                Actualmente no tenés una suscripción activa. Explorá nuestros planes para
                escuchar sin límites.
              </p>
              <div>
                <Link to="/planes" className="btn btn--primary">
                  Explorar planes
                </Link>
              </div>
            </div>
          ) : (
            <div className="perfil-plan-box">
              <div className="perfil-plan-box__top">
                <h3 className="perfil-plan-name">{plan.nombre}</h3>
                <span className="perfil-plan-price">
                  ${plan.precio.toLocaleString('es-AR')} / mes
                </span>
              </div>

              <ul className="perfil-plan-benefits">
                {plan.beneficios.map((beneficio) => (
                  <li key={beneficio}>{beneficio}</li>
                ))}
              </ul>

              <div className="perfil-plan-meta">
                {user.nextPaymentDate && (
                  <span className="perfil-plan-meta__item">
                    <Calendar size={15} />
                    Próximo cobro: <strong>{formatDate(user.nextPaymentDate)}</strong>
                  </span>
                )}
                {user.card && (
                  <span className="perfil-plan-meta__item">
                    <CreditCard size={15} />
                    Tarjeta: <strong>{user.card.brand} •••• {user.card.last4}</strong>
                  </span>
                )}
              </div>

              {maxInvitados > 0 && (
                <div className="perfil-members">
                  <div className="perfil-card__header">
                    <h3 className="perfil-members__title">
                      <Users size={17} /> Miembros del plan ({invitados.length}/{maxInvitados}{' '}
                      invitados)
                    </h3>
                    <div className="perfil-members__slots" aria-hidden="true">
                      {Array.from({ length: maxInvitados }).map((_, idx) => (
                        <span
                          key={idx}
                          className={`perfil-members__slot${idx < invitados.length ? ' is-filled' : ''}`}
                        />
                      ))}
                    </div>
                  </div>

                  {invitados.length < maxInvitados && (
                    <form
                      className="perfil-members__form"
                      onSubmit={inviteForm.handleSubmit(onInviteMember)}
                      noValidate
                    >
                      <div className="perfil-field">
                        <input
                          type="text"
                          placeholder="Nombre del invitado"
                          aria-label="Nombre del invitado"
                          {...inviteForm.register('name')}
                        />
                        {inviteForm.formState.errors.name && (
                          <span className="perfil-error">
                            {inviteForm.formState.errors.name.message}
                          </span>
                        )}
                      </div>

                      <div className="perfil-field">
                        <input
                          type="email"
                          placeholder="correo@ejemplo.com"
                          aria-label="Correo del invitado"
                          {...inviteForm.register('email')}
                        />
                        {inviteForm.formState.errors.email && (
                          <span className="perfil-error">
                            {inviteForm.formState.errors.email.message}
                          </span>
                        )}
                      </div>

                      <button type="submit" className="btn btn--primary">
                        <UserPlus size={16} /> Invitar
                      </button>
                    </form>
                  )}

                  {invitados.length === 0 ? (
                    <p className="perfil-empty">
                      Todavía no invitaste a nadie. Podés sumar hasta {maxInvitados}{' '}
                      {maxInvitados === 1 ? 'persona' : 'personas'} a tu plan.
                    </p>
                  ) : (
                    <ul className="perfil-members__list">
                      {invitados.map((member) => (
                        <li key={member.email} className="perfil-member-item">
                          <div className="perfil-member-item__info">
                            <strong>{member.name}</strong>
                            <span className="perfil-member-item__email">
                              <Mail size={13} />
                              {member.email}
                            </span>
                          </div>
                          <div className="perfil-member-item__actions">
                            <span className="perfil-member-item__status">{member.status}</span>
                            <button
                              type="button"
                              className="perfil-icon-btn"
                              aria-label={`Quitar invitación de ${member.name}`}
                              title="Quitar invitado"
                              onClick={() => {
                                eliminarInvitadoPlan(member.email);
                                toast.info(`Se quitó a ${member.name} del plan`);
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="perfil-form__actions perfil-form__actions--start">
                <Link to="/planes" className="btn btn--secondary">
                  Cambiar de plan
                </Link>
                <button
                  type="button"
                  className="btn btn--danger"
                  onClick={() => setCancelPlanModal(true)}
                >
                  Cancelar suscripción
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="perfil-card perfil-card--full" aria-labelledby="mi-biblio-heading">
          <div className="perfil-card__header">
            <h2 id="mi-biblio-heading" className="perfil-card__title">
              Mi biblioteca
            </h2>
            <div className="perfil-card__toolbar">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => setCreatePlaylistOpen(true)}
              >
                <Plus size={16} /> Crear playlist
              </button>
              <Link to="/biblioteca" className="btn btn--secondary">
                Ver biblioteca completa
              </Link>
            </div>
          </div>

          <div>
            <h3 className="perfil-subsection__title">
              Playlists propias y guardadas ({userPlaylists.length})
            </h3>
            {userPlaylists.length === 0 ? (
              <p className="perfil-empty">
                Todavía no creaste ni guardaste ninguna playlist.
              </p>
            ) : (
              <div className="perfil-cards-grid">
                {userPlaylists.map((playlist) => (
                  <CardPlaylist
                    key={playlist.id}
                    id={playlist.id}
                    title={playlist.title}
                    description={playlist.description}
                    image={playlist.cover}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="perfil-subsection__title">
              Artistas seguidos ({followedArtistsList.length})
            </h3>
            {followedArtistsList.length === 0 ? (
              <p className="perfil-empty">Todavía no seguís a ningún artista.</p>
            ) : (
              <div className="perfil-cards-grid">
                {followedArtistsList.map((artist) => (
                  <ArtistCard
                    key={artist.id}
                    id={artist.id}
                    name={artist.name}
                    image={artist.image}
                    songIds={artist.songIds}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="perfil-subsection__title">
              Canciones favoritas ({likedSongsList.length})
            </h3>
            {likedSongsList.length === 0 ? (
              <p className="perfil-empty">
                Todavía no marcaste canciones con Me gusta.
              </p>
            ) : (
              <ul className="perfil-songs-list">
                {likedSongsList.map((song) => (
                  <li key={song.id} className="perfil-song-row">
                    <div className="perfil-song-row__left">
                      <img
                        src={song.cover}
                        alt=""
                        className="perfil-song-row__cover"
                      />
                      <div className="perfil-song-row__meta">
                        <span className="perfil-song-row__title">{song.title}</span>
                        <span className="perfil-song-row__artist">{song.artistName}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="perfil-icon-btn"
                      aria-label={`Quitar ${song.title} de favoritos`}
                      title="Quitar de favoritos"
                      onClick={() => {
                        toggleLikedSong(song.id);
                        toast.info('Quitada de canciones favoritas');
                      }}
                    >
                      <Heart size={16} fill="#ec4899" color="#ec4899" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section
          className="perfil-card perfil-card--full perfil-card--danger"
          aria-labelledby="danger-zone-heading"
        >
          <div className="perfil-card__header">
            <h2
              id="danger-zone-heading"
              className="perfil-card__title perfil-card__title--danger"
            >
              Zona de peligro
            </h2>
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => {
                setDeleteConfirmText('');
                setDeleteAccountModal(true);
              }}
            >
              Eliminar cuenta
            </button>
          </div>
          <p className="perfil-empty">
            Esta acción es permanente y eliminará tu cuenta, tus playlists creadas y tus
            preferencias guardadas.
          </p>
        </section>
      </div>

      <ConfirmationModal
        abierto={cancelPlanModal}
        titulo="¿Cancelar suscripción?"
        mensaje="Perderás los beneficios de tu plan actual y se desvincularán los miembros invitados. Podés volver a suscribirte cuando quieras."
        textoConfirmar="Sí, cancelar plan"
        onConfirmar={handleConfirmCancelPlan}
        onCancelar={() => setCancelPlanModal(false)}
      />

      {deleteAccountModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="perfil-modal-backdrop"
          onClick={() => setDeleteAccountModal(false)}
        >
          <div className="perfil-modal" onClick={(e) => e.stopPropagation()}>
            <div className="perfil-modal__header">
              <h3>Eliminar cuenta permanentemente</h3>
            </div>
            <p className="perfil-modal__text">
              Escribí tu nombre de usuario (<strong>{user.username}</strong>) para
              confirmar:
            </p>
            <div className="perfil-field">
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={user.username}
              />
            </div>
            <div className="perfil-modal__actions">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setDeleteAccountModal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn--danger"
                onClick={handleConfirmDeleteAccount}
              >
                Eliminar definitivamente
              </button>
            </div>
          </div>
        </div>
      )}

      <CrearPlaylistModal
        abierto={createPlaylistOpen}
        userId={user.id}
        onClose={() => setCreatePlaylistOpen(false)}
        onCreated={() => setLibraryVersion((v) => v + 1)}
      />
    </div>
  );
}