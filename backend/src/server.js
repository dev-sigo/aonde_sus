import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';

import { app } from './app.js';
import { setUnitsData } from './services/healthUnits.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, 'data', 'healthUnits.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const healthUnitsData = JSON.parse(rawData);

setUnitsData(healthUnitsData);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
