import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // O valor padrão deixa o "prisma generate" (usado no build) funcionar sem .env
    url:
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@localhost:5432/blog?schema=public",
  },
});
