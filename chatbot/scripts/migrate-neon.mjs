import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing.");
  process.exit(1);
}

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const migrationDirectory = resolve(scriptDirectory, "../database/migrations");
const migrationFiles = ["001_chatbot.sql", "002_local_first_leads.sql"];
const sql = neon(process.env.DATABASE_URL);

for (const migrationFile of migrationFiles) {
  const migration = await readFile(resolve(migrationDirectory, migrationFile), "utf8");
  const statements = migration
    .replace(/--.*$/gm, "")
    .split(";")
    .map((statement) => statement.trim())
    .filter((statement) => statement && statement !== "BEGIN" && statement !== "COMMIT");

  for (const statement of statements) await sql.query(statement);
  console.log(`Applied ${migrationFile}`);
}

console.log("Neon chatbot migrations completed.");
