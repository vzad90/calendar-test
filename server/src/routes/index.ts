import { type Express, Router } from 'express';
import { getHealth } from './health.js';

export function registerRoutes(app: Express): void {
  const api = Router();
  api.get('/', getHealth);
  app.use('/api', api);
  app.get('/', getHealth);
}
