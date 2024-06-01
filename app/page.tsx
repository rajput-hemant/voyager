import Link from "next/link";

import type { TransactionType } from "@/lib/trpc/routers/txns";

import { AdBanner } from "@/components/ad-banner";
import { TransactionsTable } from "@/components/transactions-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/trpc/server";
import { cn } from "@/lib/utils";

type DashboardPageProps = {
  searchParams: {
    type: TransactionType;
    ps: string;
  };
};

/* -----------------------------------------------------------------------------------------------
 * revalidate data every 30 seconds
 * -----------------------------------------------------------------------------------------------*/
export const revalidate = 300;

export default async function DashboardPage(props: DashboardPageProps) {
  const { type, ps = "25" } = props.searchParams;

  const transactions = await api.txns.getTransactions({ type, ps });

  const tabs: { t: TransactionType; label: string }[] = [
    { t: "ALL", label: "All" },
    { t: "DECLARE", label: "declare" },
    { t: "DEPLOY", label: "deploy" },
    { t: "DEPLOY_ACCOUNT", label: "deploy_account" },
    { t: "INVOKE", label: "invoke" },
    { t: "L1_HANDLER", label: "l1_handler" },
  ];

  return (
    <div className="my-12 min-h-[400px] rounded-lg bg-secondary p-8">
      <div className="flex items-center justify-between pb-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-[22px] font-medium">Transactions</h3>
          <p className="text-sm text-muted-foreground">
            A list of transactions on Starknet
          </p>
        </div>

        <AdBanner />
      </div>

      <div className="flex justify-between">
        <ul
          role="group"
          className="mb-6 box-content flex h-8 w-fit items-center justify-center border text-sm *:flex *:h-full *:items-center *:justify-center"
        >
          {tabs.map(({ t, label }, i, arr) => (
            <li key={label}>
              <Link
                href={`?type=${t}`}
                className={cn(
                  "flex size-full h-full items-center justify-center px-4",
                  (t === type || (t === "ALL" && !type)) && "bg-border",
                  i !== arr.length - 1 && "border-r"
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <DropdownMenu>
          <DropdownMenuTrigger className="mx-2 ml-auto h-[42px] gap-8 rounded-lg border p-2 text-xs text-muted-foreground outline-none">
            Show <span className="text-sm text-foreground">{ps}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {[10, 25, 50, 100].map((p) => (
              <DropdownMenuItem
                key={p}
                className={cn("p-0", p === +ps && "bg-border")}
              >
                <Link
                  href={{ query: { type, ps: p } }}
                  className="w-full p-1.5 pl-[25px] pr-[35px]"
                >
                  {p}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <TransactionsTable
        key={transactions.items.at(0)?.blockNumber}
        initialTxns={transactions}
        type={type}
        ps={ps}
      />
    </div>
  );
}
