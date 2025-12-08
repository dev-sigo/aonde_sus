import { jest } from '@jest/globals';

global.console.error = jest.fn();
global.fetch = jest.fn();

import { getHealthUnitsData } from '../assets/js/app.js';

const mockData = [
  {
    id: 1,
    name: 'UBS Central de Valparaíso',
    type: 'UBS',
    coords: [-16.0683, -47.986],
    hours: 'Seg-Sex, 08:00 - 17:00',
    address: 'Quadra 01, Área Especial, Valparaíso I',
  },
  {
    id: 2,
    name: 'UPA 24h Céu Azul',
    type: 'UPA',
    coords: [-16.075, -48.0015],
    hours: '24 horas',
    address: 'Av. dos Ipês, Quadra 15, Céu Azul',
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
