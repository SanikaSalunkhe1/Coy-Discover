import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import mongoose from 'mongoose';

export const swipeSchema = z.object({
  profileId: z
    .string({ required_error: 'profileId is required' })
    .min(1, 'profileId cannot be empty')
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid profileId format',
    }),
  action: z.enum(['like', 'pass'], {
    errorMap: () => ({ message: "Action must be either 'like' or 'pass'" }),
  }),
});

export function validateSwipeRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    req.body = swipeSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        error: error.errors[0]?.message || 'Validation failed',
      });
      return;
    }
    next(error);
  }
}

