import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDataController = async (req: Request, res: Response) => {
  try {
    // Example: Fetch all users or any sample data
    const data = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10 // Limit to 10 records for demo
    });

    res.status(200).json({
      success: true,
      data,
      count: data.length
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch data from database'
      }
    });
  }
};
