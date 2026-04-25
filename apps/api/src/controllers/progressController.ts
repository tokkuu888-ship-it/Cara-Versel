import { Request, Response } from 'express';
import { PrismaClient, ReportStatus } from '@prisma/client';
import { createError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const getProgressReportsController = async (req: Request, res: Response) => {
  try {
    const { studentId, status, reviewerId } = req.query;
    
    const reports = await prisma.progressReport.findMany({
      where: {
        ...(studentId && { studentId: studentId as string }),
        ...(status && { status: status as ReportStatus }),
        ...(reviewerId && { reviewerId: reviewerId as string }),
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
          },
        },
        reviewer: {
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
      data: reports,
      count: reports.length,
    });
  } catch (error) {
    console.error('Error fetching progress reports:', error);
    throw createError('Failed to fetch progress reports', 500);
  }
};

export const getProgressReportByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const report = await prisma.progressReport.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!report) {
      throw createError('Progress report not found', 404);
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Error fetching progress report:', error);
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    throw createError('Failed to fetch progress report', 500);
  }
};

export const createProgressReportController = async (req: Request, res: Response) => {
  try {
    const { 
      title, 
      content, 
      achievements, 
      challenges, 
      nextSteps, 
      timeline, 
      studentId 
    } = req.body;

    // Validate student exists
    const student = await prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw createError('Student not found', 404);
    }

    const report = await prisma.progressReport.create({
      data: {
        title,
        content,
        achievements,
        challenges,
        nextSteps,
        timeline,
        studentId,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Error creating progress report:', error);
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    throw createError('Failed to create progress report', 500);
  }
};

export const updateProgressReportController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      content, 
      achievements, 
      challenges, 
      nextSteps, 
      timeline, 
      status,
      reviewComments,
      reviewerId 
    } = req.body;

    const updateData: any = {
      ...(title && { title }),
      ...(content && { content }),
      ...(achievements !== undefined && { achievements }),
      ...(challenges !== undefined && { challenges }),
      ...(nextSteps !== undefined && { nextSteps }),
      ...(timeline !== undefined && { timeline }),
      ...(status && { status: status as ReportStatus }),
      ...(reviewComments !== undefined && { reviewComments }),
    };

    // Add reviewer info if provided
    if (reviewerId) {
      updateData.reviewerId = reviewerId;
      updateData.reviewedAt = new Date();
    }

    const report = await prisma.progressReport.update({
      where: { id },
      data: updateData,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
          },
        },
        reviewer: {
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
      data: report,
    });
  } catch (error) {
    console.error('Error updating progress report:', error);
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    throw createError('Failed to update progress report', 500);
  }
};

export const submitProgressReportController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const report = await prisma.progressReport.update({
      where: { id },
      data: {
        status: ReportStatus.UNDER_REVIEW,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: report,
      message: 'Progress report submitted for review',
    });
  } catch (error) {
    console.error('Error submitting progress report:', error);
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    throw createError('Failed to submit progress report', 500);
  }
};

export const approveProgressReportController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reviewerId, reviewComments } = req.body;

    const report = await prisma.progressReport.update({
      where: { id },
      data: {
        status: ReportStatus.APPROVED,
        reviewerId,
        reviewComments,
        reviewedAt: new Date(),
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
          },
        },
        reviewer: {
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
      data: report,
      message: 'Progress report approved',
    });
  } catch (error) {
    console.error('Error approving progress report:', error);
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    throw createError('Failed to approve progress report', 500);
  }
};

export const rejectProgressReportController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reviewerId, reviewComments } = req.body;

    if (!reviewComments) {
      throw createError('Review comments are required for rejection', 400);
    }

    const report = await prisma.progressReport.update({
      where: { id },
      data: {
        status: ReportStatus.REJECTED,
        reviewerId,
        reviewComments,
        reviewedAt: new Date(),
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
          },
        },
        reviewer: {
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
      data: report,
      message: 'Progress report rejected',
    });
  } catch (error) {
    console.error('Error rejecting progress report:', error);
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    throw createError('Failed to reject progress report', 500);
  }
};

export const requestRevisionProgressReportController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reviewerId, reviewComments } = req.body;

    if (!reviewComments) {
      throw createError('Review comments are required for revision request', 400);
    }

    const report = await prisma.progressReport.update({
      where: { id },
      data: {
        status: ReportStatus.REVISION_REQUIRED,
        reviewerId,
        reviewComments,
        reviewedAt: new Date(),
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
          },
        },
        reviewer: {
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
      data: report,
      message: 'Revision requested for progress report',
    });
  } catch (error) {
    console.error('Error requesting revision for progress report:', error);
    if (error instanceof Error && 'statusCode' in error) {
      throw error;
    }
    throw createError('Failed to request revision for progress report', 500);
  }
};
