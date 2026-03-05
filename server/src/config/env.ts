import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_PORT = 5001;

function getPort(): number {
  const raw = process.env.PORT;
  if (raw === undefined) return DEFAULT_PORT;
  const port = Number.parseInt(raw, 10);
  if (Number.isNaN(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT: ${raw}. Must be 1-65535.`);
  }
  return port;
}

export const env = {
  port: getPort(),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  mongodbUri: process.env.MONGODB_URI ?? null,
} as const;
