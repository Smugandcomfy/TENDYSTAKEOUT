import { ckBTC_MINTER_ID } from "constants/ckBTC";
import { _SERVICE } from "../idls/ckBTCMint";
import { idlFactory } from "idls/ckBTCMint.did";
import { actor } from "./Actor";
import { ActorIdentity } from "../types/global";

export const ckBTCActor = (identity?: ActorIdentity) =>
  actor.create<_SERVICE>({
    canisterId: ckBTC_MINTER_ID,
    identity,
    idlFactory,
  });
