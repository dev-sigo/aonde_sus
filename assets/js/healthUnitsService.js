const API_BASE_URL = 'http://localhost:3000';

export async function getHealthUnits(filters = {}) {
  const params = new URLSearchParams(filters);

  const response = await fetch(`${API_BASE_URL}/health-units?${params}`);

  if (!response.ok) {
    throw new Error('Erro ao buscar unidades');
  }

  return response.json();
}

export async function getSpecialties() {
  const response = await fetch(`${API_BASE_URL}/specialties`);
  return response.json();
}

export async function getUnitTypes() {
  const response = await fetch(`${API_BASE_URL}/unit-types`);
  return response.json();
}
