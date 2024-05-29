import Link from "next/link";

import { TransactionsTable } from "@/components/transactions-table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type DashboardPageProps = {
  searchParams: {
    type: "0" | "2";
    p: string;
    ps: string;
  };
};

export default async function DashboardPage(props: DashboardPageProps) {
  const { type = "", p = "1", ps = "25" } = props.searchParams;

  return (
    <div className="my-12 min-h-[400px] rounded-lg bg-secondary p-8">
      <div className="flex items-center justify-between pb-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-[22px] font-medium">Transactions</h3>
          <p className="text-sm text-muted-foreground">
            A list of transactions on Starknet
          </p>
        </div>

        <div className="relative z-0 h-[90px] overflow-hidden rounded-lg">
          <ins className="z-20 rounded-lg">
            <iframe
              src="https://v1.slise.xyz/serve/iframe/6ce42483-c6cd-47a0-8f36-a36cd9103fca?pub=pub-32&amp;size=728x90&amp;slot=transactions-desktop&amp;path=%2Ftxns&amp;rnd=t8z4rtq5psqs8509s07dw2zies8r9hhuyjl69eanu&amp;host=voyager.online"
              width="728px"
              height="90px"
            />
          </ins>
          <Skeleton className="absolute inset-0 -z-10" />
        </div>
      </div>

      <ul
        role="group"
        className="mb-6 box-content flex h-8 w-fit items-center justify-center border text-sm *:flex *:h-full *:items-center *:justify-center"
      >
        {[
          { t: "", label: "All" },
          { t: "0", label: "deploy" },
          { t: "2", label: "declare" },
        ].map(({ t, label }, i, arr) => (
          <li key={label}>
            <Link
              href={`?type=${t}`}
              className={cn(
                "flex size-full h-full items-center justify-center px-4",
                t === type && "bg-border",
                i !== arr.length - 1 && "border-r"
              )}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <TransactionsTable type={type} p={+p} ps={+ps} />
    </div>
  );
}
