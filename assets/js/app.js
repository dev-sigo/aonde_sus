import { getHealthUnits, getSpecialties, getUnitTypes } from './healthUnitsService.js';
import * as View from './healthUnitsView.js';

const filterForm = document.getElementById('filter-form');

async function handleFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(filterForm);

  const filters = {
    type: formData.get('unit-type') || undefined,
    specialties: formData.getAll('specialty').join(',') || undefined,
    isOpenNow: formData.get('open-now') === 'true',
  };

  const units = await getHealthUnits(filters);
  View.renderUnits(units);
}

async function initApp() {
  const [units, specialties, unitTypes] = await Promise.all([getHealthUnits(), getSpecialties(), getUnitTypes()]);

  View.populateFilterOptions(specialties, unitTypes);
  View.renderUnits(units);

  filterForm.addEventListener('submit', handleFormSubmit);
}

if (typeof document !== 'undefined') {
  initApp();
}
