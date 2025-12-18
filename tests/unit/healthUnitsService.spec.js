import { afterEach, describe, jest, test } from '@jest/globals';
import { getHealthUnitsData, getAllSpecialties, getUnitTypes } from '../../assets/js/healthUnitsService.js';
import { mockHealthUnits } from '../fixtures/mockData/healthUnitsService.js';

describe('Função [ getHealthUnitsData ]', () => {
  beforeEach(() => {
    global.console.error = jest.fn();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    fetch.mockClear();
    console.error.mockClear();
  });

  test('Deve realizar o fetch e retornar os dados formatados corretamente', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockHealthUnits,
    });

    const result = await getHealthUnitsData();

    expect(fetch).toHaveBeenCalledWith('./assets/js/healthUnits.json');
    expect(result).toEqual(mockHealthUnits);
    expect(result.length).toBe(4);
  });

  test('Deve capturar erros de rede (Network Error) e retornar array vazio', async () => {
    const networkError = new Error('Falha de conexão');
    fetch.mockRejectedValueOnce(networkError);

    const result = await getHealthUnitsData();

    expect(result).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Error loading health units data:', networkError);
  });

  test('Deve tratar respostas HTTP não-sucesso (ex: 404, 500) retornando array vazio', async () => {
    // Simulamos uma resposta válida do fetch, mas com status de erro
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({}),
    });

    const result = await getHealthUnitsData();

    expect(result).toEqual([]);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Error loading health units data:'),
      expect.any(Error)
    );
  });
});

describe('Função [ getAllSpecialties ]', () => {
  test('Deve retornar lista única e ordenada de especialidades', () => {
    const expected = [
      'Cardiologia',
      'Cirurgia',
      'Clínica Geral',
      'Ginecologia',
      'Odontologia',
      'Ortopedia',
      'Pediatria',
      'Psicologia',
      'Traumatologia',
    ];
    const result = getAllSpecialties(mockHealthUnits);

    expect(result).toEqual(expected);
    expect(result).toHaveLength(expected.length);
  });

  test('Deve lidar robustamente com entradas inválidas (retornando array vazio)', () => {
    expect(getAllSpecialties([])).toEqual([]);
    expect(getAllSpecialties(null)).toEqual([]);
    expect(getAllSpecialties(undefined)).toEqual([]);
  });
});

describe('Função [ getUnitTypes ]', () => {
  test('Deve retornar lista única e ordenada de tipos de unidade', () => {
    const expected = ['Hospital', 'UBS', 'UPA'];
    const result = getUnitTypes(mockHealthUnits);

    expect(result).toEqual(expected);
  });

  test('Deve lidar robustamente com entradas inválidas (retornando array vazio)', () => {
    expect(getUnitTypes([])).toEqual([]);
    expect(getUnitTypes(null)).toEqual([]);
    expect(getUnitTypes(undefined)).toEqual([]);
  });
});
