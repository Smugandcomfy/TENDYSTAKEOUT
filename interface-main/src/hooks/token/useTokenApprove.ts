import { useCallback } from "react";
import { getActorIdentity } from "components/Identity";
import { useErrorTip, TIP_OPTIONS } from "hooks/useTips";
import { t } from "@lingui/macro";
import { useApprove } from "hooks/useAllowance";
import { useAccountPrincipal } from "store/auth/hooks";
import { isUseTransferByStandard } from "utils/token/index";
import { getTokenStandard } from "store/token/cache/hooks";
import { useTokenSubAccountTransfer } from "./useTokenSubAccountTransfer";

export function useTokenApprove() {
  const principal = useAccountPrincipal();
  const approve = useApprove();
  const [openErrorTip] = useErrorTip();

  return useCallback(
    async (token: string, amount: string, spender: string, options?: TIP_OPTIONS) => {
      const identity = await getActorIdentity();

      const { status, message } = await approve({
        canisterId: token,
        identity,
        spenderCanisterId: spender,
        value: amount,
        account: principal,
      });

      if (status === "err") {
        openErrorTip(t`Failed to approve ${token}: ${message}`, options);
        return false;
      }

      return true;
    },
    [approve, principal]
  );
}

export function useTokenTransferOrApprove() {
  const approve = useTokenApprove();
  const transfer = useTokenSubAccountTransfer();

  return useCallback(
    async (token: string, amount: string, address: string, options?: TIP_OPTIONS) => {
      const standard = getTokenStandard(token);

      if (!standard) return false;

      if (isUseTransferByStandard(standard)) {
        return await transfer(token, amount, address, options);
      }

      return await approve(token, amount, address, options);
    },
    [transfer, approve]
  );
}
