import { Request, Response } from 'express';
import { PrismaClient, AvailabilityStatus } from '@prisma/client';
import { createError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const getAvailabilityPollsController = async (req: Request, res: Response) => {
  try {
    const { windowId, pollerId, status } = req.query;
    
    const polls = await prisma.availabilityPoll.findMany({
      where: {
        ...(windowId && { windowId: windowId as string }),
        ...(pollerId && { pollerId: pollerId as string }),
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
        poller: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        responses: {
          include: {
            respondent: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
        _count: {
          select: {
            responses: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      data: polls,
      count: polls.length,
    });
  } catch (error) {
    console.error('Error fetching availability polls:', error);
    throw createError('Failed to fetch availability polls', 500);
  }
};

export const createAvailabilityPollController = async (req: Request, res: Response) => {
  try {
    const { windowId, pollerId, title, description, deadline } = req.body;

    // Validate window exists
    const window = await prisma.seminarWindow.findUnique({
      where: { id: windowId },
    });

    if (!window) {
      throw createError('Seminar window not found', 404);
    }

    // Validate poller exists
    const poller = await prisma.user.findUnique({
      where: { id: pollerId },
    });

    if (!poller) {
      throw createError('Poller not found', 404);
    }

    // Validate deadline
    const deadlineDate = new Date(deadline);
    if (deadlineDate <= new Date()) {
      throw createError('Deadline must be in the future', 400);
    }

    const poll = await prisma.availabilityPoll.create({
      data: {
        windowId,
        pollerId,
        title,
        description,
        deadline: deadlineDate,
      },
      include: {
        window: {
          select: {
            id: true,
            title: true,
          },
        },
        poller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: poll,
    });
  } catch (error) {
    console.error('Error creating availability poll:', error);
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    throw createError('Failed to create availability poll', 500);
  }
};

export const getAvailabilityPollByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const poll = await prisma.availabilityPoll.findUnique({
      where: { id },
      include: {
        window: {
          select: {
            id: true,
            title: true,
            startDate: true,
            endDate: true,
          },
        },
        poller: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        responses: {
          include: {
            respondent: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!poll) {
      throw createError('Availability poll not found', 404);
    }

    res.status(200).json({
      success: true,
      data: poll,
    });
  } catch (error) {
    console.error('Error fetching availability poll:', error);
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    throw createError('Failed to fetch availability poll', 500);
  }
};

export const submitAvailabilityResponseController = async (req: Request, res: Response) => {
  try {
    const { pollId } = req.params;
    const { respondentId, status = AvailabilityStatus.AVAILABLE, preferredTimes, comments } = req.body;

    // Validate poll exists
    const poll = await prisma.availabilityPoll.findUnique({
      where: { id: pollId },
    });

    if (!poll) {
      throw createError('Availability poll not found', 404);
    }

    // Check if deadline has passed
    if (new Date() > poll.deadline) {
      throw createError('Poll deadline has passed', 400);
    }

    // Check if respondent already responded
    const existingResponse = await prisma.availabilityResponse.findUnique({
      where: {
        pollId_respondentId: {
          pollId,
          respondentId,
        },
      },
    });

    if (existingResponse) {
      // Update existing response
      const response = await prisma.availabilityResponse.update({
        where: { id: existingResponse.id },
        data: {
          status,
          preferredTimes: preferredTimes ? JSON.stringify(preferredTimes) : null,
          comments,
        },
        include: {
          respondent: {
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
        data: response,
        message: 'Availability response updated',
      });
    } else {
      // Create new response
      const response = await prisma.availabilityResponse.create({
        data: {
          pollId,
          respondentId,
          status,
          preferredTimes: preferredTimes ? JSON.stringify(preferredTimes) : null,
          comments,
        },
        include: {
          respondent: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      res.status(201).json({
        success: true,
        data: response,
        message: 'Availability response submitted',
      });
    }
  } catch (error) {
    console.error('Error submitting availability response:', error);
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    throw createError('Failed to submit availability response', 500);
  }
};

export const getAvailabilityResponsesController = async (req: Request, res: Response) => {
  try {
    const { pollId, respondentId, status } = req.query;
    
    const responses = await prisma.availabilityResponse.findMany({
      where: {
        ...(pollId && { pollId: pollId as string }),
        ...(respondentId && { respondentId: respondentId as string }),
        ...(status && { status: status as AvailabilityStatus }),
      },
      include: {
        poll: {
          select: {
            id: true,
            title: true,
            deadline: true,
          },
        },
        respondent: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      data: responses,
      count: responses.length,
    });
  } catch (error) {
    console.error('Error fetching availability responses:', error);
    throw createError('Failed to fetch availability responses', 500);
  }
};

export const closeAvailabilityPollController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const poll = await prisma.availabilityPoll.findUnique({
      where: { id },
      include: {
        responses: {
          include: {
            respondent: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!poll) {
      throw createError('Availability poll not found', 404);
    }

    // Calculate availability summary
    const availableCount = poll.responses.filter(r => r.status === AvailabilityStatus.AVAILABLE).length;
    const unavailableCount = poll.responses.filter(r => r.status === AvailabilityStatus.UNAVAILABLE).length;
    const tentativeCount = poll.responses.filter(r => r.status === AvailabilityStatus.TENTATIVE).length;

    const summary = {
      total: poll.responses.length,
      available: availableCount,
      unavailable: unavailableCount,
      tentative: tentativeCount,
      availabilityRate: poll.responses.length > 0 ? (availableCount / poll.responses.length) * 100 : 0,
    };

    res.status(200).json({
      success: true,
      data: {
        poll,
        summary,
      },
      message: 'Availability poll closed and summarized',
    });
  } catch (error) {
    console.error('Error closing availability poll:', error);
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    throw createError('Failed to close availability poll', 500);
  }
};
