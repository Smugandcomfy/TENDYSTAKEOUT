import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";

export type BoolResult = { ok: boolean } | { err: string };
export interface Investor {
  id: string;
  finalTokenSet: [] | [TokenSet];
  principal: Principal;
  participatedDateTime: Time;
  withdrawalDateTime: [] | [Time];
  expectedBuyTokenQuantity: string;
  expectedDepositedPricingTokenQuantity: string;
}
export interface LaunchpadCanister {
  addInvestor: ActorMethod<[], BoolResult>;
  addInvestorAddress: ActorMethod<[string], undefined>;
  addInvestorFromApprove: ActorMethod<[string], BoolResult>;
  appendPricingTokenQuantity: ActorMethod<[], BoolResult>;
  appendPricingTokenQuantityFromApprove: ActorMethod<[string], BoolResult>;
  computeFinalTokenViewSet: ActorMethod<[bigint, bigint], TokenViewSet>;
  cycleAvailable: ActorMethod<[], NatResult>;
  cycleBalance: ActorMethod<[], NatResult>;
  getInvestorDetail: ActorMethod<[string], ResponseResult_2>;
  getInvestors: ActorMethod<[], Array<Investor>>;
  getInvestorsSize: ActorMethod<[], bigint>;
  getPricingTokenQuantity: ActorMethod<[], ResponseResult_1>;
  install: ActorMethod<[Property, string, Array<string>], BoolResult>;
  transferByAddress: ActorMethod<[Principal, Principal, bigint, string, string], boolean>;
  uninstall: ActorMethod<[], BoolResult>;
  withdraw2Investor: ActorMethod<[], ResponseResult>;
}
export type NatResult = { ok: bigint } | { err: string };
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
}
export type ResponseResult = { ok: TokenSet } | { err: string };
export type ResponseResult_1 = { ok: bigint } | { err: string };
export type ResponseResult_2 = { ok: Investor } | { err: string };
export type Time = bigint;
export interface TokenInfo {
  logo: string;
  name: string;
  quantity: string;
  symbol: string;
}
export interface TokenSet {
  token: TokenInfo;
  pricingToken: TokenInfo;
}
export interface TokenViewSet {
  token: { info: TokenInfo; transFee: bigint };
  pricingToken: { info: TokenInfo; transFee: bigint };
}
export interface _SERVICE extends LaunchpadCanister {}
