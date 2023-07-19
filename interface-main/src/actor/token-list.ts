import { actor } from "./Actor";
import { ActorIdentity } from "../types/global";

import { _SERVICE as TokenList } from "../idls/token-list/TokenList";
import { idlFactory } from "../idls/token-list/TokenList.did";

import { ic_host } from "constants/index";

export const tokenList = (identity?: ActorIdentity) =>
  actor.create<TokenList>({
    canisterId: "5hl3d-3aaaa-aaaan-qapta-cai",
    identity,
    idlFactory: idlFactory,
    host: ic_host,
  });
