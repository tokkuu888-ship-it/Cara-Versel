import { Request, Response } from 'express';
import { PrismaClient, SessionStatus, SeminarPhase } from '@prisma/client';
import { createError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const getSeminarWindowsController = async (req: Request, res: Response) => {
  try {
    const { isActive } = req.query;
    
    const windows = await prisma.seminarWindow.findMany({
      where: {
        ...(isActive !== undefined && { isActive: isActive === 'true' }),
      },
      include: {
        sessions: {
          select: {
            id: true,
            title: true,
            scheduledAt: true,
            status: true,
            phase: true,
          },
          orderBy: {
            scheduledAt: 'asc',
          },
        },
        _count: {
          select: {
            sessions: true,
            polls: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      data: windows,
      count: windows.length,
    });
  } catch (error) {
    console.error('Error fetching seminar windows:', error);
    throw createError('Failed to fetch seminar windows', 500);
  }
};

export const createSeminarWindowController = async (req: Request, res: Response) => {
  try {
    const { title, description, startDate, endDate } = req.body;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      throw createError('Start date must be before end date', 400);
    }

    const window = await prisma.seminarWindow.create({
      data: {
        title,
        description,
        startDate: start,
        endDate: end,
      },
      include: {
        _count: {
          select: {
            sessions: true,
            polls: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: window,
    });
  } catch (error) {
    console.error('Error creating seminar window:', error);
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    throw createError('Failed to create seminar window', 500);
  }
};

export const getSeminarSessionsController = async (req: Request, res: Response) => {
  try {
    const { windowId, status, phase } = req.query;
    
    const sessions = await prisma.seminarSession.findMany({
      where: {
        ...(windowId && { windowId: windowId as string }),
        ...(status && { status: status as SessionStatus }),
        ...(phase && { phase: phase as SeminarPhase }),
      },
      include: {
        window: {
          select: {
            id: true,
            title: true,
            startDate: true,
            endDate: true,
          },
        },
        presentations: {
          include: {
            presenter: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        attendees: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        _count: {
          select: {
            feedback: true,
          },
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });

    res.status(200).json({
      success: true,
      data: sessions,
      count: sessions.length,
    });
  } catch (error) {
    console.error('Error fetching seminar sessions:', error);
    throw createError('Failed to fetch seminar sessions', 500);
  }
};

export const createSeminarSessionController = async (req: Request, res: Response) => {
  try {
    const { 
      title, 
      description, 
      scheduledAt, 
      duration = 90, 
      location, 
      isHybrid = false, 
      hybridLink, 
      windowId 
    } = req.body;

    // Validate window exists
    const window = await prisma.seminarWindow.findUnique({
      where: { id: windowId },
    });

    if (!window) {
      throw createError('Seminar window not found', 404);
    }

    // Validate scheduled date is within window
    const scheduledDate = new Date(scheduledAt);
    if (scheduledDate < window.startDate || scheduledDate > window.endDate) {
      throw createError('Scheduled date must be within seminar window', 400);
    }

    const session = await prisma.seminarSession.create({
      data: {
        title,
        description,
        scheduledAt: scheduledDate,
        duration,
        location,
        isHybrid,
        hybridLink,
        windowId,
      },
      include: {
        window: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Error creating seminar session:', error);
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    throw createError('Failed to create seminar session', 500);
  }
};

export const updateSeminarSessionController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, scheduledAt, duration, location, isHybrid, hybridLink, status, phase } = req.body;

    const session = await prisma.seminarSession.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
        ...(duration && { duration }),
        ...(location !== undefined && { location }),
        ...(isHybrid !== undefined && { isHybrid }),
        ...(hybridLink !== undefined && { hybridLink }),
        ...(status && { status: status as SessionStatus }),
        ...(phase && { phase: phase as SeminarPhase }),
      },
      include: {
        window: {
          select: {
            id: true,
            title: true,
          },
        },
        presentations: {
          include: {
            presenter: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Error updating seminar session:', error);
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    throw createError('Failed to update seminar session', 500);
  }
};

export const addAttendeeToSessionController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Validate user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw createError('User not found', 404);
    }

    const session = await prisma.seminarSession.update({
      where: { id },
      data: {
        attendees: {
          connect: { id: userId },
        },
      },
      include: {
        attendees: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: session,
      message: 'Attendee added successfully',
    });
  } catch (error) {
    console.error('Error adding attendee to session:', error);
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    throw createError('Failed to add attendee to session', 500);
  }
};

export const removeAttendeeFromSessionController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const session = await prisma.seminarSession.update({
      where: { id },
      data: {
        attendees: {
          disconnect: { id: userId },
        },
      },
      include: {
        attendees: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: session,
      message: 'Attendee removed successfully',
    });
  } catch (error) {
    console.error('Error removing attendee from session:', error);
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    throw createError('Failed to remove attendee from session', 500);
  }
};
