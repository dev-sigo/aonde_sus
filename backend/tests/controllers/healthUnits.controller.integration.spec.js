import request from 'supertest';
import { app } from '../../src/app.js';
import { setUnitsData } from '../../src/services/healthUnits.service.js';
import { mockHealthUnits } from '../fixtures/healthUnit.fixture.js';

describe('Consultas públicas sobre unidades de saúde', () => {
  beforeEach(() => {
    setUnitsData(mockHealthUnits);
  });

  describe('Quando o usuário consulta as especialidades médicas', () => {
    test('deve responder com sucesso', async () => {
      const response = await request(app).get('/specialties');
      expect(response.status).toBe(200);
    });

    test('deve retornar uma lista de especialidades médicas', async () => {
      const response = await request(app).get('/specialties');

      expect(response.headers['content-type']).toContain('application/json');
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('deve retornar todas as especialidades existentes entre as unidades cadastradas', async () => {
      const response = await request(app).get('/specialties');

      expect(response.body).toEqual([
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

    test('deve retornar uma lista vazia quando não houver unidades cadastradas', async () => {
      setUnitsData([]);

      const response = await request(app).get('/specialties');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('deve considerar apenas especialidades corretamente informadas', async () => {
      setUnitsData([{ specialties: null }, { specialties: ['Clínica Geral'] }]);

      const response = await request(app).get('/specialties');

      expect(response.body).toEqual(['Clínica Geral']);
    });
  });

  describe('Quando o usuário consulta os tipos de unidade', () => {
    beforeEach(() => {
      setUnitsData(mockHealthUnits);
    });

    test('deve responder com sucesso', async () => {
      const response = await request(app).get('/unit-types');
      expect(response.status).toBe(200);
    });

    test('deve retornar uma lista de tipos de unidade', async () => {
      const response = await request(app).get('/unit-types');

      expect(response.headers['content-type']).toContain('application/json');
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('deve retornar todos os tipos existentes entre as unidades cadastradas', async () => {
      const response = await request(app).get('/unit-types');

      expect(response.body).toEqual(['Hospital', 'UBS', 'UPA']);
    });

    test('deve retornar uma lista vazia quando não existir nenhuma unidade cadastrada', async () => {
      setUnitsData([]);

      const response = await request(app).get('/unit-types');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('deve ignorar unidades que não informam seu tipo', async () => {
      setUnitsData([{ name: 'Sem tipo' }, { type: 'UBS' }]);

      const response = await request(app).get('/unit-types');

      expect(response.body).toEqual(['UBS']);
    });
  });

  describe('Quando o usuário consulta as unidades de saúde', () => {
    test('deve responder com sucesso', async () => {
      const response = await request(app).get('/health-units');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('deve retornar apenas unidades que atendem aos critérios informados', async () => {
      const response = await request(app).get('/health-units?type=UBS');

      expect(response.body.every((unit) => unit.type === 'UBS')).toBe(true);
    });

    test('deve permitir combinar critérios de filtragem', async () => {
      const response = await request(app).get('/health-units?type=UBS&specialties=Ginecologia');

      expect(response.body.every((unit) => unit.type === 'UBS' && unit.specialties?.includes('Ginecologia'))).toBe(
        true
      );
    });
  });
});
