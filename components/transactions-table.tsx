"use client";

import React from "react";
import Link from "next/link";

import { Loader2 } from "lucide-react";

import type { Transactions, TransactionType } from "@/lib/trpc/routers/txns";

import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { api } from "@/lib/trpc/react";
import { cn, formatTimestamp } from "@/lib/utils";

import { CopyButton } from "./copy-btn";
import { TxnStatus } from "./icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type TransactionsTableProps = {
  initialTxns: Transactions;
  type: TransactionType;
  ps: string;
};

export function TransactionsTable(props: TransactionsTableProps) {
  const { initialTxns, type, ps } = props;

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    api.txns.getTransactions.useInfiniteQuery(
      { type, ps },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialData: { pages: [initialTxns], pageParams: [null] },
      }
    );

  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.5,
  });

  const transactions = data?.pages.flatMap((page) => page.items);

  React.useEffect(() => {
    if (isIntersecting) {
      fetchNextPage();
    }
  }, [isIntersecting, fetchNextPage]);

  return (
    <div>
      <Table className="overflow-x-auto whitespace-nowrap border-y text-sm">
        <TableHeader>
          <TableRow className="grid grid-cols-[minmax(min-content,1fr)_minmax(min-content,3fr)_minmax(min-content,2fr)_minmax(min-content,5fr)_minmax(min-content,2fr)_minmax(min-content,2fr)] *:flex *:h-9 *:items-center *:p-1 *:text-xs *:uppercase">
            <TableHead>status</TableHead>
            <TableHead>hash</TableHead>
            <TableHead>type</TableHead>
            <TableHead>operations</TableHead>
            <TableHead>block</TableHead>
            <TableHead>age</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions && transactions.length ?
            transactions.map((tx) => (
              <TableRow
                key={tx.hash}
                className="grid grid-cols-[minmax(min-content,1fr)_minmax(min-content,3fr)_minmax(min-content,2fr)_minmax(min-content,5fr)_minmax(min-content,2fr)_minmax(min-content,2fr)] *:flex *:h-10 *:w-fit *:items-center *:p-1"
              >
                {/* status */}
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger>
                      <TxnStatus />
                    </TooltipTrigger>
                    <TooltipContent>{tx.status}</TooltipContent>
                  </Tooltip>
                </TableCell>
                {/* hash */}
                <TableCell className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger>
                      <Link
                        href={`/tx/${tx.hash}`}
                        className="inline-flex items-center justify-between gap-2 font-mono text-[rgb(139,163,223)]"
                      >
                        {tx.hash.slice(0, 6)}
                        <span className="-mx-2 font-sans">...</span>
                        {tx.hash.slice(-4)}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>{tx.hash}</TooltipContent>
                  </Tooltip>
                  <CopyButton text={tx.hash} />
                </TableCell>
                {/* type */}
                <TableCell>
                  <div
                    className={cn(
                      "rounded border px-2.5 py-0.5 text-xs",
                      tx.type === "INVOKE" &&
                        "border-[rgb(46,76,60)] bg-[rgb(32,46,38)] text-[rgb(130,244,187)]",
                      tx.type === "DEPLOY" &&
                        "border-[rgb(107,125,7)] bg-[rgb(32,46,38)] text-[rgb(254,255,181)]",
                      tx.type === "DECLARE" &&
                        "border-[rgb(60,80,110)] bg-[rgb(34,54,85)] text-[rgb(210,229,255)]",
                      tx.type === "DEPLOY_ACCOUNT" &&
                        "border-[rgb(88,63,42)] bg-[rgb(59,42,28)] text-[rgb(255,200,153)]",
                      tx.type === "L1_HANDLER" &&
                        "border-[rgb(76,46,46)] bg-[rgb(46,28,28)] text-[rgb(255,153,153)]"
                    )}
                  >
                    {tx.type}
                  </div>
                </TableCell>
                {/* operations */}
                <TableCell className="gap-2 font-mono text-[rgb(139,163,223)]">
                  {tx.contractAddress ?
                    <Tooltip>
                      <TooltipTrigger>
                        <Link href={`/contract/$${tx.contractAddress}`}>
                          {tx.contractAddress.slice(0, 6)}
                          <span className="font-sans">...</span>
                          {tx.contractAddress.slice(-4)}{" "}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>{tx.contractAddress}</TooltipContent>
                    </Tooltip>
                  : "-"}
                  {/* <div className="space-x-2">
                    {tx.operations?.split(",").map((op, i) =>
                      i > 2 ? null : (
                        <span
                          key={i}
                          className="rounded border border-[rgb(60,80,110)] bg-[rgb(34,54,85)] px-2.5 py-0.5 font-sans text-xs text-[rgb(210,229,255)]"
                        >
                          {i === 2 ? "..." : op}
                        </span>
                      )
                    )}
                  </div> */}
                </TableCell>
                {/* block */}
                <TableCell>
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 text-[rgb(139,163,223)]"
                      // "rounded border px-2.5 py-0.5 font-mono text-xs"
                      // tx.blockId === "SUCCEEDED" &&
                      //   "border-[rgb(46,76,60)] bg-[rgb(32,46,38)] text-[rgb(130,244,187)]",
                      // tx.blockId === "PENDING" &&
                      //   "border-[rgb(88,63,42)] bg-[rgb(59,42,28)] text-[rgb(255,200,153)]",
                      // tx.blockId === "REVERTED" &&
                      //   "border-[rgb(76,46,46)] bg-[rgb(46,28,28)] text-[rgb(255,153,153)]"
                    )}
                  >
                    {tx.blockNumber} <CopyButton text={tx.blockNumber} />
                  </div>
                </TableCell>
                {/* age */}
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger>
                      {formatTimestamp(tx.timestamp)} ago
                    </TooltipTrigger>

                    <TooltipContent>
                      {new Date(tx.timestamp * 1000).toString()}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          : <TableRow className="flex h-40 w-full items-center justify-center">
              <TableCell>
                <h3 className="py-6 text-center font-mono text-xl sm:text-2xl md:text-3xl">
                  <em>No transactions found</em> 😔
                </h3>
              </TableCell>
            </TableRow>
          }
        </TableBody>
      </Table>

      {hasNextPage ?
        <div ref={ref} className="flex items-center justify-center pt-6">
          {isFetchingNextPage && (
            <Loader2 className="size-10 animate-spin text-border" />
          )}
        </div>
      : !!transactions?.length && (
          <h3 className="py-6 text-center font-mono text-xl sm:text-2xl md:text-3xl">
            <em>Yay! You have seen it all</em> 🤩
          </h3>
        )
      }
    </div>
  );
}
