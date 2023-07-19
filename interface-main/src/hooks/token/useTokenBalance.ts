import { useLatestDataCall } from "../useCallsData";
import { useCallback } from "react";
import { BigNumber, isValidPrincipal, isPrincipal, AccountIdentifier, SubAccount } from "utils/sdk/index";
import { Principal } from "@dfinity/principal";
import { getTokenStandard } from "store/token/cache/hooks";
import { balanceAdapter, isNeedBalanceAdapter } from "utils/token/adapter";
import { Tokens } from "utils/adapter/Token";
import { TOKEN_STANDARD } from "constants/tokens";

export async function getTokenBalance(
  canisterId: string,
  account: string | Principal,
  subAccountPrincipal?: Principal
) {
  if (isNeedBalanceAdapter(canisterId)) return await balanceAdapter(canisterId, account);

  const standard = getTokenStandard(canisterId);

  if (standard === TOKEN_STANDARD.EXT) {
    const address = isPrincipal(account)
      ? !!subAccountPrincipal
        ? AccountIdentifier.fromPrincipal({
            principal: account,
            subAccount: SubAccount.fromPrincipal(subAccountPrincipal),
          }).toHex()
        : AccountIdentifier.fromPrincipal({
            principal: account,
          }).toHex()
      : account;

    return await Tokens.balance({
      canisterId,
      params: {
        user: { address },
        token: "",
      },
    });
  }

  return await Tokens.balance({
    canisterId,
    params: {
      user: isPrincipal(account)
        ? { principal: account }
        : isValidPrincipal(account)
        ? { principal: Principal.fromText(account) }
        : { address: account },
      token: "",
      subaccount: subAccountPrincipal ? [...SubAccount.fromPrincipal(subAccountPrincipal).toUint8Array()] : undefined,
    },
  });
}

export async function _getTokenBalance(canisterId: string | undefined, account: string | undefined | Principal) {
  if (!account || !canisterId) return new BigNumber(0);
  const { data } = await getTokenBalance(canisterId, account);
  return new BigNumber(data ? String(data) : 0);
}

export function useTokenBalance(
  canisterId: string | undefined,
  account: string | Principal | undefined,
  refresh?: number | boolean
) {
  return useLatestDataCall(
    useCallback(() => _getTokenBalance(canisterId, account), [account, canisterId]),
    true,
    refresh
  );
}
