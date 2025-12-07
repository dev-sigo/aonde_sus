import { loadHealthUnits } from './dataHandler.js';

export { loadHealthUnits };

/**
 * Inicia o carregamento dos dados e prepara a aplicação no lado do cliente.
 * Esta função deve ser chamada APENAS no navegador.
 */
function initApp() {
  document.addEventListener('DOMContentLoaded', () => {
    loadHealthUnits()
      .then((units) => {
        console.log('Dados prontos para renderização:', units);
      })
      .catch((err) => {
        console.error('Erro na fase de inicialização:', err);
      });
  });
}

if (typeof document !== 'undefined') {
  initApp();
}
