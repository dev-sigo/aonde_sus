import { afterEach, beforeEach, describe, expect, jest } from '@jest/globals';
import { filterHealthUnits } from '../../assets/js/healthUnitsFilter.js';
import { mockData, workingTimeMockData } from '../fixtures/mockData/healthUnitsFilter.js';

describe('Função [ filterHealthUnits ]', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Critérios Básicos (Tipo e Especialidade)', () => {
    const testCases = [
      {
        scenario: 'apenas por tipo (UBS)',
        filters: { type: 'UBS' },
        expectedCount: 2,
        validator: (units) => units.every((unit) => unit.type === 'UBS'),
      },
      {
        scenario: 'apenas por especialidade (Clínica Geral)',
        filters: { specialties: ['Clínica Geral'] },
        expectedCount: 3,
        validator: (units) => units.every((unit) => unit.specialties.includes('Clínica Geral')),
      },
      {
        scenario: 'por tipo e especialidade combinados',
        filters: { type: 'UBS', specialties: ['Pediatria'] },
        expectedCount: 1,
        validator: (units) => units[0].id === 1 && units[0].type === 'UBS',
      },
      {
        scenario: 'retornando tudo se o filtro for nulo',
        filters: undefined,
        expectedCount: mockData.length,
        validator: (units) => units.length === mockData.length,
      },
    ];

    test.each(testCases)('Deve filtrar $scenario', ({ filters, expectedCount, validator }) => {
      const result = filterHealthUnits(mockData, filters);

      expect(result).toHaveLength(expectedCount);
      expect(validator(result)).toBe(true);
    });

    test('Deve lidar graciosamente com lista de dados vazia', () => {
      const result = filterHealthUnits([], { type: 'UBS' });
      expect(result).toEqual([]);
    });
  });

  describe('Critério Temporal (Horário de Funcionamento)', () => {
    beforeEach(() => jest.useFakeTimers());

    afterEach(() => jest.useRealTimers());

    function simulateDate({ day, month, year, hours, minutes }) {
      const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
      jest.setSystemTime(date);
    }

    test('Cenário 1: Madrugada de Quarta-feira (03:00 UTC) - Apenas 24h deve estar aberto', () => {
      simulateDate({ day: 10, month: 12, year: 2025, hours: 3, minutes: 0 });

      const result = filterHealthUnits(workingTimeMockData, { isOpenNow: true });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('24h-unit');
    });

    test('Cenário 2: Horário Comercial de Quarta-feira (10:00 UTC) - Unidades de dia e 24h', () => {
      simulateDate({ day: 10, month: 12, year: 2025, hours: 10, minutes: 0 });

      const result = filterHealthUnits(workingTimeMockData, { isOpenNow: true });
      const ids = result.map((unit) => unit.id);

      expect(result).toHaveLength(2);
      expect(ids).toContain('24h-unit');
      expect(ids).toContain('business-hours');
      expect(ids).not.toContain('weekend-only');
    });

    test('Cenário 3: Fim de Semana durante o dia (Sábado 14:00 UTC) - Plantão e 24h', () => {
      simulateDate({ day: 13, month: 12, year: 2025, hours: 14, minutes: 0 });

      const result = filterHealthUnits(workingTimeMockData, { isOpenNow: true });
      const ids = result.map((unit) => unit.id);

      expect(result).toHaveLength(2);
      expect(ids).toContain('24h-unit');
      expect(ids).toContain('weekend-only');
      expect(ids).not.toContain('business-hours');
    });

    test('Cenário 4: Limite de Horário - Logo após o fechamento de UBS Comercial (18:01 UTC)', () => {
      simulateDate({ day: 10, month: 12, year: 2025, hours: 18, minutes: 1 });

      const result = filterHealthUnits(workingTimeMockData, { isOpenNow: true });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('24h-unit');
    });

    test('Cenário 5: Filtro "Aberto Agora" desligado deve retornar todas as unidades (4)', () => {
      simulateDate({ day: 10, month: 12, year: 2025, hours: 3, minutes: 0 });

      const result = filterHealthUnits(workingTimeMockData, { isOpenNow: false });

      expect(result).toHaveLength(workingTimeMockData.length);
    });
  });
});
