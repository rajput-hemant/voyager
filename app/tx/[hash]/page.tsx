import React from "react";
import Link from "next/link";

import { Check, CircleHelp, LoaderCircle } from "lucide-react";

import { AdBanner } from "@/components/ad-banner";
import { CopyButton } from "@/components/copy-btn";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/lib/trpc/server";
import { cn, formatTimestamp, formatTimestampUsingIntl } from "@/lib/utils";

type TransactionPageProps = {
  params: { hash: string };
  searchParams: {
    tab?: string;
  };
};

export default async function TransactionPage(props: TransactionPageProps) {
  const txn = await api.txn.getTransaction(props.params.hash);

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
            <CopyButton text={txn.header.hash} />
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
                      <TooltipContent align="start">{fee.from}</TooltipContent>
                    </Tooltip>
                    <CopyButton text={txn.header.hash} />
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
                    <CopyButton text={fee.to} />
                  </div>
                ))}
              </Cell>

              <Cell title="Max Fee:">-</Cell>

              <Cell title="Gas Consumed:">{txn.gasConsumed}</Cell>

              <Cell title="Sender Address:">
                <Tooltip delayDuration={0}>
                  <TooltipTrigger>
                    <Link
                      href={`/contract/${txn.header.contract_address}`}
                      className="text-[rgb(139,163,223)]"
                    >
                      {txn.header.contract_address}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent align="start">
                    {txn.header.contract_address}
                  </TooltipContent>
                </Tooltip>
                <CopyButton text={txn.header.contract_address} />
              </Cell>
            </div>

            <h3 className="mb-2 text-[22px] font-medium">Developer Info</h3>

            <div className="flex flex-col">
              <Cell title="Unix Timestamp:">
                {txn.header.timestamp}{" "}
                <CopyButton text={txn.header.timestamp} />
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
                <CopyButton text={txn.header.hash} />
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
                      <CopyButton text={sig} />
                    </div>
                  ))}
                </div>
              </Cell>
            </div>
          </TabsContent>

          <TabsContent value="events">
            <Table className="mt-1 overflow-x-auto whitespace-nowrap border-y text-sm">
              <TableHeader>
                <TableRow className="grid grid-cols-[minmax(min-content,2fr)_minmax(min-content,1fr)_minmax(min-content,2fr)_minmax(min-content,2fr)_minmax(min-content,2fr)] *:flex *:h-9 *:items-center *:p-1 *:text-xs *:uppercase">
                  <TableHead>Id</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Block</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>Age</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {txn.receipt.events.map((event) => (
                  <TableRow
                    key={event.id}
                    className="grid grid-cols-[minmax(min-content,2fr)_minmax(min-content,1fr)_minmax(min-content,2fr)_minmax(min-content,2fr)_minmax(min-content,2fr)] *:flex *:h-10 *:w-fit *:items-center *:p-1"
                  >
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger>
                          <Link
                            href={`/event/${event.id}`}
                            className="font-mono text-[rgb(139,163,223)]"
                          >
                            {event.id}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>{event.id}</TooltipContent>
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <div className="w-fit rounded border border-[rgb(60,80,110)] bg-[rgb(34,54,85)] px-2.5 py-0.5 font-sans text-xs text-[rgb(210,229,255)]">
                        {event.name}
                      </div>
                    </TableCell>

                    <TableCell className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger>
                          <Link
                            href={`/block/${event.blockNumber}`}
                            className="flex items-center gap-1 font-mono text-[rgb(139,163,223)]"
                          >
                            {event.blockNumber}{" "}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>{event.blockNumber}</TooltipContent>
                      </Tooltip>
                      <CopyButton text={event.blockNumber} />
                    </TableCell>

                    <TableCell className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger>
                          <Link
                            href={`/contract/${event.fromAddress}`}
                            className="font-mono text-[rgb(139,163,223)]"
                          >
                            {event.contractAlias ||
                              event.fromAddress.slice(0, 6) +
                                "..." +
                                event.fromAddress.slice(-4)}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>{event.fromAddress}</TooltipContent>
                      </Tooltip>

                      <CopyButton text={event.fromAddress} />
                    </TableCell>

                    <TableCell>
                      {formatTimestamp(event.timestamp)} ago
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
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
