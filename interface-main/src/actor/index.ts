import { ActorIdentity } from "types/index";
import LedgerService from "../idls/ledger";
import LedgerIdlFactory from "../idls/ledger.did";
import { LEDGER_CANISTER_ID } from "constants/index";
import { actor } from "./Actor";

import { network, NETWORK } from "constants/server";
import canister_ids from "../constants/canister_ids.json";
import canister_ids_local from "../constants/canister_ids_local.json";

import { idlFactory as LaunchpadManagerIdl } from "../idls/LaunchpadManager.did";
import { _SERVICE as LaunchpadManager } from "../idls/LaunchpadManager";

import { idlFactory as LaunchpadCanisterIdl } from "../idls/LaunchpadCanister.did";
import { _SERVICE as LaunchpadCanister } from "../idls/LaunchpadCanister";

import { idlFactory as LaunchpadControllerIdl } from "../idls/LaunchpadController.did";
import { _SERVICE as LaunchpadController } from "../idls/LaunchpadController";

import { idlFactory as LaunchpadStorageIdl } from "../idls/LaunchpadStorage.did";
import { _SERVICE as LaunchpadStorage } from "../idls/LaunchpadStorage";

import { host } from "../constants/server";

actor.setHost(host);

function getCanisterId(canisterName: string) {
  if (network === NETWORK.LOCAL) {
    // @ts-ignore
    return canister_ids_local[canisterName].local;
  } else {
    // @ts-ignore
    return canister_ids[canisterName].ic;
  }
}

export const ledgerService = (identity?: ActorIdentity) =>
  actor.create<LedgerService>({ idlFactory: LedgerIdlFactory, canisterId: LEDGER_CANISTER_ID, identity });

export const launchpadManager = (canisterId: string, identity?: ActorIdentity) =>
  actor.create<LaunchpadManager>({
    idlFactory: LaunchpadManagerIdl,
    canisterId: canisterId,
    identity,
  });

export const launchpadController = (identity?: ActorIdentity) =>
  actor.create<LaunchpadController>({
    idlFactory: LaunchpadControllerIdl,
    canisterId: getCanisterId("LaunchpadController"),
    identity,
  });

export const launchpadCanister = (canisterId: string, identity?: ActorIdentity) =>
  actor.create<LaunchpadCanister>({
    idlFactory: LaunchpadCanisterIdl,
    canisterId: canisterId,
    identity,
  });

export const launchpadStorage = (canisterId: string, identity?: ActorIdentity) =>
  actor.create<LaunchpadStorage>({
    idlFactory: LaunchpadStorageIdl,
    canisterId: canisterId,
    identity,
  });
