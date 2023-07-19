import { Principal } from "@dfinity/principal";
import { Override } from "utils/sdk/index";

export type { Holder, Transaction, HoldersRequest } from "../../idls/token/token";

export type TransactionRequest = {
  hash?: string;
  user?: User;
  offset?: number;
  limit?: number;
  index?: number;
};

export type User = { principal?: Principal; address?: string };

export type SetFeeToRequest = User;

export type BalanceRequest = { token: string; user: User; subaccount?: number[] };

export type TransferRequest = {
  to: User;
  token?: string;
  notify?: boolean;
  from: User;
  memo?: number[] | bigint;
  subaccount?: number[];
  nonce?: bigint;
  amount: bigint;
  create_at_time?: bigint;
  from_sub_account?: number[];
  fee?: bigint;
};

export type TokenTransferRequest = TransferRequest;

export type TokenAllowanceRequest = {
  owner: User;
  subaccount?: number[];
  spender: Principal;
};

export type Metadata = {
  decimals: number;
  ownerAccount: string;
  metadata: [] | [Array<number>];
  name: string;
  symbol: string;
};

export type ApproveRequest = {
  subaccount?: number[];
  allowance: bigint;
  spender: Principal;
  fee?: bigint;
};

export type TokenApproveRequest = Override<ApproveRequest, { account: string | Principal }>;

export type { Metadata as DIP20Metadata } from "../../idls/dip20/dip20";

export enum TOKEN_STANDARD {
  EXT = "EXT",
  DIP20 = "DIP20",
  ICP = "ICP",
  DIP20_WICP = "DIP20-WICP",
  DIP20_XTC = "DIP20-XTC",
  ICRC1 = "ICRC1",
  ICRC2 = "ICRC2",
}
