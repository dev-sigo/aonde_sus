import { expect } from '@jest/globals';
import { filterHealthUnits } from '../assets/js/app.js';

const mockData = [
  {
    id: 1,
    name: 'UBS Central de Valparaíso',
    type: 'UBS',
    schedule: {
      openingTimeInMinutes: 480,
      closingTimeInMinutes: 1020,
      availableDaysOfWeek: [1, 2, 3, 4, 5],
      is24h: false,
    },
    location: {
      streetAddress: 'Quadra 01, Área Especial',
      neighborhood: 'Valparaíso I',
      city: 'Valparaíso de Goiás',
      state: 'GO',
      geolocation: {
        latitude: -16.0683,
        longitude: -47.986,
      },
    },
    specialties: ['Clínica Geral', 'Pediatria', 'Ginecologia'],
  },
  {
    id: 2,
    name: 'UPA 24h Céu Azul',
    type: 'UPA',
    schedule: {
      openingTimeInMinutes: 0,
      closingTimeInMinutes: 1439,
      availableDaysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      is24h: true,
    },
    location: {
      streetAddress: 'Av. dos Ipês, Quadra 15',
      neighborhood: 'Céu Azul',
      city: 'Valparaíso de Goiás',
      state: 'GO',
      geolocation: {
        latitude: -16.075,
        longitude: -48.0015,
      },
    },
    specialties: ['Clínica Geral', 'Ortopedia', 'Cardiologia'],
  },
  {
    id: 3,
    name: 'Hospital Municipal de Urgência',
    type: 'Hospital',
    schedule: {
      openingTimeInMinutes: 0,
      closingTimeInMinutes: 1439,
      availableDaysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      is24h: true,
    },
    location: {
      streetAddress: 'Rua do Comércio, Setor Central',
      neighborhood: 'Setor Central',
      city: 'Valparaíso de Goiás',
      state: 'GO',
      geolocation: {
        latitude: -16.0601,
        longitude: -47.9755,
      },
    },
    specialties: ['Clínica Geral', 'Cirurgia', 'Pediatria', 'Traumatologia'],
  },
  {
    id: 4,
    name: 'UBS Novo Oriente',
    type: 'UBS',
    schedule: {
      openingTimeInMinutes: 540,
      closingTimeInMinutes: 1080,
      availableDaysOfWeek: [1, 2, 3, 4, 5],
      is24h: false,
    },
    location: {
      streetAddress: 'Quadra 47',
      neighborhood: 'Novo Oriente',
      city: 'Valparaíso de Goiás',
      state: 'GO',
      geolocation: {
        latitude: -16.0822,
        longitude: -47.995,
      },
    },
    specialties: ['Odontologia', 'Psicologia', 'Ginecologia'],
  },
];

describe('Função [ filterHealthUnits ] (Filtragem de Unidades de Saúde)', () => {
  test('Deve filtrar a lista inicial por tipo de unidade', () => {
    const filters = { type: 'UBS' };
    const filtered = filterHealthUnits(mockData, filters);

    expect(filtered.every((unit) => unit.type === 'UBS')).toBe(true);
    expect(filtered.length).toBe(2);
  });

  test('Deve filtrar a lista inicial por especialidade médica', () => {
    const filters = { specialties: ['Clínica Geral'] };
    const filtered = filterHealthUnits(mockData, filters);

    expect(filtered.every((unit) => unit.specialties.includes('Clínica Geral'))).toBe(true);
    expect(filtered.length).toBe(3);
  });

  test('Deve filtrar a lista inicial por tipo e especialidade simultaneamente', () => {
    const filters = { type: 'UBS', specialties: ['Pediatria'] };
    const filtered = filterHealthUnits(mockData, filters);

    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe(1);
    expect(filtered[0].type).toBe('UBS');
    expect(filtered[0].specialties).toContain('Pediatria');
  });

  test('Deve retornar todas as unidades se nenhuma especialidade for definida', () => {
    const filters = { specialties: null };
    const filtered = filterHealthUnits(mockData, filters);

    expect(filtered).toEqual(mockData);
  });

  test('Deve retornar um array vazio se a especialidade solicitada não existir em nenhuma unidade', () => {
    const filters = { specialties: ['Especialidade Médica Genérica'] };
    const filtered = filterHealthUnits(mockData, filters);

    expect(filtered).toEqual([]);
  });

  test('Deve retornar um array vazio quando a lista inicial estiver vazia', () => {
    const filters = { specialties: ['Pediatria'] };
    const emptyMockData = [];
    const filtered = filterHealthUnits(emptyMockData, filters);

    expect(filtered).toEqual([]);
  });
});
