import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './AppProviders';
import { AuthProvider } from './context/AuthContext';
import { initializeData } from './services/storageServices';
import './index.css';

initializeData();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppProviders />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
