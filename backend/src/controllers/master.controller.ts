import { Request, Response } from 'express';
import { prisma } from '../prisma';



export const getLoadingDocks = async (req: Request, res: Response) => {
  try {
    const docks = await prisma.loading_docks.findMany({
      orderBy: { id: 'asc' }
    });
    return res.status(200).json({ status: 'success', data: docks });
  } catch (error: any) {
    console.error('[Get Docks Error]', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getTimeSlots = async (req: Request, res: Response) => {
  try {
    const timeSlots = await prisma.time_slots.findMany({
      orderBy: { jam_mulai: 'asc' }
    });
    return res.status(200).json({ status: 'success', data: timeSlots });
  } catch (error: any) {
    console.error('[Get TimeSlots Error]', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
