import { getHealthUnitsData, getAllSpecialties, getUnitTypes } from './healthUnitsService.js';
import { filterHealthUnits } from './healthUnitsFilter.js';
import * as View from './healthUnitsView.js';

let allUnits = [];

const filterForm = document.getElementById('filter-form');

/**
 * Função de manipulação do evento de submissão do formulário.
 * @param {Event} event - O evento de submissão.
 */
function handleFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(filterForm);
  const currentFilters = {
    specialties: formData.getAll('specialty'),
    type: formData.get('unit-type'),
    isOpenNow: formData.get('open-now') === 'true',
  };

  const filteredUnits = filterHealthUnits(allUnits, currentFilters);
  View.renderUnits(filteredUnits);
}

/**
 * Prepara e inicia a aplicação no navegador (browser),
 * garantindo que os dados sejam carregados e a interface montada somente
 * depois que todo o HTML estiver pronto para interagir.
 *
 * Nota: Esta função é ignorada durante a execução de testes (Jest).
 */
async function initApp() {
  try {
    const units = await getHealthUnitsData();
    allUnits = units;

    const specialties = getAllSpecialties(units);
    const unitTypes = getUnitTypes(units);
    View.populateFilterOptions(specialties, unitTypes);

    View.renderUnits(allUnits);

    filterForm.addEventListener('submit', handleFormSubmit);
    console.log('Aplicação inicializada com sucesso.');
  } catch (err) {
    console.error('Falha na inicialização:', err);
    View.renderError('Não foi possível carregar as unidades de saúde.');
  }
}

if (typeof document !== 'undefined') {
  initApp();
}
