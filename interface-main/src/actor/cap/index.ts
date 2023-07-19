import { actor } from "../Actor";

import idlFactory from "./cap.did";
import CapService from "./cap";

import CapRouterIdlFactory from "./cap_router.did";
import CapRouterService from "./cap_router";

export const cap = (canisterId: string) =>
  actor.create<CapService>({
    idlFactory: idlFactory,
    canisterId,
  });

export const cap_router = () =>
  actor.create<CapRouterService>({
    idlFactory: CapRouterIdlFactory,
    canisterId: "lj532-6iaaa-aaaah-qcc7a-cai",
  });
