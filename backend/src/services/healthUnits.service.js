let unitsData = [];

export function setUnitsData(data) {
  unitsData = Array.isArray(data) ? data : [];
}

export function getUnitsData() {
  return unitsData;
}

export function getUnitTypes(units = getUnitsData()) {
  if (!Array.isArray(units)) {
    return [];
  }

  const types = new Set();

  for (const unit of units) {
    if (unit?.type) {
      types.add(unit.type);
    }
  }

  return Array.from(types).sort();
}

export function getAllSpecialties(units = getUnitsData()) {
  if (!Array.isArray(units)) {
    return [];
  }

  const specialties = new Set();

  for (const unit of units) {
    if (Array.isArray(unit?.specialties)) {
      for (const specialty of unit.specialties) {
        specialties.add(specialty);
      }
    }
  }

  return Array.from(specialties).sort();
}

export function filterHealthUnits(units, filters = {}) {
  if (!Array.isArray(units) || units.length === 0) {
    return [];
  }

  let result = units;

  result = filterByType(result, filters.type);
  result = filterBySpecialties(result, filters.specialties);
  result = filterByWorkingTime(result, filters.isOpenNow);

  return result;
}

function filterByType(units, type) {
  if (!type) {
    return units;
  }

  return units.filter((unit) => unit.type === type);
}

function filterBySpecialties(units, specialties) {
  if (!Array.isArray(specialties) || specialties.length === 0) {
    return units;
  }

  return units.filter((unit) => {
    if (!Array.isArray(unit.specialties)) {
      return false;
    }

    return specialties.some((specialty) => unit.specialties.includes(specialty));
  });
}

function filterByWorkingTime(units, isOpenNow) {
  if (!isOpenNow) {
    return units;
  }

  const currentDay = getUtcDayOfWeek();
  const currentTimeInMinutes = getUtcMinutesOfDay();

  return units.filter((unit) => {
    const schedule = unit.schedule;

    if (!schedule) {
      return false;
    }

    const { is24h, openingTimeInMinutes, closingTimeInMinutes, availableDaysOfWeek } = schedule;

    if (!Array.isArray(availableDaysOfWeek) || !availableDaysOfWeek.includes(currentDay)) {
      return false;
    }

    if (is24h) {
      return true;
    }

    const isOvernight = openingTimeInMinutes > closingTimeInMinutes;

    if (!isOvernight) {
      return currentTimeInMinutes >= openingTimeInMinutes && currentTimeInMinutes < closingTimeInMinutes;
    }

    return currentTimeInMinutes >= openingTimeInMinutes || currentTimeInMinutes < closingTimeInMinutes;
  });
}

function getUtcMinutesOfDay() {
  const now = new Date();
  return now.getUTCHours() * 60 + now.getUTCMinutes();
}

function getUtcDayOfWeek() {
  const now = new Date();
  return now.getUTCDay();
}
