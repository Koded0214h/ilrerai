import { NextApiResponse } from 'next';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

export const handleError = (error: any, res: NextApiResponse) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ error: error.message });
  }
  
  console.error(error);
  return res.status(500).json({ error: 'Internal server error' });
};

export const asyncHandler = (fn: Function) => (req: any, res: any, next?: any) => {
  Promise.resolve(fn(req, res, next)).catch((error) => handleError(error, res));
};