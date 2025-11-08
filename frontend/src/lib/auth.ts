import { NextApiRequest } from 'next';
import { AppError } from './error-handler';

const API_KEYS = ['healthcare-admin-key', 'phc-staff-key'];

export const authenticate = (req: NextApiRequest) => {
  const apiKey = req.headers['x-api-key'] as string;
  
  if (!apiKey || !API_KEYS.includes(apiKey)) {
    throw new AppError('Unauthorized access', 401);
  }
  
  return { role: apiKey === 'healthcare-admin-key' ? 'admin' : 'staff' };
};

export const authorize = (requiredRole: string, userRole: string) => {
  if (requiredRole === 'admin' && userRole !== 'admin') {
    throw new AppError('Insufficient permissions', 403);
  }
};