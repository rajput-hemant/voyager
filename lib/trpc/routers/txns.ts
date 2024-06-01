import { z } from "zod";

import { db } from "@/lib/db";
import { transactionsSchema } from "@/lib/db/schema";

import { createCaller } from "../root";
import { createTRPCRouter, publicProcedure } from "../trpc";

/* -----------------------------------------------------------------------------------------------
 * Schemas
 * -----------------------------------------------------------------------------------------------*/

export const transactionType = z.enum([
  "ALL",
  "DECLARE",
  "DEPLOY",
  "DEPLOY_ACCOUNT",
  "INVOKE",
  "L1_HANDLER",
]);

export const transactionsReqSchema = z.object({
  result: z.object({
    status: z.string(),
    block_hash: z.string(),
    block_number: z.number(),
    timestamp: z.number(),
    transactions: z.array(
      z.object({
        transaction_hash: z.string(),
        type: transactionType,
        sender_address: z.string().nullish(),
        contract_address: z.string().nullish(),
      })
    ),
  }),
});

export const transactionsResSchema = z.object({
  items: z.array(transactionsSchema),
  nextCursor: z.number().nullish(),
});

const txnsInputSchema = z
  .object({
    type: transactionType.optional().default("ALL"),
    ps: z
      .union([z.number(), z.string()])
      .transform((v) => +v)
      .optional()
      .default(25),
    cursor: z.number().nullish(),
  })
  .optional()
  .default({});

/* -----------------------------------------------------------------------------------------------
 * Router
 * -----------------------------------------------------------------------------------------------*/

export const txnsRouter = createTRPCRouter({
  getTransactions: publicProcedure
    .input(txnsInputSchema)
    .query(async ({ input: { type, ps, cursor }, ctx: { headers } }) => {
      // seed db
      const caller = createCaller({ headers });
      caller.seed.seedDB();

      const transactions = await db.query.transactions.findMany({
        where: (tx, { eq }) => (type === "ALL" ? undefined : eq(tx.type, type)),
        limit: ps + 1,
        offset: cursor ? cursor * ps : 0,
        orderBy: ({ blockNumber }, { desc }) => desc(blockNumber),
      });

      return transactionsResSchema.parse({
        items: transactions,
        nextCursor: cursor
          ? transactions.length > ps
            ? cursor + 1
            : undefined
          : 1,
      });
    }),
});

/* -----------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

export type Transactions = z.infer<typeof transactionsResSchema>;
export type TransactionType = z.infer<typeof transactionType>;
