import { getAllSpecialties, getUnitTypes, getUnitsData, filterHealthUnits } from '../services/healthUnits.service.js';

export function listSpecialties(req, res) {
  const specialties = getAllSpecialties();
  return res.status(200).json(specialties);
}

export function listUnitTypes(req, res) {
  const unitTypes = getUnitTypes();
  return res.status(200).json(unitTypes);
}

export function listHealthUnits(req, res) {
  const units = getUnitsData();
  const filters = extractFiltersFromQuery(req.query);

  const filteredUnits = filterHealthUnits(units, filters);

  return res.status(200).json(filteredUnits);
}

function extractFiltersFromQuery(query) {
  const { type, specialties, isOpenNow } = query;

  return {
    type,
    specialties: specialties ? specialties.split(',') : undefined,
    isOpenNow: isOpenNow === 'true',
  };
}
