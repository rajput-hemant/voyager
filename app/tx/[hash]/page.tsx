import React from "react";
import Link from "next/link";

import { Check, CircleHelp, Copy, LoaderCircle } from "lucide-react";

import type { Transaction } from "@/types/transaction";

import { AdBanner } from "@/components/ad-banner";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, formatTimestamp, formatTimestampUsingIntl } from "@/lib/utils";

type TransactionPageProps = {
  params: { hash: string };
  searchParams: {
    tab?: string;
  };
};

async function fetcher(hash: string) {
  const url = new URL(`https://voyager.online/api/txn/${hash}`);

  const response = await fetch(url.toString());
  const data = await response.json();
  return data as Transaction;
}

export default async function TransactionPage(props: TransactionPageProps) {
  const txn = await fetcher(props.params.hash);

  return (
    <div className="my-12 min-h-[400px] rounded-lg bg-secondary p-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-[22px] font-medium">Transaction</h3>
        </div>

        <AdBanner />
      </div>

      <div className="mb-3 flex flex-col gap-6 pt-6">
        <div className="h-12">
          <h6 className="text-xs font-medium uppercase text-secondary-foreground">
            Hash
          </h6>
          <div className="flex items-center gap-2">
            <p className="text-base font-medium leading-8">{txn.header.hash}</p>
            <Copy className="size-5 text-secondary-foreground" />
          </div>
        </div>

        <div className="flex gap-4 *:w-[304.5px]">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <h6 className="text-xs font-medium uppercase text-secondary-foreground">
                Type
              </h6>

              <CircleHelp className="size-[18px] text-secondary-foreground" />
            </div>
            <div
              className={cn(
                "w-fit rounded border px-2.5 py-0.5 text-xs",
                txn.header.type === "INVOKE" &&
                  "border-[rgb(46,76,60)] bg-[rgb(32,46,38)] text-[rgb(130,244,187)]",
                txn.header.type === "DEPLOY" &&
                  "border-[rgb(107,125,7)] bg-[rgb(32,46,38)] text-[rgb(254,255,181)]",
                txn.header.type === "DECLARE" &&
                  "border-[rgb(60,80,110)] bg-[rgb(34,54,85)] text-[rgb(210,229,255)]"
              )}
            >
              {txn.header.type}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h6 className="text-xs font-medium uppercase text-secondary-foreground">
              Timestamp
            </h6>

            <div className="flex items-center gap-2">
              <span className="font-medium">
                {formatTimestampUsingIntl(txn.header.timestamp).split(",")[0]}
              </span>
              <span className="text-xs">
                {formatTimestampUsingIntl(txn.header.timestamp).split(",")[1]}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-2 space-y-2">
          <h6 className="text-xs font-medium uppercase text-secondary-foreground">
            Status
          </h6>

          <div className="flex items-center">
            <div className="flex cursor-pointer items-center rounded-[42px] bg-[rgb(17,_125,_73)] py-2 pl-2 pr-3 text-[11px] font-medium transition-[max-width] duration-150 hover:px-3">
              <Check className="mr-1 size-4" />
              Received
            </div>
            <Separator className="h-0.5 w-6 bg-[rgb(17,_125,_73)]" />
            <div className="flex cursor-pointer items-center rounded-[42px] bg-[rgb(17,_125,_73)] py-2 pl-2 pr-3 text-[11px] font-medium transition-[max-width] duration-150 hover:px-3">
              <Check className="mr-1 size-4" />
              {txn.header.status}
            </div>
            <Separator className="h-0.5 w-6 bg-[rgb(17,_125,_73)]" />

            <div className="group flex cursor-pointer items-center rounded-[42px] border p-0.5 text-[11px] font-medium text-secondary-foreground transition-[max-width] duration-150 hover:pr-2">
              <LoaderCircle
                strokeWidth={1}
                className="size-7 animate-spin group-hover:mr-1"
              />
              <span className="hidden group-hover:inline-flex">
                {txn.header.status}
              </span>
            </div>
          </div>
        </div>

        <Tabs defaultValue={props.searchParams.tab ?? "overview"}>
          <TabsList className="-mt-2 mb-5 gap-10 bg-transparent p-0">
            {["Overview", "Events"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab.toLowerCase()}
                className="h-10 rounded-none border-[rgb(191,109,76)] !bg-transparent p-0 hover:border-b-2 data-[state=active]:border-b-2"
              >
                <Link href={`?tab=${tab.toLowerCase()}`} className="h-full">
                  {tab}

                  {tab === "Events" && (
                    <span className="ml-2 rounded-2xl bg-background px-2 py-[5px] font-medium">
                      {txn.receipt.events.length}
                    </span>
                  )}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview">
            <h3 className="mb-2 text-[22px] font-medium">
              Transaction Details
            </h3>

            <div className="mb-9 flex flex-col">
              <Cell title="Block Number:">
                <Tooltip delayDuration={0}>
                  <TooltipTrigger>
                    <Link
                      href={`/block/${txn.header.blockNumber}`}
                      className="text-[rgb(139,163,223)]"
                    >
                      {txn.header.blockNumber}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent align="start">
                    {txn.header.hash}
                  </TooltipContent>
                </Tooltip>
              </Cell>

              <Cell title="Timestamp:">
                <Tooltip delayDuration={0}>
                  <TooltipTrigger>
                    {formatTimestamp(txn.header.timestamp)} ago ({" "}
                    {formatTimestampUsingIntl(txn.header.timestamp)} )
                  </TooltipTrigger>
                  <TooltipContent align="start">
                    {txn.header.hash}
                  </TooltipContent>
                </Tooltip>
              </Cell>

              <Cell title="Actual Fee:">
                {txn.receipt.feeTransferred.map((fee) => (
                  <div key={fee.from} className="flex items-center gap-1">
                    {fee.amount}
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger>
                        <Link
                          href={`/token/${fee.from}`}
                          className="text-[rgb(139,163,223)]"
                        >
                          {fee.symbol}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent align="start">
                        {txn.header.hash}
                      </TooltipContent>
                    </Tooltip>
                    <Copy className="size-3 text-secondary-foreground" />
                    <span>(${fee.usd})</span>
                    <span>
                      to:{" "}
                      <Tooltip>
                        <TooltipTrigger>
                          <Link
                            href={`/contract/${fee.to}`}
                            className="text-[rgb(139,163,223)]"
                          >
                            {fee.toAlias}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent align="start">
                          {txn.header.hash}
                        </TooltipContent>
                      </Tooltip>
                    </span>
                    <Copy className="size-3 text-secondary-foreground" />
                  </div>
                ))}
              </Cell>

              <Cell title="Max Fee:">-</Cell>

              <Cell title="Gas Consumed:">{txn.gasConsumed}</Cell>

              <Cell title="Sender Address:">
                <Tooltip delayDuration={0}>
                  <TooltipTrigger>
                    <Link
                      href={`/contract/${txn.header.sender_address}`}
                      className="text-[rgb(139,163,223)]"
                    >
                      {txn.header.sender_address}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent align="start">
                    {txn.header.sender_address}
                  </TooltipContent>
                </Tooltip>
                <Copy className="size-3 text-secondary-foreground" />
              </Cell>
            </div>

            <h3 className="mb-2 text-[22px] font-medium">Developer Info</h3>

            <div className="flex flex-col">
              <Cell title="Unix Timestamp:">
                {txn.header.timestamp}{" "}
                <Copy className="size-3 text-secondary-foreground" />
              </Cell>

              <Cell title="Nonce:">{txn.nonce || "-"}</Cell>

              <Cell title="Position:">{txn.header.index}</Cell>

              <Cell title="Version:">{txn.version.slice(2)}</Cell>

              <Cell title="L1 TXN Hash:">
                <Tooltip delayDuration={0}>
                  <TooltipTrigger>
                    <Link
                      href={`/l1/tx/${txn.header.hash}`}
                      className="text-[rgb(139,163,223)]"
                    >
                      {txn.header.hash}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent align="start">
                    {txn.header.hash}
                  </TooltipContent>
                </Tooltip>
                <Copy className="size-3 text-secondary-foreground" />
              </Cell>

              <Cell title="Execution Resources:">
                <div className="my-1 space-y-1">
                  <div className="w-fit rounded border border-[rgb(46,76,60)] bg-[rgb(32,46,38)] px-2.5 py-0.5 text-xs uppercase text-[rgb(130,244,187)]">
                    {txn.executionResources.steps} Steps
                  </div>

                  <div className="flex gap-1">
                    <div className="rounded border border-[rgb(88,63,42)] bg-[rgb(59,42,28)] px-2.5 py-0.5 text-xs uppercase text-[rgb(255,200,153)]">
                      {txn.executionResources.pedersen_builtin_applications}{" "}
                      pedersen builtin
                    </div>
                    <div className="rounded border border-[rgb(88,63,42)] bg-[rgb(59,42,28)] px-2.5 py-0.5 text-xs uppercase text-[rgb(255,200,153)]">
                      {txn.executionResources.range_check_builtin_applications}{" "}
                      range check builtin
                    </div>
                    <div className="rounded border border-[rgb(88,63,42)] bg-[rgb(59,42,28)] px-2.5 py-0.5 text-xs uppercase text-[rgb(255,200,153)]">
                      {txn.executionResources.ec_op_builtin_applications} ec op
                      builtin
                    </div>
                  </div>
                </div>
              </Cell>

              <Cell title="Calldata:">-</Cell>

              <Cell title="Signature(s):">
                <div className="flex w-full flex-col">
                  {txn.header.signature.map((sig) => (
                    <div
                      key={sig}
                      className="flex w-full items-center justify-between border-b px-2 py-0.5 last:border-none"
                    >
                      <pre className="font-mono font-medium text-[#cc8f30]">
                        <code>{sig}</code>
                      </pre>
                      <Copy className="size-3 text-secondary-foreground" />
                    </div>
                  ))}
                </div>
              </Cell>
            </div>
          </TabsContent>

          <TabsContent value="events"></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

type CellProps = React.PropsWithChildren<{
  title: string;
}>;

function Cell({ title, children }: CellProps) {
  return (
    <div className="flex min-h-[38px] gap-2.5">
      <div className="flex min-w-[250px] items-center gap-2.5 leading-[38px]">
        <CircleHelp strokeWidth={1.25} className="size-[18px]" />
        <h6 className="text-xs font-medium uppercase">{title}</h6>
      </div>

      <div className="flex flex-1 items-center gap-2.5 border-b text-sm leading-[38px]">
        {children}
      </div>
    </div>
  );
}
