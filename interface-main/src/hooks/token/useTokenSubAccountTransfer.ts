import { useCallback } from "react";
import { AccountIdentifier, SubAccount } from "utils/sdk/index";
import { BigNumber } from "utils/sdk/index";
import { getActorIdentity } from "components/Identity";
import { useErrorTip, TIP_OPTIONS } from "hooks/useTips";
import { t } from "@lingui/macro";
import { useAccountPrincipal } from "store/auth/hooks";
import { tokenTransfer } from "hooks/token/useTokenTransfer";
import { Principal } from "@dfinity/principal";
import { ICP_TOKEN_INFO } from "constants/tokens";

export function useTokenSubAccountTransfer() {
  const [openErrorTip] = useErrorTip();

  const principal = useAccountPrincipal();

  return useCallback(
    async (token: string, amount: string, address: string, options?: TIP_OPTIONS) => {
      const identity = await getActorIdentity();

      const subAccount = SubAccount.fromPrincipal(principal!);
      const account_identifier = AccountIdentifier.fromPrincipal({
        principal: Principal.fromText(address),
        subAccount: subAccount,
      });

      const { status, message } = await tokenTransfer({
        identity,
        to: token === ICP_TOKEN_INFO.canisterId ? account_identifier.toHex() : address,
        canisterId: token,
        amount: new BigNumber(amount),
        from: principal?.toString() ?? "",
        subaccount: [...subAccount.toUint8Array()],
      });

      if (status === "err") {
        openErrorTip(t`Failed to transfer ${token}: ${message}`, options);
        return false;
      }

      return true;
    },
    [principal]
  );
}
