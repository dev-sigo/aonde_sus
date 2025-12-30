import { jest } from '@jest/globals';
import request from 'supertest';

jest.unstable_mockModule('../../src/services/healthUnits.service.js', () => ({
  getAllSpecialties: jest.fn(),
  getUnitTypes: jest.fn(),
  getUnitsData: jest.fn(),
  filterHealthUnits: jest.fn(),
}));

const { app } = await import('../../src/app.js');
const { getAllSpecialties, getUnitTypes, getUnitsData, filterHealthUnits } =
  await import('../../src/services/healthUnits.service.js');

describe('Respostas da API para consultas', () => {
  describe('Quando a API é consultada para listar especialidades médicas', () => {
    beforeEach(() => {
      getAllSpecialties.mockClear();
    });

    test('deve buscar a lista de especialidades médicas disponíveis', async () => {
      await request(app).get('/specialties');
      expect(getAllSpecialties).toHaveBeenCalledTimes(1);
    });

    test('deve apresentar exatamente a lista de especialidades médicas encontrada', async () => {
      const specialtiesFromService = ['Clínica Geral', 'Pediatria'];
      getAllSpecialties.mockReturnValue(specialtiesFromService);

      const response = await request(app).get('/specialties');

      expect(response.body).toEqual(specialtiesFromService);
    });
  });

  describe('Quando a API é consultada para listar tipos de unidade', () => {
    beforeEach(() => {
      getUnitTypes.mockClear();
    });

    test('deve buscar a lista de tipos de unidade disponíveis', async () => {
      await request(app).get('/unit-types');
      expect(getUnitTypes).toHaveBeenCalledTimes(1);
    });

    test('deve apresentar exatamente a lista de tipos de unidade encontrada', async () => {
      const unitTypesFromService = ['UBS', 'UPA'];
      getUnitTypes.mockReturnValue(unitTypesFromService);

      const response = await request(app).get('/unit-types');

      expect(response.body).toEqual(unitTypesFromService);
    });
  });

  describe('Quando a API é consultada para listar unidades de saúde', () => {
    beforeEach(() => {
      filterHealthUnits.mockClear();
      getUnitsData.mockReturnValue([]);
    });

    test('deve repassar os critérios informados ao serviço de filtragem', async () => {
      const unitsFromService = [{ id: 1 }, { id: 2 }];
      filterHealthUnits.mockReturnValue(unitsFromService);

      const response = await request(app).get('/health-units?type=UBS&isOpenNow=true');

      expect(filterHealthUnits).toHaveBeenCalledTimes(1);
      expect(filterHealthUnits).toHaveBeenCalledWith(expect.any(Array), {
        type: 'UBS',
        isOpenNow: true,
      });

      expect(response.body).toEqual(unitsFromService);
    });
  });
});
