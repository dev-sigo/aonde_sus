import { describe, expect, test } from '@jest/globals';
import { getUnitTypes, getAllSpecialties } from '../../src/services/healthUnits.service.js';
import {
  mockHealthUnits,
  unitWithoutType,
  unitWithoutSpecialties,
  unitWithInvalidSpecialties,
} from '../fixtures/healthUnit.fixture.js';

describe('Informações das unidades de saúde', () => {
  describe('Quando são solicitados os tipos de unidade existentes', () => {
    test('deve sempre retornar uma lista', () => {
      const result = getUnitTypes(mockHealthUnits);
      expect(Array.isArray(result)).toBe(true);
    });

    test('deve retornar apenas tipos únicos', () => {
      const result = getUnitTypes(mockHealthUnits);

      expect(result).toContain('UBS');
      expect(result).toContain('UPA');
      expect(result).toContain('Hospital');
      expect(result.length).toBe(3);
    });

    test('deve retornar os tipos em ordem alfabética', () => {
      const result = getUnitTypes(mockHealthUnits);
      expect(result).toEqual(['Hospital', 'UBS', 'UPA']);
    });

    test('deve retornar uma lista vazia quando a entrada não for válida', () => {
      expect(getUnitTypes(null)).toEqual([]);
      expect(getUnitTypes(undefined)).toEqual([]);
      expect(getUnitTypes({})).toEqual([]);
    });

    test('deve retornar uma lista vazia quando nenhuma unidade é informada', () => {
      const result = getUnitTypes([]);
      expect(result).toEqual([]);
    });

    test('deve ignorar unidades sem tipo definido', () => {
      const units = [...mockHealthUnits, unitWithoutType];
      const result = getUnitTypes(units);

      expect(result).toEqual(['Hospital', 'UBS', 'UPA']);
    });
  });

  describe('Quando são solicitadas as especialidades médicas disponíveis', () => {
    test('deve sempre fornecer a lista', () => {
      const result = getAllSpecialties(mockHealthUnits);
      expect(Array.isArray(result)).toBe(true);
    });

    test('deve garantir que cada especialidade apareça uma única vez', () => {
      const result = getAllSpecialties(mockHealthUnits);

      expect(result).toContain('Clínica Geral');
      expect(result).toContain('Pediatria');
      expect(result).toContain('Ginecologia');
      expect(result).toContain('Ortopedia');
      expect(result).toContain('Cardiologia');
      expect(result).toContain('Cirurgia');
      expect(result).toContain('Traumatologia');
      expect(result).toContain('Odontologia');
      expect(result).toContain('Psicologia');

      expect(result.length).toBe(9);
    });

    test('deve retornar as especialidades em ordem alfabética', () => {
      const result = getAllSpecialties(mockHealthUnits);

      expect(result).toEqual([
        'Cardiologia',
        'Cirurgia',
        'Clínica Geral',
        'Ginecologia',
        'Odontologia',
        'Ortopedia',
        'Pediatria',
        'Psicologia',
        'Traumatologia',
      ]);
    });

    test('deve retornar uma lista vazia quando a entrada não for válida', () => {
      expect(getAllSpecialties(null)).toEqual([]);
      expect(getAllSpecialties(undefined)).toEqual([]);
      expect(getAllSpecialties({})).toEqual([]);
    });

    test('deve retornar uma lista vazia quando nenhuma unidade de saúde é informada', () => {
      const result = getUnitTypes([]);
      expect(result).toEqual([]);
    });

    test('deve ignorar unidades sem especialidades', () => {
      const units = [...mockHealthUnits, unitWithoutSpecialties];
      const result = getAllSpecialties(units);

      expect(result).toEqual([
        'Cardiologia',
        'Cirurgia',
        'Clínica Geral',
        'Ginecologia',
        'Odontologia',
        'Ortopedia',
        'Pediatria',
        'Psicologia',
        'Traumatologia',
      ]);
    });

    test('deve desconsiderar dados inválidos', () => {
      const units = [...mockHealthUnits, unitWithInvalidSpecialties];

      const result = getAllSpecialties(units);

      expect(result).toContain('Clínica Geral');
      expect(result).not.toContain(undefined);
    });

    test('deve consolidar especialidades repetidas entre unidades', () => {
      const units = [{ specialties: ['Clínica Geral', 'Pediatria'] }, { specialties: ['Pediatria', 'Clínica Geral'] }];
      const result = getAllSpecialties(units);

      expect(result).toEqual(['Clínica Geral', 'Pediatria']);
    });
  });
});
