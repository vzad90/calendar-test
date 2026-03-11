import { type Request, type Response } from 'express';
import { isDbConfigured, getSql } from '../db/client.js';

export async function getHealth(_req: Request, res: Response): Promise<void> {
  let db: 'connected' | 'not configured' | 'error' = 'not configured';
  let hasDbError = false;

  if (isDbConfigured()) {
    try {
      await getSql()`SELECT 1`;
      db = 'connected';
    } catch {
      db = 'error';
      hasDbError = true;
    }
  }

  const body = { status: 'ok', message: 'Calendar API is running', db };

  if (hasDbError) {
    res.status(503).json(body);
    return;
  }

  res.json(body);
}
