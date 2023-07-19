import { Principal } from "@dfinity/principal";
import { Override } from "utils/sdk/index";
import { Transaction, ApproveRequest } from "../idls/token/token";
import { TOKEN_STANDARD } from "constants/tokens";

export type { Metadata as DIP20Metadata } from "idls/dip20/dip20";

export type {
  HoldersRequest,
  Holder,
  TransferRequest as TokenTransferRequest,
  TransferResponse as TokenTransferResponse,
  User as SetFeeToRequest,
  TransactionRequest,
} from "../idls/token/token";

export type BalanceRequest = { token: string; user: { [key: string]: string | Principal } };

export type TokenAllowanceRequest = {
  owner: { [key: string]: string | Principal };
  subaccount: [] | [Array<number>];
  spender: Principal;
};

export type TokenApproveRequest = Override<ApproveRequest, { account: string | Principal }>;

export interface TokenMetadata {
  decimals: number;
  ownerAccount: string;
  metadata: [] | [Array<number>];
  name: string;
  standard: TOKEN_STANDARD;
  symbol: string;
  canisterId: Principal;
}

export type { Transaction };

export type Metadata = {
  decimals: number;
  ownerAccount: string;
  metadata: [] | [Array<number>];
  name: string;
  symbol: string;
};

export type fungibleMetadata = {
  fungible: Metadata;
};

export type TokenInfo = Override<
  TokenMetadata,
  {
    logo: string;
    timestamp: bigint | null | undefined;
    totalSupply: bigint;
    transFee: bigint;
    canisterId: string;
    _canisterId: Principal;
    ownerAccount: string;
    totalHolders: bigint;
    standard: TOKEN_STANDARD;
  }
>;

export type CacheTokenInfo = Override<
  TokenMetadata,
  {
    logo: undefined | string;
    timestamp: bigint | null | undefined;
    totalSupply: bigint;
    transFee: bigint;
    canisterId: string;
    _canisterId: Principal;
    ownerAccount: string;
    totalHolders: bigint;
  }
>;

export interface TokenCanisterInfo {
  cycleAvailable: bigint;
  decimals: bigint;
  cycleBalance: bigint;
  owner: Principal;
  logo: string;
  name: string;
  totalSupply: bigint;
  timestamp: bigint;
  totalUsers: bigint;
  transFee: bigint;
  symbol: string;
  canisterId?: string;
}

export type ICPPriceInfo = {
  value: number;
  timestamp: string;
  xdr: string;
};

export type TokenAllowance = {
  spender: string;
  token: string;
  tokenCanisterId: string;
};

export type TransactionFiled = keyof Transaction;

export type TokenInfo__1 = {
  id: bigint;
  decimals: bigint;
  accountId: string;
  owner: Principal;
  logo: string;
  name: string;
  totalSupply: bigint;
  timestamp: bigint;
  transFee: bigint;
  symbol: string;
  canisterId: Principal;
};
