import { Router } from 'express';
import {
  getProgressReportsController,
  getProgressReportByIdController,
  createProgressReportController,
  updateProgressReportController,
  submitProgressReportController,
  approveProgressReportController,
  rejectProgressReportController,
  requestRevisionProgressReportController,
} from '../controllers/progressController';

const router = Router();

// Progress Reports routes
router.get('/', getProgressReportsController);
router.get('/:id', getProgressReportByIdController);
router.post('/', createProgressReportController);
router.put('/:id', updateProgressReportController);

// Progress Report workflow actions
router.post('/:id/submit', submitProgressReportController);
router.post('/:id/approve', approveProgressReportController);
router.post('/:id/reject', rejectProgressReportController);
router.post('/:id/request-revision', requestRevisionProgressReportController);

export default router;
