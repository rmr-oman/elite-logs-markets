import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AdminApp from './AdminApp';
import { AppProvider } from './state';
import './index.css';

createRoot(document.getElementById('admin-root')!).render(
  <StrictMode>
    <AppProvider>
      <AdminApp />
    </AppProvider>
  </StrictMode>
);
