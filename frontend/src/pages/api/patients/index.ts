import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';
import { asyncHandler, AppError } from '@/lib/error-handler';
import { authenticate } from '@/lib/auth';
import { validatePatient, sanitizeInput } from '@/lib/validation';
import cache from '@/lib/cache';
import realtime from '@/lib/realtime';

export default asyncHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  const user = authenticate(req);

  if (req.method === 'GET') {
    const cacheKey = 'patients-list';
    let patients = cache.get(cacheKey);
    
    if (!patients) {
      patients = await prisma.patient.findMany();
      cache.set(cacheKey, patients);
    }
    
    res.status(200).json(patients);
  } else if (req.method === 'POST') {
    const validation = validatePatient(req.body);
    if (!validation.isValid) {
      throw new AppError(validation.errors.join(', '), 400);
    }

    const sanitizedData = {
      ...req.body,
      name: sanitizeInput(req.body.name)
    };

    const patient = await prisma.patient.create({ data: sanitizedData });
    cache.clear();
    realtime.notifyPatientUpdate(patient);
    
    res.status(201).json(patient);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
});