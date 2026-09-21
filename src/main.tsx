import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

try {
  (window as unknown as { __APP_MOUNTED__: boolean }).__APP_MOUNTED__ = true;
  const diagBanner = document.getElementById('startup-diagnostic-banner');
  if (diagBanner) diagBanner.remove();

  const win = window as unknown as {
    AndroidDiagnostics?: {
      reportReady?: () => void;
      log?: (level: string, tag: string, msg: string) => void;
    };
  };
  if (win.AndroidDiagnostics?.reportReady) {
    win.AndroidDiagnostics.reportReady();
  }
} catch (e) {
  console.warn('Diagnostics callback error:', e);
}
