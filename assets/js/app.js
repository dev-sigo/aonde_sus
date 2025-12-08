import { getHealthUnitsData } from './dataHandler.js';

/**
 * Prepara e inicia a aplicação no navegador (browser),
 * garantindo que os dados sejam carregados e a interface montada somente
 * depois que todo o HTML estiver pronto para interagir.
 *
 * Nota: Esta função é ignorada durante a execução de testes (Jest).
 */
function initApp() {
  document.addEventListener('DOMContentLoaded', () => {
    getHealthUnitsData()
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

export { getHealthUnitsData };
