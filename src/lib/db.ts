import { neon } from "@neondatabase/serverless";

export function getDb() {
  return neon(process.env.DATABASE_URL!);
}

export async function ensureSchema() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      date DATE NOT NULL,
      color TEXT NOT NULL DEFAULT '#3b82f6',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
}
