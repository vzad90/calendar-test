import { type Request, type Response } from 'express';
import { isDbConfigured, getSql } from '../db/client.js';

export async function getHealth(_req: Request, res: Response): Promise<void> {
  let db: 'connected' | 'not configured' | 'error' = 'not configured';
  if (isDbConfigured()) {
    try {
      await getSql()`SELECT 1`;
      db = 'connected';
    } catch {
      db = 'error';
    }
  }
  res.json({ status: 'ok', message: 'Calendar API is running', db });
}
