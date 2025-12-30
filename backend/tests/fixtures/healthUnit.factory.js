export function makeHealthUnit(overrides = {}) {
  return {
    id: 1,
    name: 'Unidade de Saúde',
    type: 'UBS',
    specialties: ['Clínica Geral'],
    ...overrides,
  };
}
