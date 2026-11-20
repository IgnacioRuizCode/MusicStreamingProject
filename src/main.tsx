import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeData } from './services/storageServices';
import { AuthProvider } from './context/authContext.tsx';
import App from './App.tsx';
import './index.css';

initializeData();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);