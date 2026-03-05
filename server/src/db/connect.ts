import { env } from '../config/env.js';
import { getSql } from './client.js';

export async function connectDb(): Promise<void> {
  if (!env.databaseUrl) {
    console.warn('DATABASE_URL is not set; running without database.');
    return;
  }
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      date DATE NOT NULL,
      order_index INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}
