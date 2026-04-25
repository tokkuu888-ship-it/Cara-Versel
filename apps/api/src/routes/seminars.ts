import { Router } from 'express';
import {
  getSeminarWindowsController,
  createSeminarWindowController,
  getSeminarSessionsController,
  createSeminarSessionController,
  updateSeminarSessionController,
  addAttendeeToSessionController,
  removeAttendeeFromSessionController,
} from '../controllers/seminarController';

const router = Router();

// Seminar Windows routes
router.get('/windows', getSeminarWindowsController);
router.post('/windows', createSeminarWindowController);

// Seminar Sessions routes
router.get('/sessions', getSeminarSessionsController);
router.post('/sessions', createSeminarSessionController);
router.put('/sessions/:id', updateSeminarSessionController);
router.post('/sessions/:id/attendees', addAttendeeToSessionController);
router.delete('/sessions/:id/attendees', removeAttendeeFromSessionController);

export default router;
