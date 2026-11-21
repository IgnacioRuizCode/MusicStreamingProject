import { Outlet } from 'react-router-dom';

export function LayoutAuth() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        backgroundColor: 'var(--bg-base, #0a0a0f)',
        color: 'var(--text-primary, #ffffff)',
      }}
    >
      <div style={{ marginBottom: '1.5rem', fontWeight: 700, fontSize: '1.5rem' }}>
        LOGO
      </div>
      <Outlet />
    </div>
  );
}