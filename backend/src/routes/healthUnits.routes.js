import { Router } from 'express';
import { listSpecialties, listUnitTypes, listHealthUnits } from '../controllers/healthUnits.controller.js';

const router = Router();

router.get('/specialties', listSpecialties);
router.get('/unit-types', listUnitTypes);
router.get('/health-units', listHealthUnits);

export default router;
