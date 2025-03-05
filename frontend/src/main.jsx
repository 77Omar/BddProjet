import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom'; // Importer BrowserRouter
import './index.css'; // Ajoute cette ligne

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* Enveloppe ton application dans BrowserRouter */}
      <App />
    </BrowserRouter>
  </StrictMode>
);
