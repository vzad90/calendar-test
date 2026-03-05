import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDb } from './db/connect.js';

const app = createApp();

connectDb().then(() => {
  const server = app.listen(env.port, () => {
    console.log(`Server listening on http://localhost:${env.port}`);
  });

  function shutdown(signal: string): void {
    console.log(`${signal} received, shutting down gracefully`);
    server.close(() => {
      process.exit(0);
    });
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
});
