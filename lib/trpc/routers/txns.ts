import { z } from "zod";

import { queryStrk } from "@/lib/utils";

import { createTRPCRouter, publicProcedure } from "../trpc";

/* -----------------------------------------------------------------------------------------------
 * Schemas
 * -----------------------------------------------------------------------------------------------*/

export const latestBlockReqSchema = z.object({
  result: z.number(),
});

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
        sender_address: z.string().optional(),
      })
    ),
  }),
});

export const transactionsResSchema = z.object({
  items: z.array(
    z.object({
      blockNumber: z.number(),
      hash: z.string(),
      index: z.number(),
      type: transactionType,
      contract_address: z.string(),
      timestamp: z.number(),
      status: z.string(),
      finality_status: z.string(),
      operations: z.string().nullable(),
    })
  ),
  nextCursor: z.number().nullable(),
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
    .query(async ({ input: { type, ps, cursor } }) => {
      /* -----------------------------------------------------------------------------------------------
       * Get the latest block
       * -----------------------------------------------------------------------------------------------*/

      const { result: latestBlock } = latestBlockReqSchema.parse(
        await queryStrk("starknet_blockNumber")
      );

      /* -----------------------------------------------------------------------------------------------
       * Get the transactions
       * -----------------------------------------------------------------------------------------------*/

      const block_number = latestBlock - 10;

      const data = await queryStrk("starknet_getBlockWithTxs", [
        { block_number },
      ]);

      const { result } = transactionsReqSchema.parse(data);

      const filteredTransactions = result.transactions.filter(
        (tx) => tx.type === type || type === "ALL"
      );

      const payload = transactionsResSchema.parse({
        items: filteredTransactions
          .map(
            (tx, i) =>
              ({
                blockNumber: result.block_number,
                hash: tx.transaction_hash,
                index: i,
                type: tx.type,
                contract_address: tx.sender_address || "",
                timestamp: result.timestamp,
                status: result.status,
                finality_status: result.status,
                // TODO: replace with actual operations
                operations: null,
              }) satisfies Transactions["items"][number]
          )
          .slice(cursor ? cursor * ps : 0, (cursor ? cursor + 1 : 1) * ps),
        nextCursor: cursor
          ? filteredTransactions.length > cursor * ps
            ? cursor + 1
            : null
          : 1,
      } satisfies Transactions);

      return payload;
    }),
});

// export const txnsRouter = createTRPCRouter({
//   getTransactions: publicProcedure
//     .input(txnsInputSchema)
//     .query(async ({ input: { type, ps, cursor } }) => {
//       /* -----------------------------------------------------------------------------------------------
//        * init variables
//        * -----------------------------------------------------------------------------------------------*/
//       const transactions = [];
//       const currentPage = cursor || 1;
//       const itemsPerPage = ps;

//       /* -----------------------------------------------------------------------------------------------
//        * helper fn to fetch and parse block txns
//        * -----------------------------------------------------------------------------------------------*/
//       const fetchTransactions = async (block_number: number) => {
//         const data = await queryStrk("starknet_getBlockWithTxs", [
//           { block_number },
//         ]);
//         const { result } = transactionsReqSchema.parse(data);

//         return result.transactions.map(
//           (tx) =>
//             ({
//               blockNumber: result.block_number,
//               hash: tx.transaction_hash,
//               type: tx.type,
//               contract_address: tx.sender_address || "",
//               timestamp: result.timestamp,
//               status: result.status,
//               finality_status: result.status,
//               // TODO: replace with actual operations
//               operations: null,
//             }) satisfies Transactions["items"][0]
//         );
//       };

//       /* -----------------------------------------------------------------------------------------------
//        * fetch txns until we've enough for the current page
//        * -----------------------------------------------------------------------------------------------*/
//       const { result: latestBlockNumber } = latestBlockReqSchema.parse(
//         await queryStrk("starknet_blockNumber")
//       );
//       let blockNumber = latestBlockNumber;

//       while (transactions.length < itemsPerPage * currentPage) {
//         const blockTransactions = await fetchTransactions(blockNumber);

//         const filteredTransactions = blockTransactions.filter(
//           (tx) => tx.type === type || type === "ALL"
//         );
//         transactions.push(...filteredTransactions);
//         blockNumber--;

//         // Stop if we reach block zero or there are no more transactions to fetch
//         if (blockNumber < 0 || blockTransactions.length === 0) {
//           break;
//         }
//       }

//       /* -----------------------------------------------------------------------------------------------
//        * paginate the txns
//        * -----------------------------------------------------------------------------------------------*/
//       const paginatedTransactions = transactions.slice(
//         (currentPage - 1) * itemsPerPage,
//         currentPage * itemsPerPage
//       );

//       return transactionsResSchema.parse({
//         items: paginatedTransactions,
//         nextCursor: cursor
//           ? transactions.length > cursor * ps
//             ? cursor + 1
//             : null
//           : 1,
//       } satisfies Transactions);
//     }),
// });

/* -----------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

export type Transactions = z.infer<typeof transactionsResSchema>;
export type TransactionType = z.infer<typeof transactionType>;
