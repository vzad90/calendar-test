import express from 'express';
import cors from 'cors';
import { registerRoutes } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { connectDb } from './db/connect.js';

let dbInit: Promise<void> | null = null;
function ensureDb(): Promise<void> {
  if (!dbInit) dbInit = connectDb();
  return dbInit;
}

export function createApp(): express.Express {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use((_req, _res, next) => {
    ensureDb().then(() => next(), (err) => next(err));
  });

  registerRoutes(app);
  app.use(errorHandler);

  return app;
}
