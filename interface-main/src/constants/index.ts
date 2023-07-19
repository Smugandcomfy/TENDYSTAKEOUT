import { network, NETWORK } from "./server";

export const INFO_URL_MAP = {
  [NETWORK.IC]: "https://info.icpswap.com",
  [NETWORK.LOCAL]: "",
};

export const INFO_URL = INFO_URL_MAP[network];

export const APP_URL = "https://app.icpswap.com";

export const DAYJS_FORMAT = "YYYY-MM-DD HH:mm:ss";

export const ic_host = "https://icp0.io";

export * from "./canister";
export * from "./server";
export * from "./tokens";
export * from "./types";
export * from "./icp";
export * from "./wallet";
