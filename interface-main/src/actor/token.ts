import { actor } from "./Actor";
import { ActorIdentity } from "../types/global";

import { _SERVICE as TokenService } from "../idls/token/token";
import { idlFactory as TokenIdlFactory } from "../idls/token/token.did";

import XTCService from "../idls/dip20/xtc";
import XTCIdlFactory from "../idls/dip20/xtc.did";
import DIP20Service from "../idls/dip20/dip20";
import DIP20IdlFactory from "../idls/dip20/dip20.did";

import DIP20BalanceService from "../idls/dip20/dip20_balance";
import DIP20BalanceIdlFactory from "../idls/dip20/dip20_balance.did";

import DIP20SupplyService from "../idls/dip20/dip20_supply";
import DIP20SupplyIdlFactory from "../idls/dip20/dip20_supply.did";

import { _SERVICE as ICRC1Service } from "../idls/icrc/icrc1";
import { idlFactory as ICRC1IdlFactory } from "../idls/icrc/icrc1.did";
import { _SERVICE as ICRC2Service } from "../idls/icrc/icrc2";
import { idlFactory as ICRC2IdlFactory } from "../idls/icrc/icrc2.did";

export const token = (canisterId: string, identity?: ActorIdentity) =>
  actor.create<TokenService>({
    identity,
    canisterId,
    idlFactory: TokenIdlFactory,
  });

export const xtc = (identity?: ActorIdentity) =>
  actor.create<XTCService>({
    identity,
    idlFactory: XTCIdlFactory,
    canisterId: "aanaa-xaaaa-aaaah-aaeiq-cai",
  });

export const dip20 = (canisterId: string, identity?: ActorIdentity) =>
  actor.create<DIP20Service>({
    identity,
    idlFactory: DIP20IdlFactory,
    canisterId,
  });

export const dip20BalanceActor = (canisterId: string, identity?: ActorIdentity) =>
  actor.create<DIP20BalanceService>({
    identity,
    idlFactory: DIP20BalanceIdlFactory,
    canisterId,
  });

export const dip20SupplyActor = (canisterId: string, identity?: ActorIdentity) =>
  actor.create<DIP20SupplyService>({
    identity,
    idlFactory: DIP20SupplyIdlFactory,
    canisterId,
  });

export const icrc1 = (canisterId: string, identity?: ActorIdentity) =>
  actor.create<ICRC1Service>({
    identity,
    idlFactory: ICRC1IdlFactory,
    canisterId,
  });

export const icrc2 = (canisterId: string, identity?: ActorIdentity) =>
  actor.create<ICRC2Service>({
    identity,
    idlFactory: ICRC2IdlFactory,
    canisterId,
  });
