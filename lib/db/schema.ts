import { blob, integer, text, uniqueIndex } from "drizzle-orm/sqlite-core";
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

export const transaction = createTable(
  "transaction",
  {
    id: text("id").primaryKey(),
    header: blob("header", { mode: "json" })
      .$type<{
        hash: string;
        status: string;
        type: string;
        blockId: string;
        blockNumber: number;
        index: number;
        contract_address: string;
        timestamp: number;
        signature: string[];
        execution_status: string;
      }>()
      .notNull(),
    maxFee: text("max_fee"),
    usdFormattedMaxFee: text("usd_formatted_max_fee"),
    gasConsumed: text("gas_consumed").notNull(),
    nonce: text("nonce"),
    version: text("version").notNull(),
    receipt: blob("receipt", { mode: "json" })
      .$type<{
        events: {
          blockNumber: number;
          fromAddress: string;
          blockHash: string;
          timestamp: number;
          selector: string;
          name: string;
          id: string;
          contractAlias: string | null;
        }[];
        messages: number;
        feeTransferred: {
          from: string;
          to: string;
          amount: string;
          symbol: string;
          usd: string;
          usdPrice: number;
          fromAlias: string | null;
          toAlias: string;
        }[];
      }>()
      .notNull(),
    executionResources: blob("execution_resources", { mode: "json" })
      .$type<{
        steps: number;
        data_availability: {
          l1_gas: number;
          l1_data_gas: number;
        };
        ec_op_builtin_applications: number;
        pedersen_builtin_applications: number;
        poseidon_builtin_applications: number;
        range_check_builtin_applications: number;
      }>()
      .notNull(),
  },
  (table) => ({
    hashIdx: uniqueIndex("hash_idx").on(table.id),
  })
);

/* -----------------------------------------------------------------------------------------------
 * Zod Schema
 * -----------------------------------------------------------------------------------------------*/

export const transactionsSchema = createSelectSchema(transactions);
export const transactionSchema = createSelectSchema(transaction);

/* -----------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

export type DBTransactions = z.infer<typeof transactionsSchema>;
export type DBTransaction = z.infer<typeof transactionSchema>;
