#!/usr/bin/env node
// ============================================================================
// init-company-db.js
// ============================================================================
// Provisions an isolated PostgreSQL database for a new company tenant and
// runs the full Prisma migration suite against it.
//
// Usage:
//   node scripts/init-company-db.js <company-slug>
//
// Example:
//   node scripts/init-company-db.js acme
//   → creates DB "rental_acme"
//   → runs all migrations in src/prisma/migrations/
//   → prints the DATABASE_URL to copy into that company's .env
//
// Requirements:
//   - PGUSER, PGPASSWORD, PGHOST, PGPORT must be set in env (or passed via
//     the shell). They are the superuser credentials used ONLY for the
//     one-time CREATE DATABASE call.
//   - The prisma CLI must be available (installed as a dev dep).
// ============================================================================

import { execSync } from "child_process";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Validate input ───────────────────────────────────────────────────────────
const companySlug = process.argv[2];
if (!companySlug) {
  console.error("❌  Usage: node scripts/init-company-db.js <company-slug>");
  console.error("   Example: node scripts/init-company-db.js acme");
  process.exit(1);
}

// Sanitise: lowercase, alphanumeric + hyphens only → safe for DB names
const safeSlug = companySlug.toLowerCase().replace(/[^a-z0-9-]/g, "-");
const dbName = `rental_${safeSlug.replace(/-/g, "_")}`;

// ── PostgreSQL superuser connection (to CREATE DATABASE) ─────────────────────
const pgHost = process.env.PGHOST || "localhost";
const pgPort = process.env.PGPORT || "5432";
const pgUser = process.env.PGUSER || "postgres";
const pgPassword = process.env.PGPASSWORD || "postgres";

const adminUrl = `postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/postgres`;

async function main() {
  console.log(`\n🏢  Provisioning company database for slug: "${safeSlug}"`);
  console.log(`📦  Target database: "${dbName}"\n`);

  // ── 1. Create the database (skip if already exists) ───────────────────────
  const adminClient = new pg.Client({ connectionString: adminUrl });
  try {
    await adminClient.connect();

    const { rows } = await adminClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );

    if (rows.length > 0) {
      console.log(`ℹ️  Database "${dbName}" already exists — skipping CREATE.`);
    } else {
      // pg identifiers can't be parameterised, but dbName is sanitised above
      await adminClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅  Database "${dbName}" created.`);
    }
  } finally {
    await adminClient.end();
  }

  // ── 2. Build the company DATABASE_URL ─────────────────────────────────────
  const companyUrl = `postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${dbName}`;

  // ── 3. Run Prisma migrations against the new DB ───────────────────────────
  const configPath = path.resolve(__dirname, "../prisma.config.ts");

  console.log(`\n🔄  Running Prisma migrations against "${dbName}"...`);
  try {
    execSync(
      `npx prisma migrate deploy`,
      {
        env: { ...process.env, DATABASE_URL: companyUrl },
        stdio: "inherit",
        cwd: path.resolve(__dirname, ".."),
      }
    );
    console.log(`\n✅  Migrations applied successfully.`);
  } catch (err) {
    console.error("\n❌  Migration failed:", err.message);
    process.exit(1);
  }

  // ── 4. Print instructions ─────────────────────────────────────────────────
  console.log("\n" + "─".repeat(60));
  console.log("🎉  Company DB ready! Add this to the company's .env file:");
  console.log("─".repeat(60));
  console.log(`\nDATABASE_URL="${companyUrl}"\n`);
  console.log("─".repeat(60));
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
