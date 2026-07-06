import pg from 'pg';

import { USER_AJAY } from './ids.js';

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL ?? 'postgresql://dealaxis:dealaxis@localhost:5432/dealaxis';

export const pool = new Pool({ connectionString });

export async function query(text, params) {
  const result = await pool.query(text, params);
  return result;
}

export async function getDemoUserId() {
  return process.env.DEMO_USER_ID ?? USER_AJAY;
}
