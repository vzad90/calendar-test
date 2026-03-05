import { neon } from '@neondatabase/serverless';
import { env } from '../config/env.js';

const sql = env.databaseUrl ? neon(env.databaseUrl) : null;

export function getSql() {
  if (!sql) throw new Error('Database not configured');
  return sql;
}

export function isDbConfigured(): boolean {
  return sql !== null;
}
