const DATA_URL = './assets/js/healthUnits.json';

/**
 * Busca e carrega a lista de unidades de saúde de forma segura,
 * garantindo que a aplicação não pare de funcionar (quebrar)
 * em caso de falhas de conexão ou erros de servidor.
 *
 * @returns {Promise<Array>} Retorna a lista de unidades ou um array vazio se houver erro.
 */
export async function getHealthUnitsData() {
  try {
    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} (Not Found)`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error loading health units data:', error);
    return [];
  }
}

/**
 * Extrai todos os tipos únicos de unidade de saúde (ex: UBS, UPA...).
 * @param {Array<object>} units - O array de unidades de saúde.
 * @returns {Array<string>} Retorna um array de strings com os tipos únicos.
 */
export function getUnitTypes(units) {
  if (!Array.isArray(units) || units.length === 0) {
    return [];
  }

  const uniqueTypes = new Set();

  units.forEach((unit) => {
    if (unit.type) {
      uniqueTypes.add(unit.type);
    }
  });

  return Array.from(uniqueTypes).sort();
}

/**
 * Extrai todas as especialidades médicas únicas disponíveis nas unidades.
 * @param {Array<object>} units - O array de unidades de saúde.
 * @returns {Array<string>} Retorna um array de strings com as especialidades únicas.
 */
export function getAllSpecialties(units) {
  if (!Array.isArray(units) || units.length === 0) {
    return [];
  }

  const uniqueSpecialties = new Set();

  units.forEach((unit) => {
    if (Array.isArray(unit.specialties)) {
      unit.specialties.forEach((spec) => {
        uniqueSpecialties.add(spec);
      });
    }
  });

  return Array.from(uniqueSpecialties).sort();
}
