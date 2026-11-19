import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Avoid leaking private matching details, DB internals or stack traces
  const status = typeof err.status === 'number' ? err.status : 500;
  const message =
    status === 500
      ? 'An unexpected error occurred. Please try again later.'
      : err.message || 'Request failed';

  if (process.env.NODE_ENV !== 'production' && status === 500) {
    console.error('[Error]', err);
  }

  res.status(status).json({
    success: false,
    error: message,
  });
}

