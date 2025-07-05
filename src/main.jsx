import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AppWrapper } from './auth.jsx';

createRoot(document.getElementById('root')).render(
  <AppWrapper>
    <StrictMode>
      <App />
    </StrictMode>
  </AppWrapper>
);
