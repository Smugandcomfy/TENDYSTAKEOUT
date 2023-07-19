import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";

export type BoolResult = { ok: boolean } | { err: string };
export interface CanisterView {
  id: string;
  name: string;
  cycle: bigint;
}
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
  getInvestorDetail: ActorMethod<[string], ResponseResult_6>;
  getInvestors: ActorMethod<[], Array<Investor>>;
  getInvestorsSize: ActorMethod<[], bigint>;
  getPricingTokenQuantity: ActorMethod<[], ResponseResult_5>;
  install: ActorMethod<[Property, string, Array<string>], BoolResult>;
  transferByAddress: ActorMethod<[Principal, Principal, bigint, string, string], boolean>;
  uninstall: ActorMethod<[], BoolResult>;
  withdraw2Investor: ActorMethod<[], ResponseResult>;
}
export interface LaunchpadManager {
  archive: ActorMethod<[], undefined>;
  cycleAvailable: ActorMethod<[], NatResult>;
  cycleBalance: ActorMethod<[], NatResult>;
  generateTicket: ActorMethod<[string], ResponseResult_4>;
  getCanisters: ActorMethod<[], ResponseResult_7>;
  getDetail: ActorMethod<[], ResponseResult_1>;
  getInvestorsSize: ActorMethod<[], ResponseResult_5>;
  getLaunchpadCanisters: ActorMethod<[], Array<Principal>>;
  getPricingTokenQuantity: ActorMethod<[], ResponseResult_4>;
  getTicketPackage: ActorMethod<[string, string], ResponseResult_3>;
  getWhitelist: ActorMethod<[bigint, bigint], ResponseResult_2>;
  getWhitelistSize: ActorMethod<[], bigint>;
  inWhitelist: ActorMethod<[string], BoolResult>;
  install: ActorMethod<[Principal, Property, Array<string>], ResponseResult_1>;
  setController: ActorMethod<[string, string], boolean>;
  settle: ActorMethod<[], BoolResult>;
  uninstall: ActorMethod<[], BoolResult>;
  withdraw: ActorMethod<[], ResponseResult>;
}
export type NatResult = { ok: bigint } | { err: string };
export interface Page {
  content: Array<string>;
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
export type ResponseResult = { ok: TokenSet } | { err: string };
export type ResponseResult_1 = { ok: Property } | { err: string };
export type ResponseResult_2 = { ok: Page } | { err: string };
export type ResponseResult_3 = { ok: TicketPackage } | { err: string };
export type ResponseResult_4 = { ok: string } | { err: string };
export type ResponseResult_5 = { ok: bigint } | { err: string };
export type ResponseResult_6 = { ok: Investor } | { err: string };
export type ResponseResult_7 = { ok: Array<CanisterView> } | { err: string };
export interface TicketPackage {
  cid: string;
  ticket: string;
}
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
export interface _SERVICE extends LaunchpadManager {}
