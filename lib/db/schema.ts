import { integer, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";

import type { z } from "zod";

import { createTable } from "./table-creator";

/* -----------------------------------------------------------------------------------------------
 * Schema
 * -----------------------------------------------------------------------------------------------*/

export const transactions = createTable("transactions", {
  hash: text("hash").primaryKey(),
  type: text("type", {
    enum: [
      "ALL",
      "DECLARE",
      "DEPLOY",
      "DEPLOY_ACCOUNT",
      "INVOKE",
      "L1_HANDLER",
    ],
  }).notNull(),
  blockHash: text("block_hash").notNull(),
  blockNumber: integer("block_number", { mode: "number" }).notNull(),
  contractAddress: text("contract_address"),
  timestamp: integer("timestamp", { mode: "number" }).notNull(),
  status: text("status").notNull(),
  finalityStatus: text("finality_status").notNull(),
});

/* -----------------------------------------------------------------------------------------------
 * Zod Schema
 * -----------------------------------------------------------------------------------------------*/

export const transactionsSchema = createSelectSchema(transactions);

/* -----------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

export type DBTransactions = z.infer<typeof transactionsSchema>;
