import { jest } from '@jest/globals';

global.console.error = jest.fn();
global.fetch = jest.fn();

import { getHealthUnitsData } from '../assets/js/app.js';

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
];

describe('Load data', () => {
  beforeEach(() => {
    fetch.mockClear();
    console.error.mockClear();
  });

  test('should fetch the data.json file and return the parsed content', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const units = await getHealthUnitsData();

    expect(fetch).toHaveBeenCalledWith('./assets/js/data.json');
    expect(units).toEqual(mockData);
    expect(units.length).toBe(2);
  });

  test('should return an empty array and log an error if the fetch call fails (network issue)', async () => {
    const networkError = new Error('Failed to fetch data due to network issues');
    fetch.mockRejectedValueOnce(networkError);

    const units = await getHealthUnitsData();

    expect(units).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Error loading health units data:', networkError);
  });

  test('should return an empty array and log error if the HTTP response is not ok (e.g., 404)', async () => {
    const httpError = new Error('HTTP error 404 (Not Found)');
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({}),
    });

    const units = await getHealthUnitsData();

    expect(units).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Error loading health units data:', httpError);
  });
});
