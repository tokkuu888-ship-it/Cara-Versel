import { Router } from 'express';
import {
  getPilotPhasesController,
  getPilotPhaseByIdController,
  createPilotPhaseController,
  updatePilotPhaseController,
  getCurrentPilotPhaseController,
  getPilotPhaseProgressController,
  initializePilotProgramController,
} from '../controllers/pilotController';

const router = Router();

// Pilot Phases routes
router.get('/', getPilotPhasesController);
router.post('/', createPilotPhaseController);
router.get('/current', getCurrentPilotPhaseController);
router.post('/initialize', initializePilotProgramController);
router.get('/:id', getPilotPhaseByIdController);
router.put('/:id', updatePilotPhaseController);
router.get('/:id/progress', getPilotPhaseProgressController);

export default router;
