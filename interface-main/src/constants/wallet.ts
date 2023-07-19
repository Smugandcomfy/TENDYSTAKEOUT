import { SNS1_ID } from "./sns1";
import { ckBTC_ID } from "./ckBTC";
import { XTC_METADATA, ICP_TOKEN_INFO } from "./tokens";
import { CHAT_ID } from "./chat";

export const DISPLAY_TOKENS_IN_IC = [XTC_METADATA.canisterId.toString(), CHAT_ID, SNS1_ID, ckBTC_ID];

export const DISPLAY_IN_WALLET_FOREVER = [ICP_TOKEN_INFO.canisterId, ...DISPLAY_TOKENS_IN_IC];
