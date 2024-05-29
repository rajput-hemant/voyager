import Link from "next/link";

import { ChevronLeft, ChevronRight, Copy } from "lucide-react";

import type { Transactions } from "@/types/transaction";

import { cn, formatTimestamp } from "@/lib/utils";

import { TxnStatus } from "./icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

async function fetcher(type: "" | "0" | "2", p: number, ps: number) {
  const url = new URL(
    `https://voyager.online/api/txns?ps=${ps}&p=${p}&type=${type || null}`
  );

  const response = await fetch(url.toString());
  const data = await response.json();
  return data as Transactions;
}

type TransactionsTableProps = {
  type: "" | "0" | "2";
  p: number;
  ps: number;
};

export async function TransactionsTable(props: TransactionsTableProps) {
  const { type, p, ps } = props;

  const transactions = await fetcher(type, p, ps);

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
          {transactions.items.map((tx) => (
            <TableRow
              key={tx.hash}
              className="grid grid-cols-[minmax(min-content,1fr)_minmax(min-content,3fr)_minmax(min-content,2fr)_minmax(min-content,5fr)_minmax(min-content,2fr)_minmax(min-content,2fr)] *:flex *:h-10 *:w-fit *:items-center *:p-1"
            >
              {/* status */}
              <TableCell>
                <Tooltip>
                  <TooltipTrigger>
                    <TxnStatus className="" />
                  </TooltipTrigger>
                  <TooltipContent>{tx.status}</TooltipContent>
                </Tooltip>
              </TableCell>
              {/* hash */}
              <TableCell>
                <Tooltip>
                  <TooltipTrigger>
                    <Link
                      href={`/tx/${tx.hash}`}
                      className="inline-flex items-center justify-between gap-2 font-mono text-[rgb(139,163,223)]"
                    >
                      {tx.hash.slice(0, 6)}
                      <span className="-mx-2 font-sans">...</span>
                      {tx.hash.slice(-4)}
                      <Copy className="size-3.5 text-muted-foreground" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>{tx.hash}</TooltipContent>
                </Tooltip>
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
                      "border-[rgb(60,80,110)] bg-[rgb(34,54,85)] text-[rgb(210,229,255)]"
                  )}
                >
                  {tx.type}
                </div>
              </TableCell>
              {/* operations */}
              <TableCell className="gap-2 font-mono text-[rgb(139,163,223)]">
                <Tooltip>
                  <TooltipTrigger>
                    <Link href={`/contract/$${tx.contract_address}`}>
                      {tx.contract_address.slice(0, 6)}
                      <span className="font-sans">...</span>
                      {tx.contract_address.slice(-4)}{" "}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>{tx.contract_address}</TooltipContent>
                </Tooltip>
                <div className="space-x-2">
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
                </div>
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
                  {tx.blockNumber}{" "}
                  <Copy className="size-3.5 text-muted-foreground" />
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
          ))}
        </TableBody>
      </Table>

      <div className="flex flex-wrap justify-between px-6 py-[2.125rem]">
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="mx-2 h-[42px] gap-8 rounded-lg border p-2 text-xs text-muted-foreground">
              Show <span className="text-sm text-foreground">{ps}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
              {[10, 25, 50, 100].map((ps) => (
                <DropdownMenuItem key={ps} className="p-0">
                  <Link
                    href={{ query: { type, p, ps } }}
                    className="w-full p-1.5 pl-[25px] pr-[35px]"
                  >
                    {ps}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex h-[42px] gap-2 text-xs font-medium *:flex *:items-center *:justify-center *:gap-1 *:rounded-lg *:border *:p-2 *:text-sm">
          <div>
            <span className="text-[0.7rem] uppercase text-muted-foreground">
              Page
            </span>{" "}
            {p} of {transactions.lastPage.toLocaleString()}
          </div>

          <div className="flex h-[42px] items-center gap-0.5 rounded border p-0.5">
            <Link
              href={{ query: { type, p: p - 1, ps } }}
              className={cn(
                "flex size-6 items-center",
                p === 1 && "pointer-events-none cursor-not-allowed opacity-50"
              )}
            >
              <ChevronLeft className="size-5 text-muted-foreground" />
            </Link>
            <Link
              href={{ query: { type, p: p + 1, ps } }}
              className={cn(
                "flex size-6 items-center",
                p === transactions.lastPage &&
                  "pointer-events-none cursor-not-allowed opacity-50"
              )}
            >
              <ChevronRight className="ml-auto size-5 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
