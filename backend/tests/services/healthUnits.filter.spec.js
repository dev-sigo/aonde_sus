import { filterHealthUnits } from '../../src/services/healthUnits.service';
import {
  mockHealthUnits,
  unitWithInvalidSpecialties,
  unitWithoutSpecialties,
  unitWithoutType,
} from '../fixtures/healthUnit.fixture';
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';

describe('Como as unidades de saúde são filtradas', () => {
  describe('Quando nenhum critério de filtragem é informado', () => {
    test('deve retornar todas as unidades quando nenhum critério é informado', () => {
      const result = filterHealthUnits(mockHealthUnits);
      expect(result).toEqual(mockHealthUnits);
    });
  });

  describe('Quando o tipo da unidade é informado', () => {
    test('deve retornar apenas unidades do tipo informado', () => {
      const result = filterHealthUnits(mockHealthUnits, { type: 'UBS' });
      expect(result).toEqual([mockHealthUnits[0], mockHealthUnits[3]]);
    });

    test('deve retornar uma lista vazia quando não existir nenhuma unidade desse tipo', () => {
      const result = filterHealthUnits(mockHealthUnits, { type: 'Fictício' });
      expect(result).toEqual([]);
    });

    test('deve desconsiderar unidades que não informam seu tipo', () => {
      const result = filterHealthUnits([...mockHealthUnits, unitWithoutType], { type: 'UBS' });
      expect(result).toEqual([mockHealthUnits[0], mockHealthUnits[3]]);
    });
  });

  describe('Quando especialidades médicas são informadas', () => {
    test('deve retornar unidades que oferecem ao menos uma das especialidades informadas', () => {
      const result = filterHealthUnits(mockHealthUnits, { specialties: ['Odontologia', 'Cardiologia'] });
      expect(result).toEqual([mockHealthUnits[1], mockHealthUnits[3]]);
    });

    test('deve retornar uma lista vazia quando nenhuma unidade oferece as especialidades informadas', () => {
      const result = filterHealthUnits(mockHealthUnits, { specialties: ['Neurologia'] });
      expect(result).toEqual([]);
    });

    test('deve desconsiderar unidades que não informam suas especialidades', () => {
      const result = filterHealthUnits([...mockHealthUnits, unitWithoutSpecialties], {
        specialties: ['Clínica Geral'],
      });

      expect(result.every((unit) => Array.isArray(unit.specialties))).toBe(true);
    });

    test('deve desconsiderar unidades com informações de especialidades inválidas', () => {
      const result = filterHealthUnits([...mockHealthUnits, unitWithInvalidSpecialties], {
        specialties: ['Clínica Geral'],
      });

      expect(result.every((unit) => Array.isArray(unit.specialties))).toBe(true);
    });
  });

  describe('Quando tipo e especialidades são informados ao mesmo tempo', () => {
    test('deve retornar apenas unidades que atendem a todos os critérios informados', () => {
      const result = filterHealthUnits(mockHealthUnits, { type: 'UBS', specialties: ['Ginecologia'] });
      expect(result).toEqual([mockHealthUnits[0], mockHealthUnits[3]]);
    });

    test('deve retornar uma lista vazia quando nenhuma unidade atende a todos os critérios', () => {
      const result = filterHealthUnits(mockHealthUnits, { type: 'UPA', specialties: ['Psicologia'] });
      expect(result).toEqual([]);
    });
  });

  describe('Quando o usuário quer ver apenas unidades abertas no momento', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    function simulateDate({ day, month, year, hours, minutes }) {
      const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
      jest.setSystemTime(date);
    }

    test('deve considerar aberta qualquer unidade que funcione 24 horas, independentemente do horário atual', () => {
      simulateDate({ day: 10, month: 12, year: 2025, hours: 3, minutes: 0 });

      const result = filterHealthUnits(mockHealthUnits, { isOpenNow: true });

      expect(result).toEqual(expect.arrayContaining(mockHealthUnits.filter((unit) => unit.schedule?.is24h === true)));
      expect(result.every((unit) => unit.schedule?.is24h === true)).toBe(true);
    });

    test('deve considerar aberta uma unidade apenas se o horário atual estiver dentro do seu período de funcionamento', () => {
      simulateDate({ day: 10, month: 12, year: 2025, hours: 10, minutes: 0 });

      const nowInMinutes = 10 * 60;

      const result = filterHealthUnits(mockHealthUnits, { isOpenNow: true });

      result.forEach((unit) => {
        if (unit.schedule?.is24h) return;

        const { openingTimeInMinutes, closingTimeInMinutes } = unit.schedule;

        expect(nowInMinutes).toBeGreaterThanOrEqual(openingTimeInMinutes);
        expect(nowInMinutes).toBeLessThanOrEqual(closingTimeInMinutes);
      });
    });

    test('deve desconsiderar unidades que não informam horário de funcionamento', () => {
      simulateDate({ day: 10, month: 12, year: 2025, hours: 10, minutes: 0 });

      const result = filterHealthUnits(mockHealthUnits, { isOpenNow: true });

      expect(result.every((unit) => unit.schedule !== undefined)).toBe(true);
    });

    test('quando a opção de filtrar por unidades abertas não é utilizada, nenhuma unidade deve ser removida pelo horário', () => {
      const result = filterHealthUnits(mockHealthUnits, { isOpenNow: false });
      expect(result).toEqual(mockHealthUnits);
    });
  });

  describe('Quando não há dados válidos de unidades de saúde', () => {
    test('deve retornar uma lista vazia quando nenhuma unidade é informada', () => {
      const result = filterHealthUnits(undefined, { type: 'UBS' });
      expect(result).toEqual([]);
    });

    test('deve retornar uma lista vazia quando os dados das unidades estão em formato inválido', () => {
      const result = filterHealthUnits(unitWithInvalidSpecialties, { specialties: ['Clínica Geral'] });
      expect(result).toEqual([]);
    });
  });
});
