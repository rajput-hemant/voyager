export type Transaction = {
  header: Header;
  // contractAddressSalt: any;
  // selector: any;
  maxFee?: string;
  usdFormattedMaxFee?: string;
  usdHistoricalFormattedMaxFee?: string;
  actualFee: string;
  actualFeeUnit: string;
  gasConsumed: string;
  nonce?: string;
  version: string;
  receipt: Receipt;
  executionResources: ExecutionResources;
  statusTimeRemaining: number;
  // revert_error: any;
};

export type Header = {
  blockId: string;
  blockNumber: number;
  hash: string;
  index: number;
  // l1VerificationHash: any;
  type: string;
  contract_address: string;
  sender_address: string;
  timestamp: number;
  signature: string[];
  // class_hash: any;
  execution_status: string;
  status: string;
  finality_status: string;
  // classAlias: any;
  // senderAlias: any;
  // contractAlias: any;
};

export type Receipt = {
  events: Event[];
  messages: number;
  tokensTransferred: TokensTransferred[];
  feeTransferred: FeeTransferred[];
};

export type Event = {
  blockNumber: number;
  fromAddress: string;
  blockHash: string;
  timestamp: number;
  selector: string;
  name: string;
  nestedName: string;
  // nestedEventNames: any[];
  id: string;
  contractAlias?: string;
};

export type TokensTransferred = {
  from: string;
  to: string;
  amount: string;
  function: string;
  tokenId: string;
  tokenAddress: string;
  symbol: string;
  decimals: number;
  usd: string;
  usdPrice: number;
  // usdHistoricalPrice: any;
  // usdHistorical: any;
  fromAlias?: string;
  toAlias?: string;
  index: string;
  tokenName: string;
};

export type FeeTransferred = {
  from: string;
  to: string;
  amount: string;
  function: string;
  tokenId: string;
  tokenAddress: string;
  symbol: string;
  decimals: number;
  usd: string;
  usdPrice: number;
  // usdHistoricalPrice: any;
  // usdHistorical: any;
  // fromAlias: any;
  toAlias: string;
  index: string;
  tokenName: string;
};

export type ExecutionResources = {
  steps: number;
  data_availability: DataAvailability;
  ec_op_builtin_applications: number;
  pedersen_builtin_applications: number;
  range_check_builtin_applications: number;
};

export type DataAvailability = {
  l1_gas: number;
  l1_data_gas: number;
};
