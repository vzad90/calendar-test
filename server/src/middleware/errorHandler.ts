import { type Request, type Response, type NextFunction } from 'express';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(err);
  const status = 'statusCode' in err && typeof (err as { statusCode: number }).statusCode === 'number'
    ? (err as { statusCode: number }).statusCode
    : 500;
  res.status(status).json({
    error: err.message ?? 'Internal server error',
  });
}
