import { type Express, Router } from 'express';
import { getHealth } from './health.js';
import { tasksRouter } from './tasks.js';

export function registerRoutes(app: Express): void {
  const api = Router();
  api.get('/', getHealth);
  api.use('/tasks', tasksRouter);
  app.use('/api', api);
  app.get('/', getHealth);
}
