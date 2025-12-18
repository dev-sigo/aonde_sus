const elements = {
  unitsList: document.getElementById('units-list'),
  resultsCount: document.getElementById('results-count'),
  noResults: document.getElementById('no-results'),
  unitTemplate: document.getElementById('unit-card-template'),
  specialtySelect: document.getElementById('specialty'),
  unitTypeSelect: document.getElementById('unit-type'),
};

/**
 * Cria o elemento DOM de um card de unidade.
 */
function createUnitCard(unit) {
  const clone = elements.unitTemplate.content.cloneNode(true);
  const card = clone.querySelector('.unit-card');

  clone.querySelector('.unit-card__name').textContent = unit.name;
  clone.querySelector('.unit-card__address').textContent =
    `${unit.location.streetAddress}, ${unit.location.neighborhood} - ${unit.location.city}`;

  const badgeContainer = document.createElement('div');
  badgeContainer.className = 'unit-card__badges';

  unit.specialties.forEach((spec) => {
    const span = document.createElement('span');
    span.className = 'badge';
    span.textContent = spec;
    badgeContainer.appendChild(span);
  });

  card.appendChild(badgeContainer);
  return clone;
}

/**
 * Renderiza a lista de unidades e atualiza contadores/mensagens.
 */
export function renderUnits(units) {
  elements.unitsList.replaceChildren();

  if (units.length === 0) {
    elements.noResults.classList.remove('hidden');
    elements.resultsCount.textContent = 'Nenhuma unidade encontrada.';
    return;
  }

  elements.noResults.classList.add('hidden');
  elements.resultsCount.textContent = `${units.length} Unidade${units.length !== 1 ? 's' : ''} encontrada${units.length !== 1 ? 's' : ''}.`;

  const fragment = document.createDocumentFragment();
  units.forEach((unit) => fragment.appendChild(createUnitCard(unit)));

  elements.unitsList.appendChild(fragment);
}

/**
 * Preenche os selects de filtros.
 */
export function populateFilterOptions(specialties, unitTypes) {
  specialties.forEach((spec) => {
    elements.specialtySelect.add(new Option(spec, spec));
  });

  unitTypes.forEach((type) => {
    elements.unitTypeSelect.add(new Option(type, type));
  });
}

/**
 * Exibe mensagem de erro na interface.
 */
export function renderError(message) {
  elements.unitsList.innerHTML = `<p class="error">${message}</p>`;
}
