import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Aquí le decimos a Prisma que use DATABASE_URL desde .env
    url: env("DATABASE_URL"),
  },
});
