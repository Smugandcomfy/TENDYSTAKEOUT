import { useMemo, useEffect, useState } from "react";
import { useValuesManager } from "store/launchpad/hooks";
import { TOKEN_STANDARD } from "constants/index";
import { standardCheck } from "utils/token/standardCheck";
import { MessageTypes, useTips } from "hooks/useTips";
import { TokenInfo } from "types/token";
import { useUpdateTokenStandard } from "store/token/cache/hooks";
import { getTokenInfo } from "hooks/token/useTokenInfo";
import { isValidPrincipal } from "utils/sdk/index";

export function useTokens() {
  const [values] = useValuesManager();

  const [openTip] = useTips();
  const [depositTokenInfo, setDepositTokenInfo] = useState<TokenInfo | undefined>(undefined);
  const [soldTokenInfo, setSoldTokenInfo] = useState<TokenInfo | undefined>(undefined);

  const updateTokenStandard = useUpdateTokenStandard();

  useEffect(() => {
    async function call() {
      if (values.depositTokenId && values.depositTokenStandard && isValidPrincipal(values.depositTokenId)) {
        const { valid: rewardTokenValid } = await standardCheck(
          values.depositTokenId,
          values.depositTokenStandard as TOKEN_STANDARD
        );

        if (!rewardTokenValid) {
          openTip("Incorrect deposit token standard", MessageTypes.error);
          return false;
        }

        updateTokenStandard({
          canisterId: values.depositTokenId,
          standard: values.depositTokenStandard as TOKEN_STANDARD,
        });

        const rewardTokenInfo = await getTokenInfo(values.depositTokenId);

        setDepositTokenInfo(rewardTokenInfo);
      }
    }

    call();
  }, [values.depositTokenId, values.depositTokenStandard]);

  useEffect(() => {
    async function call() {
      if (values.soldTokenId && values.soleTokenStandard && isValidPrincipal(values.soldTokenId)) {
        const { valid: rewardTokenValid } = await standardCheck(values.soldTokenId, values.soleTokenStandard);

        if (!rewardTokenValid) {
          openTip("Incorrect sold token standard", MessageTypes.error);
          return false;
        }

        updateTokenStandard({
          canisterId: values.soldTokenId,
          standard: values.soleTokenStandard,
        });

        const soldTokenInfo = await getTokenInfo(values.soldTokenId);

        setSoldTokenInfo(soldTokenInfo);
      }
    }

    call();
  }, [values.soldTokenId, values.soleTokenStandard]);

  return useMemo(() => ({ depositTokenInfo, soldTokenInfo }), [depositTokenInfo, soldTokenInfo]);
}
