import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";

createRoot(document.getElementById("root")!).render(<App />);

// Registro do Service Worker apenas em produção para evitar loops no ambiente de desenvolvimento
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    let refreshing = false;

    // Detecta quando um novo service worker assume o controle e recarrega a página
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        console.log('PWA: Nova versão detectada, recarregando...');
        window.location.reload();
      }
    });

    navigator.serviceWorker.register('/service-worker.js').then(reg => {
      console.log('PWA: ServiceWorker registrado');

      // Verifica atualizações ao carregar a página
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('PWA: Novo conteúdo disponível, atualizando...');
            }
          });
        }
      });
    }).catch(err => {
      console.log('PWA: Erro no registro do SW', err);
    });
  });
}