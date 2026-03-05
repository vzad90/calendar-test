import express from 'express';
import cors from 'cors';
import { registerRoutes } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp(): express.Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  registerRoutes(app);
  app.use(errorHandler);

  return app;
}
