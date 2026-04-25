import { Request, Response } from 'express';
import { PrismaClient, UserRole } from '@prisma/client';
import { createError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const getUsersController = async (req: Request, res: Response) => {
  try {
    const { role, department, isActive } = req.query;
    
    const users = await prisma.user.findMany({
      where: {
        ...(role && { role: role as UserRole }),
        ...(department && { department: { contains: department as string, mode: 'insensitive' } }),
        ...(isActive !== undefined && { isActive: isActive === 'true' }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.status(200).json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    throw createError('Failed to fetch users', 500);
  }
};

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw createError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    throw createError('Failed to fetch user', 500);
  }
};

export const createUserController = async (req: Request, res: Response) => {
  try {
    const { name, email, role = UserRole.PHD_CANDIDATE, department } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw createError('User with this email already exists', 409);
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role,
        department,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    throw createError('Failed to create user', 500);
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, role, department, isActive } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(role && { role }),
        ...(department !== undefined && { department }),
        ...(isActive !== undefined && { isActive }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    throw createError('Failed to update user', 500);
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete by setting isActive to false
    const user = await prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
      },
    });

    res.status(200).json({
      success: true,
      data: user,
      message: 'User deactivated successfully',
    });
  } catch (error) {
    console.error('Error deactivating user:', error);
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    throw createError('Failed to deactivate user', 500);
  }
};
