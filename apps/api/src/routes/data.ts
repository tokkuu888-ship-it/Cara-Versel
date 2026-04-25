import { Router } from 'express';
import { getDataController } from '../controllers/dataController';

const router = Router();

// GET /api/v1/data - Fetch data from Postgres database
router.get('/data', getDataController);

export default router;
