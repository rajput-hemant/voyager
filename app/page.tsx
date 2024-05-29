import Link from "next/link";

import { AdBanner } from "@/components/ad-banner";
import { TransactionsTable } from "@/components/transactions-table";
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

        <AdBanner />
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
