import { z } from "zod";

import { db } from "@/lib/db";
import { transaction } from "@/lib/db/schema";
import { queryStrk } from "@/lib/utils";

import { createTRPCRouter, publicProcedure } from "../trpc";

/* -----------------------------------------------------------------------------------------------
 * Schemas
 * -----------------------------------------------------------------------------------------------*/

export const transactionReqSchema = z.object({
  header: z.object({
    blockId: z.string(),
    blockNumber: z.number(),
    hash: z.string(),
    index: z.number(),
    // l1VerificationHash: z.string().nullable(),
    type: z.string(),
    contract_address: z.string(),
    // sender_address: z.string(),
    timestamp: z.number(),
    signature: z.array(z.string()),
    execution_status: z.string(),
    status: z.string(),
    // finality_status: z.string(),
  }),
  maxFee: z.string().nullable(),
  usdFormattedMaxFee: z.string().nullable(),
  // actualFee: z.string(),
  // actualFeeUnit: z.string(),
  gasConsumed: z.string(),
  nonce: z.string().nullable(),
  version: z.string(),
  receipt: z.object({
    events: z.array(
      z.object({
        blockNumber: z.number(),
        fromAddress: z.string(),
        blockHash: z.string(),
        timestamp: z.number(),
        selector: z.string(),
        name: z.string(),
        id: z.string(),
        contractAlias: z.string().nullable(),
      })
    ),
    messages: z.number(),
    feeTransferred: z.array(
      z.object({
        from: z.string(),
        to: z.string(),
        amount: z.string(),
        symbol: z.string(),
        usd: z.string(),
        usdPrice: z.number(),
        fromAlias: z.string().nullable(),
        toAlias: z.string(),
      })
    ),
  }),
  executionResources: z.object({
    steps: z.number(),
    data_availability: z.object({
      l1_gas: z.number(),
      l1_data_gas: z.number(),
    }),
    ec_op_builtin_applications: z.number(),
    pedersen_builtin_applications: z.number(),
    poseidon_builtin_applications: z.number(),
    range_check_builtin_applications: z.number(),
  }),
});

export const transactionResSchema = z.intersection(
  transactionReqSchema.shape.header.omit({ hash: true }),
  z.object({ hash: z.string() })
);

/* -----------------------------------------------------------------------------------------------
 * Router
 * -----------------------------------------------------------------------------------------------*/

export const txnRouter = createTRPCRouter({
  getTransaction: publicProcedure.input(z.string()).query(async ({ input }) => {
    let txn = await db.query.transaction.findFirst({
      where: ({ id }, { eq }) => eq(id, input),
    });

    if (!txn) {
      const data = await queryStrk("starknet_getTransactionReceipt", [input]);
      const result = transactionReqSchema.parse(data);
      [txn] = await db
        .insert(transaction)
        .values({ id: input, ...result })
        .returning();
    }

    return txn;
  }),
});

/* -----------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

export type Transaction = z.infer<typeof transactionResSchema>;
