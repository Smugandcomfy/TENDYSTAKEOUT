import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";

export type BoolResult = { ok: boolean } | { err: string };
export interface CanisterView {
  id: string;
  name: string;
  cycle: bigint;
}
export type NatResult = { ok: bigint } | { err: string };
export interface Page {
  content: Array<Property>;
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
export type ResponseResult = { ok: Property } | { err: string };
export type ResponseResult_1 = { ok: Page } | { err: string };
export type ResponseResult_2 = { ok: Array<CanisterView> } | { err: string };
export type ResponseResult_3 = { ok: string } | { err: string };
export type Time = bigint;
export interface _SERVICE {
  addWhitelist: ActorMethod<[Array<string>], boolean>;
  archive: ActorMethod<[], BoolResult>;
  cycleAvailable: ActorMethod<[], NatResult>;
  cycleBalance: ActorMethod<[], NatResult>;
  deleteWhitelist: ActorMethod<[Array<string>], boolean>;
  generate: ActorMethod<[Property], ResponseResult_3>;
  getAllPools: ActorMethod<[string, bigint, bigint], ResponseResult_1>;
  getCanisters: ActorMethod<[], ResponseResult_2>;
  getPoolsByOwner: ActorMethod<[string, bigint, bigint], ResponseResult_1>;
  getWhitelist: ActorMethod<[], Array<string>>;
  install: ActorMethod<[string, Property, Array<string>], ResponseResult>;
  result: ActorMethod<[], string>;
  setController: ActorMethod<[string, string], boolean>;
  uninstall: ActorMethod<[], BoolResult>;
}
