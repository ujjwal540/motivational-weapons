import "dotenv/config";
import { defineConfig } from "prisma/config";

// `prisma generate` only reads the schema and does not connect to Postgres.
// Vercel can therefore build without a database URL, while runtime queries
// still require the real DATABASE_URL through the Prisma schema.
const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/motivational_weapons";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
  },
});
