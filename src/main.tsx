import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import Proposta from './Proposta.tsx';
import './index.css';

const pathname = window.location.pathname;

const Page = pathname === '/proposta' || pathname === '/proposta/' ? Proposta : App;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
);
