/**
 * Filtra as unidades de saúde com base em um conjunto de critérios (filtros cumulativos).
 * @param {Array<Object>} units - O array de todas as unidades de saúde.
 * @param {Object} filters - Um objeto contendo os critérios de filtragem.
 * @param {string} [filters.type] - O tipo de unidade (e.g., 'UBS', 'UPA').
 * @param {Array<string>} [filters.specialties] - Uma lista de especialidades médicas (filtros aplicados com lógica OR).
 * @returns {Array<Object>} O array de unidades de saúde filtradas.
 */
export function filterHealthUnits(units, filters = {}) {
  if (!Array.isArray(units) || units.length === 0) {
    return [];
  }

  let filteredUnits = units;

  filteredUnits = filterByType(filteredUnits, filters.type);
  filteredUnits = filterBySpecialties(filteredUnits, filters.specialties);

  return filteredUnits;
}

/**
 * Filtra as unidades de saúde por tipo (e.g., 'UBS', 'UPA').
 * @param {Array<Object>} units - O array de unidades a serem filtradas.
 * @param {string} type - O tipo de unidade desejado.
 * @returns {Array<Object>} O array de unidades filtradas.
 */
function filterByType(units, type) {
  if (!type) {
    return units;
  }
  return units.filter((unit) => unit.type === type);
}

/**
 * Filtra as unidades de saúde por especialidades médicas.
 * @param {Array<Object>} units - O array de unidades a serem filtradas.
 * @param {Array<string>} specialties - Uma lista de especialidades médicas (filtros aplicados com lógica OR).
 * @returns {Array<Object>} O array de unidades filtradas.
 */
function filterBySpecialties(units, specialties) {
  if (!Array.isArray(specialties) || specialties.length === 0) {
    return units;
  }

  return units.filter((unit) => {
    const unitSpecialties = unit.specialties;

    if (!Array.isArray(unitSpecialties) || unitSpecialties.length === 0) {
      return false;
    }

    return specialties.some((requiredSpecialty) => unitSpecialties.includes(requiredSpecialty));
  });
}
