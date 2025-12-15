/**
 * @typedef {Object} FilterCriteria
 * @property {string} [type] - O tipo de unidade (e.g., 'UBS', 'UPA').
 * @property {Array<string>} [specialties] - Uma lista de especialidades médicas. A filtragem é aplicada com lógica OR.
 * @property {boolean} [isOpenNow] - Se verdadeiro, filtra apenas unidades abertas no momento da busca (calculado via UTC).
 */

/**
 * Filtra as unidades de saúde com base em um conjunto de critérios (filtros cumulativos).
 * @param {Array<Object>} units - O array de todas as unidades de saúde.
 * @param {FilterCriteria} [filters={}] - Objeto contendo os critérios de filtragem.
 * @returns {Array<Object>} O array de unidades de saúde filtradas.
 */
export function filterHealthUnits(units, filters = {}) {
  if (!Array.isArray(units) || units.length === 0) {
    return [];
  }

  let filteredUnits = units;

  filteredUnits = filterByType(filteredUnits, filters.type);
  filteredUnits = filterBySpecialties(filteredUnits, filters.specialties);

  let currentDay = null;
  let currentTimeInMinutes = null;

  if (filters.isOpenNow) {
    currentDay = getUtcDayOfWeek();
    currentTimeInMinutes = getUtcMinutesOfDay();
  }

  // A função filterByWorkingTime agora tem a lógica de agendamento noturno.
  filteredUnits = filterByWorkingTime(filteredUnits, filters.isOpenNow, currentDay, currentTimeInMinutes);

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

/**
 * Filtra as unidades de saúde que estão abertas no momento da busca (usando UTC).
 * @param {Array<Unit>} units - O array de unidades a serem filtradas.
 * @param {boolean} isOpenNow - Se verdadeiro, filtra unidades abertas.
 * @param {number | null} currentDay - O dia da semana atual (0-6) em UTC.
 * @param {number | null} currentTimeInMinutes - O horário atual em minutos (0-1439) em UTC.
 * @returns {Array<Unit>} O array de unidades filtradas.
 */
function filterByWorkingTime(units, isOpenNow, currentDay, currentTimeInMinutes) {
  if (!isOpenNow || currentDay === null || currentTimeInMinutes === null) {
    return units;
  }

  return units.filter((unit) => {
    const { is24h, openingTimeInMinutes, closingTimeInMinutes, availableDaysOfWeek } = unit.schedule;
    const isOpenToday = Array.isArray(availableDaysOfWeek) && availableDaysOfWeek.includes(currentDay);

    if (!isOpenToday) {
      return false;
    }

    if (is24h) {
      return true;
    }

    const isOvernight = openingTimeInMinutes > closingTimeInMinutes;

    if (!isOvernight) {
      // 1. Horário Normal (Ex: 08:00 - 18:00)
      return currentTimeInMinutes >= openingTimeInMinutes && currentTimeInMinutes < closingTimeInMinutes;
    } else {
      // 2. Horário Noturno que Transpõe Meia-Noite (Ex: 22:00 - 02:00)
      // Se o horário de abertura for maior que o de fechamento, o turno é noturno.
      // A unidade estará aberta se o tempo atual for:
      // a) Após o horário de abertura (noite do dia D) OU
      // b) Antes do horário de fechamento (madrugada do dia D+1)
      return currentTimeInMinutes >= openingTimeInMinutes || currentTimeInMinutes < closingTimeInMinutes;
    }
  });
}

/**
 * Retorna o número de minutos decorridos desde a meia-noite (0 - 1439),
 * garantindo a neutralidade de fuso horário (UTC).
 * @returns {number} Minutos do dia (0 a 1439).
 */
export function getUtcMinutesOfDay() {
  const now = new Date();
  return now.getUTCHours() * 60 + now.getUTCMinutes();
}

/**
 * Retorna o dia da semana atual baseado em UTC
 * (0 = Domingo, 1 = Segunda, ..., 6 = Sábado).
 * @returns {number} Dia da semana (0 a 6).
 */
export function getUtcDayOfWeek() {
  const now = new Date();
  return now.getUTCDay();
}
