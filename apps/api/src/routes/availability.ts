import { Router } from 'express';
import {
  getAvailabilityPollsController,
  createAvailabilityPollController,
  getAvailabilityPollByIdController,
  submitAvailabilityResponseController,
  getAvailabilityResponsesController,
  closeAvailabilityPollController,
} from '../controllers/availabilityController';

const router = Router();

// Availability Polls routes
router.get('/polls', getAvailabilityPollsController);
router.post('/polls', createAvailabilityPollController);
router.get('/polls/:id', getAvailabilityPollByIdController);
router.post('/polls/:id/close', closeAvailabilityPollController);

// Availability Responses routes
router.get('/responses', getAvailabilityResponsesController);
router.post('/polls/:pollId/responses', submitAvailabilityResponseController);

export default router;
