import { Router } from 'express';
import {
  getUsersController,
  getUserByIdController,
  createUserController,
  updateUserController,
  deleteUserController,
} from '../controllers/userController';

const router = Router();

// GET /api/v1/users - Get all users with optional filtering
router.get('/', getUsersController);

// GET /api/v1/users/:id - Get user by ID
router.get('/:id', getUserByIdController);

// POST /api/v1/users - Create new user
router.post('/', createUserController);

// PUT /api/v1/users/:id - Update user
router.put('/:id', updateUserController);

// DELETE /api/v1/users/:id - Deactivate user (soft delete)
router.delete('/:id', deleteUserController);

export default router;
