import { ALL_CANISTER_IDS } from "./canister";
import { LEDGER_CANISTER_ID } from "./icp";
import { ckBTC_MINTER_ID } from "./ckBTC";

export const PLUG_AUTH_IDS = [...ALL_CANISTER_IDS, LEDGER_CANISTER_ID, ckBTC_MINTER_ID];
