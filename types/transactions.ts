export type Transactions = {
  items: {
    blockId: string;
    blockNumber: number;
    hash: string;
    index: number;
    type: string;
    sender_address: string;
    contract_address: string;
    timestamp: number;
    actual_fee: string;
    execution_status: "SUCCEEDED" | "PENDING" | "REVERTED";
    revert_error?: string;
    status: string;
    finality_status: string;
    operations?: string;
  }[];
  lastPage: number;
};