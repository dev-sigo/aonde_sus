import { makeHealthUnit } from './healthUnit.factory.js';

export const ubsCentral = makeHealthUnit({
  id: 1,
  name: 'UBS Central',
  type: 'UBS',
  specialties: ['Clínica Geral', 'Pediatria', 'Ginecologia'],
  schedule: {
    is24h: false,
    availableDaysOfWeek: [1, 2, 3, 4, 5],
    openingTimeInMinutes: 480, // 08:00
    closingTimeInMinutes: 1080, // 18:00
  },
});

export const upaCeuAzul = makeHealthUnit({
  id: 2,
  name: 'UPA 24h Céu Azul',
  type: 'UPA',
  specialties: ['Clínica Geral', 'Ortopedia', 'Cardiologia'],
  schedule: {
    is24h: true,
    availableDaysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    openingTimeInMinutes: 0,
    closingTimeInMinutes: 1439,
  },
});

export const hospitalMunicipal = makeHealthUnit({
  id: 3,
  name: 'Hospital Municipal',
  type: 'Hospital',
  specialties: ['Clínica Geral', 'Cirurgia', 'Pediatria', 'Traumatologia'],
});

export const ubsNovoOriente = makeHealthUnit({
  id: 4,
  name: 'UBS Novo Oriente',
  type: 'UBS',
  specialties: ['Odontologia', 'Psicologia', 'Ginecologia'],
  schedule: {
    is24h: false,
    availableDaysOfWeek: [1, 2, 3, 4, 5],
    openingTimeInMinutes: 480, // 08:00
    closingTimeInMinutes: 1080, // 18:00
  },
});

export const mockHealthUnits = [ubsCentral, upaCeuAzul, hospitalMunicipal, ubsNovoOriente];

export const unitWithoutType = makeHealthUnit({
  id: 1001,
  type: undefined,
});

export const unitWithoutSpecialties = makeHealthUnit({
  id: 1002,
  specialties: undefined,
});

export const unitWithInvalidSpecialties = makeHealthUnit({
  id: 1003,
  specialties: 'Clínica Geral',
});
