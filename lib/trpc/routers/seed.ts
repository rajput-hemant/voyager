import { desc } from "drizzle-orm";
import { z } from "zod";

import type { DBTransactions } from "@/lib/db/schema";

import { db } from "@/lib/db";
import { transactions, transactionsSchema } from "@/lib/db/schema";
import { queryStrk } from "@/lib/utils";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { transactionsReqSchema } from "./txns";

export const seedRouter = createTRPCRouter({
  seedDB: publicProcedure.query(async () => {
    const { result: latestBlock } = z
      .object({ result: z.number() })
      .parse(await queryStrk("starknet_blockNumber"));

    const lastBlock = await db.query.transactions.findFirst({
      orderBy: [desc(transactions.blockNumber)],
    });

    // if no blocks in db, start from 10 blocks behind latest
    let currentBlock;

    if (lastBlock) {
      currentBlock = lastBlock.blockNumber + 1;
    } else {
      currentBlock = latestBlock - 10;
    }

    // NOTE: this is temporary to avoid seeding too many blocks in hobby db
    if (latestBlock - currentBlock > 5) {
      currentBlock = latestBlock - 5;
    }

    while (currentBlock++ < latestBlock) {
      const data = await queryStrk("starknet_getBlockWithTxs", [
        { block_number: currentBlock },
      ]);

      const { result } = transactionsReqSchema.parse(data);

      const payload = result.transactions.map((tx) =>
        transactionsSchema.parse({
          hash: tx.transaction_hash,
          blockHash: result.block_hash,
          blockNumber: result.block_number,
          type: tx.type,
          contractAddress: tx.contract_address || tx.sender_address || null,
          timestamp: result.timestamp,
          status: result.status,
          finalityStatus: result.status,
        } satisfies DBTransactions)
      );

      const seed = await db
        .insert(transactions)
        .values(payload)
        .onConflictDoNothing()
        .returning({
          hash: transactions.hash,
          block: transactions.blockNumber,
        });

      console.log(seed);
    }

    return { success: true };
  }),
});
