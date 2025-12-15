export const mockData = [
  {
    id: 1,
    name: 'UBS Central de Valparaíso',
    type: 'UBS',
    schedule: {
      openingTimeInMinutes: 480, // 08:00
      closingTimeInMinutes: 1020, // 17:00
      availableDaysOfWeek: [1, 2, 3, 4, 5],
      is24h: false,
    },
    location: {},
    specialties: ['Clínica Geral', 'Pediatria', 'Ginecologia'],
  },
  {
    id: 2,
    name: 'UPA 24h Céu Azul',
    type: 'UPA',
    schedule: {
      openingTimeInMinutes: 0, // 00:00
      closingTimeInMinutes: 1439, // 23:59
      availableDaysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      is24h: true,
    },
    specialties: ['Clínica Geral', 'Ortopedia', 'Cardiologia'],
  },
  {
    id: 3,
    name: 'Hospital Municipal de Urgência',
    type: 'Hospital',
    schedule: {
      openingTimeInMinutes: 0, // 00:00
      closingTimeInMinutes: 1439, // 23:59
      availableDaysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      is24h: true,
    },
    specialties: ['Clínica Geral', 'Cirurgia', 'Pediatria', 'Traumatologia'],
  },
  {
    id: 4,
    name: 'UBS Novo Oriente',
    type: 'UBS',
    schedule: {
      openingTimeInMinutes: 540, // 09:00
      closingTimeInMinutes: 1080, // 18:00
      availableDaysOfWeek: [1, 2, 3, 4, 5],
      is24h: false,
    },
    specialties: ['Odontologia', 'Psicologia', 'Ginecologia'],
  },
];

export const workingTimeMockData = [
  {
    id: '24h-unit',
    name: 'Hospital 24h',
    schedule: {
      is24h: true,
      availableDaysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Dom-Sab
      openingTimeInMinutes: 0,
      closingTimeInMinutes: 1439,
    },
  },
  {
    id: 'business-hours',
    name: 'UBS Comercial',
    schedule: {
      is24h: false,
      availableDaysOfWeek: [1, 2, 3, 4, 5], // Seg-Sex
      openingTimeInMinutes: 480, // 08:00
      closingTimeInMinutes: 1080, // 18:00
    },
  },
  {
    id: 'weekend-only',
    name: 'Plantão Fim de Semana',
    schedule: {
      is24h: false,
      availableDaysOfWeek: [0, 6], // Dom, Sab
      openingTimeInMinutes: 480, // 08:00
      closingTimeInMinutes: 1200, // 20:00
    },
  },
];
