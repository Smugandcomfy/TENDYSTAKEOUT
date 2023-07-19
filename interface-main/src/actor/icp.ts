import { actor } from "./Actor";
import { ActorIdentity } from "../types/global";

import { _SERVICE as LedgerService } from "../idls/icp/ledger";
import { idlFactory as LedgerIdlFactory } from "../idls/icp/ledger.did";

import { _SERVICE as GovernanceService } from "../idls/icp/governance";
import GovernanceIdlFactory from "../idls/icp/governance.did";

import { LEDGER_CANISTER_ID, GOVERNANCE_CANISTER_ID, ic_host } from "../constants/index";

export const ledgerService = (identity?: ActorIdentity) =>
  actor.create<LedgerService>({
    idlFactory: LedgerIdlFactory,
    canisterId: LEDGER_CANISTER_ID,
    identity,
    host: ic_host,
  });

export const governanceService = (identity?: ActorIdentity) =>
  actor.create<GovernanceService>({
    idlFactory: GovernanceIdlFactory,
    canisterId: GOVERNANCE_CANISTER_ID,
    identity,
    host: ic_host,
  });
