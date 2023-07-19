import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";

export interface HistoryTransaction {
  launchpadAddress: string;
  time: Time;
  operationType: string;
  tokenSymbol: string;
  address: string;
  quantity: string;
  tokenName: string;
  managerAddress: string;
}
export type NatResult = { ok: bigint } | { err: string };
export interface Page {
  content: Array<Property>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface Page_1 {
  content: Array<HistoryTransaction>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface Property {
  id: string;
  cid: string;
  receiveTokenDateTime: Time;
  creator: string;
  depositDateTime: [] | [Time];
  createdDateTime: Time;
  expectedFundraisingPricingTokenQuantity: string;
  settled: [] | [boolean];
  name: string;
  extraTokenFee: [] | [bigint];
  description: string;
  pricingTokenId: string;
  soldQuantity: string;
  fundraisingPricingTokenQuantity: [] | [string];
  soldTokenId: string;
  withdrawalDateTime: [] | [Time];
  limitedAmountOnce: string;
  endDateTime: Time;
  creatorPrincipal: Principal;
  soldTokenStandard: string;
  pricingTokenStandard: string;
  depositedQuantity: string;
  expectedSellQuantity: string;
  startDateTime: Time;
  initialExchangeRatio: string;
  canisterQuantity: bigint;
}
export type ResponseResult = { ok: Page } | { err: string };
export type ResponseResult_1 = { ok: Page_1 } | { err: string };
export type Time = bigint;
export interface _SERVICE {
  addSettledLaunchpad: ActorMethod<[Property], undefined>;
  addTransaction: ActorMethod<[string, HistoryTransaction], undefined>;
  cycleAvailable: ActorMethod<[], NatResult>;
  cycleBalance: ActorMethod<[], NatResult>;
  getHistoryTransactionsByPage: ActorMethod<[string, bigint, bigint], ResponseResult_1>;
  getSettledLaunchpadsByPage: ActorMethod<[bigint, bigint], ResponseResult>;
}
