import { Principal } from "@dfinity/principal";
import { enumResultFormat, isPrincipal } from "utils/sdk/index";
import { actor } from "../../actor/Actor";
import { ActorIdentity } from "types/global";

import { idlFactory as OGY_IDL } from "../../idls/ogy.did";
import { _SERVICE as OGY_SERVICE } from "../../idls/ogy";

const ORG_ID = "rd6wb-lyaaa-aaaaj-acvla-cai";

const ogy = async (identity?: ActorIdentity) =>
  actor.create<OGY_SERVICE>({ canisterId: ORG_ID, idlFactory: OGY_IDL, identity });

const BALANCE_ADAPTER_IDS = [ORG_ID];

export const isNeedBalanceAdapter = (canisterId: string) => BALANCE_ADAPTER_IDS.includes(canisterId);

export async function balanceAdapter(canisterId: string, account: string | Principal, subaccount?: number[]) {
  switch (canisterId) {
    case ORG_ID:
      if (isPrincipal(account)) {
        return enumResultFormat<bigint>(await (await ogy()).balanceOf(account));
      } else {
        throw Error("not support address");
      }
    default:
      throw Error("no canister id");
  }
}
