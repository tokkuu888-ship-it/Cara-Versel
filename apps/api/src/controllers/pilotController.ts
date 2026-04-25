import { Request, Response } from 'express';
import { PrismaClient, PilotPhaseStatus } from '@prisma/client';
import { createError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const getPilotPhasesController = async (req: Request, res: Response) => {
  try {
    const { isActive, phase } = req.query;
    
    const pilotPhases = await prisma.pilotPhase.findMany({
      where: {
        ...(isActive !== undefined && { isActive: isActive === 'true' }),
        ...(phase && { phase: phase as PilotPhaseStatus }),
      },
      orderBy: {
        startDate: 'asc',
      },
    });

    res.status(200).json({
      success: true,
      data: pilotPhases,
      count: pilotPhases.length,
    });
  } catch (error) {
    console.error('Error fetching pilot phases:', error);
    throw createError('Failed to fetch pilot phases', 500);
  }
};

export const getPilotPhaseByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const pilotPhase = await prisma.pilotPhase.findUnique({
      where: { id },
    });

    if (!pilotPhase) {
      throw createError('Pilot phase not found', 404);
    }

    res.status(200).json({
      success: true,
      data: pilotPhase,
    });
  } catch (error) {
    console.error('Error fetching pilot phase:', error);
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    throw createError('Failed to fetch pilot phase', 500);
  }
};

export const createPilotPhaseController = async (req: Request, res: Response) => {
  try {
    const { name, description, phase, startDate, endDate, objectives } = req.body;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      throw createError('Start date must be before end date', 400);
    }

    // Validate phase
    if (!Object.values(PilotPhaseStatus).includes(phase)) {
      throw createError('Invalid pilot phase', 400);
    }

    const pilotPhase = await prisma.pilotPhase.create({
      data: {
        name,
        description,
        phase,
        startDate: start,
        endDate: end,
        objectives: objectives || [],
      },
    });

    res.status(201).json({
      success: true,
      data: pilotPhase,
    });
  } catch (error) {
    console.error('Error creating pilot phase:', error);
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    throw createError('Failed to create pilot phase', 500);
  }
};

export const updatePilotPhaseController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, startDate, endDate, objectives, isActive } = req.body;

    const updateData: any = {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
      ...(objectives !== undefined && { objectives }),
      ...(isActive !== undefined && { isActive }),
    };

    // Validate dates if both are provided
    if (updateData.startDate && updateData.endDate) {
      if (updateData.startDate >= updateData.endDate) {
        throw createError('Start date must be before end date', 400);
      }
    }

    const pilotPhase = await prisma.pilotPhase.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      data: pilotPhase,
    });
  } catch (error) {
    console.error('Error updating pilot phase:', error);
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    throw createError('Failed to update pilot phase', 500);
  }
};

export const getCurrentPilotPhaseController = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    
    const currentPhase = await prisma.pilotPhase.findFirst({
      where: {
        isActive: true,
        startDate: {
          lte: now,
        },
        endDate: {
          gte: now,
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    if (!currentPhase) {
      // Return the next upcoming phase if no current phase
      const nextPhase = await prisma.pilotPhase.findFirst({
        where: {
          isActive: true,
          startDate: {
            gt: now,
          },
        },
        orderBy: {
          startDate: 'asc',
        },
      });

      if (nextPhase) {
        res.status(200).json({
          success: true,
          data: {
            ...nextPhase,
            status: 'upcoming',
            daysUntilStart: Math.ceil((nextPhase.startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
          },
        });
      } else {
        res.status(200).json({
          success: true,
          data: null,
          message: 'No active or upcoming pilot phases found',
        });
      }
    } else {
      // Calculate progress through current phase
      const totalDays = Math.ceil((currentPhase.endDate.getTime() - currentPhase.startDate.getTime()) / (1000 * 60 * 60 * 24));
      const daysElapsed = Math.ceil((now.getTime() - currentPhase.startDate.getTime()) / (1000 * 60 * 60 * 24));
      const progressPercentage = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));
      const daysRemaining = Math.ceil((currentPhase.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      res.status(200).json({
        success: true,
        data: {
          ...currentPhase,
          status: 'active',
          progressPercentage,
          daysElapsed,
          daysRemaining,
          totalDays,
        },
      });
    }
  } catch (error) {
    console.error('Error fetching current pilot phase:', error);
    throw createError('Failed to fetch current pilot phase', 500);
  }
};

export const getPilotPhaseProgressController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const pilotPhase = await prisma.pilotPhase.findUnique({
      where: { id },
    });

    if (!pilotPhase) {
      throw createError('Pilot phase not found', 404);
    }

    const now = new Date();
    const isCurrentPhase = now >= pilotPhase.startDate && now <= pilotPhase.endDate;
    const isPastPhase = now > pilotPhase.endDate;
    const isFuturePhase = now < pilotPhase.startDate;

    let progressData: any = {
      phase: pilotPhase,
      status: isCurrentPhase ? 'active' : isPastPhase ? 'completed' : 'upcoming',
    };

    if (isCurrentPhase || isPastPhase) {
      const totalDays = Math.ceil((pilotPhase.endDate.getTime() - pilotPhase.startDate.getTime()) / (1000 * 60 * 60 * 24));
      const daysElapsed = Math.min(totalDays, Math.max(0, Math.ceil((now.getTime() - pilotPhase.startDate.getTime()) / (1000 * 60 * 60 * 24))));
      const progressPercentage = Math.min(100, (daysElapsed / totalDays) * 100);
      
      progressData = {
        ...progressData,
        totalDays,
        daysElapsed,
        progressPercentage,
        daysRemaining: isCurrentPhase ? Math.ceil((pilotPhase.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0,
      };
    } else {
      progressData.daysUntilStart = Math.ceil((pilotPhase.startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }

    // Get related seminar data for this phase
    const seminarStats = await prisma.$queryRaw`
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_sessions,
        COUNT(CASE WHEN status = 'SCHEDULED' THEN 1 END) as scheduled_sessions,
        COUNT(CASE WHEN status = 'CANCELLED' THEN 1 END) as cancelled_sessions
      FROM seminar_sessions 
      WHERE scheduledAt >= ${pilotPhase.startDate} 
      AND scheduledAt <= ${pilotPhase.endDate}
    `;

    const progressStats = await prisma.$queryRaw`
      SELECT 
        COUNT(*) as total_reports,
        COUNT(CASE WHEN status = 'APPROVED' THEN 1 END) as approved_reports,
        COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pending_reports,
        COUNT(CASE WHEN status = 'UNDER_REVIEW' THEN 1 END) as under_review_reports
      FROM progress_reports 
      WHERE submittedAt >= ${pilotPhase.startDate} 
      AND submittedAt <= ${pilotPhase.endDate}
    `;

    progressData.seminarStats = seminarStats[0] || {};
    progressData.progressStats = progressStats[0] || {};

    res.status(200).json({
      success: true,
      data: progressData,
    });
  } catch (error) {
    console.error('Error fetching pilot phase progress:', error);
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    throw createError('Failed to fetch pilot phase progress', 500);
  }
};

export const initializePilotProgramController = async (req: Request, res: Response) => {
  try {
    const { startDate } = req.body;
    const programStart = new Date(startDate);

    // Create the three pilot phases
    const orientationPhase = await prisma.pilotPhase.create({
      data: {
        name: 'Orientation Month',
        description: 'Informal meeting where a professor demonstrates an "Excellence in Defense" presentation',
        phase: PilotPhaseStatus.ORIENTATION,
        startDate: programStart,
        endDate: new Date(programStart.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days later
        objectives: [
          'Introduce seminar format and expectations',
          'Demonstrate high-quality defense presentation',
          'Establish peer review protocols',
          'Set up communication channels',
        ],
      },
    });

    const showcasePhase = await prisma.pilotPhase.create({
      data: {
        name: 'Senior Showcase',
        description: 'Final-year students present to provide a high-level model for junior candidates',
        phase: PilotPhaseStatus.SENIOR_SHOWCASE,
        startDate: new Date(programStart.getTime() + 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(programStart.getTime() + 60 * 24 * 60 * 60 * 1000), // 30 days later
        objectives: [
          'Showcase advanced presentation skills',
          'Model complex technical discussions',
          'Demonstrate effective peer feedback',
          'Establish mentorship relationships',
        ],
      },
    });

    const integrationPhase = await prisma.pilotPhase.create({
      data: {
        name: 'Full Integration',
        description: 'The bi-weekly rotation begins for all candidates',
        phase: PilotPhaseStatus.FULL_INTEGRATION,
        startDate: new Date(programStart.getTime() + 60 * 24 * 60 * 60 * 1000),
        endDate: new Date(programStart.getTime() + 90 * 24 * 60 * 60 * 1000), // 30 days later
        objectives: [
          'Implement regular seminar schedule',
          'Establish consistent progress monitoring',
          'Develop faculty-student collaboration',
          'Create sustainable seminar culture',
        ],
      },
    });

    res.status(201).json({
      success: true,
      data: {
        phases: [orientationPhase, showcasePhase, integrationPhase],
        message: 'Pilot program initialized successfully',
      },
    });
  } catch (error) {
    console.error('Error initializing pilot program:', error);
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    throw createError('Failed to initialize pilot program', 500);
  }
};
