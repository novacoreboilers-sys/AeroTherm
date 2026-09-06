import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing.");
  process.exit(1);
}

try {
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql.query(`
    SELECT
      to_regclass('public.chatbot_leads') AS leads,
      to_regclass('public.chat_sessions') AS sessions
  `);
  const ready = Boolean(rows[0]?.leads && rows[0]?.sessions);
  console.log(ready ? "Neon chatbot schema is ready." : "Neon chatbot schema is missing migrations.");
  if (!ready) process.exitCode = 2;
} catch (error) {
  console.error(`Neon connection failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
