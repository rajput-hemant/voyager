import type { Transactions } from "@/types/transaction";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

async function fetcher(type: "0" | "2", p: number, ps: number) {
  console.log({ type, p, ps });

  const response = await fetch(
    `https://voyager.online/api/txns?ps=${ps}&p=${p}&type=${type}`
  );
  const data = await response.json();
  return data as Transactions;
}

type TransactionsTableProps = {
  type: "0" | "2";
  p: number;
  ps: number;
};

export async function TransactionsTable(props: TransactionsTableProps) {
  const { type, p, ps } = props;

  const transactions = await fetcher(type, p, ps);

  return (
    <Table className="overflow-x-auto whitespace-nowrap">
      <TableHeader>
        <TableRow className="grid grid-cols-[minmax(min-content,1fr)_minmax(min-content,3fr)_minmax(min-content,2fr)_minmax(min-content,5fr)_minmax(min-content,2fr)_minmax(min-content,2fr)]">
          <TableHead>status</TableHead>
          <TableHead>hash</TableHead>
          <TableHead>type</TableHead>
          <TableHead>operations</TableHead>
          <TableHead>block</TableHead>
          <TableHead>age</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {transactions.items.map((transaction) => (
          <TableRow
            key={transaction.hash}
            className="grid grid-cols-[minmax(min-content,1fr)_minmax(min-content,3fr)_minmax(min-content,2fr)_minmax(min-content,5fr)_minmax(min-content,2fr)_minmax(min-content,2fr)]"
          >
            <TableCell>{transaction.status}</TableCell>
            <TableCell>
              {`${transaction.hash.slice(0, 6)}...${transaction.hash.slice(
                -5
              )}`}
            </TableCell>
            <TableCell>{transaction.type}</TableCell>
            <TableCell>
              {`${transaction.hash.slice(0, 6)}...${transaction.hash.slice(
                -5
              )}`}
            </TableCell>
            <TableCell>{transaction.execution_status}</TableCell>
            <TableCell>{transaction.timestamp}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
