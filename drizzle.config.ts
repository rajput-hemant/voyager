import { cwd } from "process";

import { loadEnvConfig } from "@next/env";

import type { Config } from "drizzle-kit";

import { siteConfig } from "@/config/site";

loadEnvConfig(cwd());

if (!process.env.DATABASE_URL) {
  console.error("'DATABASE_URL' is not set in the environment variables");
  process.exit(1);
}

if (!process.env.DATABASE_AUTH_TOKEN) {
  console.error(
    "'DATABASE_AUTH_TOKEN' is not set in the environment variables"
  );
  process.exit(1);
}

export default {
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
  tablesFilter: [`${siteConfig.name.toLowerCase().replace(/\s/g, "_")}_*`],
} satisfies Config;
