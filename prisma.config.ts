// ============================================================================
// prisma.config.ts — Prisma 7+ configuration file
// ============================================================================
// Prisma 7 moved datasource.url OUT of schema.prisma and INTO this file.
// This is also where you configure:
//   - schema path (non-default because ours is in src/prisma/)
//   - migrations path
//   - multi-company: each company sets its own DATABASE_URL env var
// ============================================================================

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  // Points to our schema, relative to THIS file (project root)
  schema: "src/prisma/schema.prisma",

  migrations: {
    // Migration files live next to the schema
    path: "src/prisma/migrations",
  },

  datasource: {
    // ‼️  Multi-tenant isolation lives here:
    // Each company's .env sets DATABASE_URL to its own database.
    //   Dev  → rental_dev
    //   Acme → rental_acme
    //   XYZ  → rental_xyz
    // The same binary, same schema, fully isolated data.
    url: process.env.DATABASE_URL ?? "",
  },
});
