import { TOKEN_STANDARD } from "constants/tokens";
import { getTokenStandard } from "store/token/cache/hooks";

export function isUseTransfer(token: undefined | string) {
  if (token === undefined) return false;

  if (typeof token === "string") {
    const standard = getTokenStandard(token);
    if (!standard) return false;
    return isUseTransferByStandard(standard);
  }

  return false;
}

export function isUseTransferByStandard(standard: TOKEN_STANDARD) {
  return standard.includes("ICRC1") || standard.includes("ICRC2") || standard === TOKEN_STANDARD.ICP;
}
