import { useEffect, useState, useMemo } from "react";
import { XTC_METADATA, TOKEN_STANDARD, ICP_TOKEN_INFO, WRAPPED_ICP_TOKEN_INFO } from "constants/tokens";
import { network, NETWORK } from "constants/server";
import { useUpdateTokenStandard, useTokenStandards } from "store/token/cache/hooks";
import { useGlobalTokenList } from "store/global/hooks";
import { registerTokens } from "../utils/adapter/Token";
import { useAllPools } from "hooks/launchpad/index";

export const Tokens = [XTC_METADATA];

export function useInitialTokenStandard({ fetchGlobalTokensLoading }: { fetchGlobalTokensLoading: boolean }) {
  const [tokensLoading, setTokensLoading] = useState(true);
  const [registerLoading, setRegisterLoading] = useState(true);

  const [launchpadLoading, setLaunchpadLoading] = useState(true);

  const updateTokenStandard = useUpdateTokenStandard();

  const globalTokenList = useGlobalTokenList();

  const tokenStandards = useTokenStandards();

  const { result: launchpadPools, loading: launchpadFetchLoading } = useAllPools();

  useEffect(() => {
    if (network === NETWORK.IC) {
      Tokens.forEach((token) => {
        updateTokenStandard({
          canisterId: token.canisterId.toString(),
          standard: token.standard as TOKEN_STANDARD,
        });
      });
    }

    updateTokenStandard({
      canisterId: ICP_TOKEN_INFO.canisterId,
      standard: ICP_TOKEN_INFO.standard as TOKEN_STANDARD,
    });
  }, [network, NETWORK]);

  useEffect(() => {
    if (globalTokenList && globalTokenList.length > 0) {
      globalTokenList.forEach((token) => {
        updateTokenStandard({
          canisterId: token.canisterId,
          standard: token.standard as TOKEN_STANDARD,
        });
      });
      setTokensLoading(false);
    } else {
      if (!fetchGlobalTokensLoading) {
        setTokensLoading(false);
      }
    }
  }, [globalTokenList]);

  useEffect(() => {
    setRegisterLoading(true);

    if (tokenStandards) {
      Object.keys(tokenStandards).forEach((canisterId) => {
        registerTokens({ canisterIds: [canisterId], standard: tokenStandards[canisterId] });
      });
    }

    if (network === NETWORK.IC) {
      registerTokens({ canisterIds: [XTC_METADATA.canisterId.toString()], standard: XTC_METADATA.standard });
    }

    registerTokens({
      canisterIds: [WRAPPED_ICP_TOKEN_INFO.canisterId],
      standard: WRAPPED_ICP_TOKEN_INFO.standard as TOKEN_STANDARD,
    });
    registerTokens({ canisterIds: [ICP_TOKEN_INFO.canisterId], standard: ICP_TOKEN_INFO.standard as TOKEN_STANDARD });

    setRegisterLoading(false);
  }, [tokenStandards]);

  useEffect(() => {
    setLaunchpadLoading(true);

    if (launchpadPools && launchpadPools.length) {
      launchpadPools.forEach((pool) => {
        updateTokenStandard({
          canisterId: pool.soldTokenId,
          standard: pool.soldTokenStandard as TOKEN_STANDARD,
        });

        updateTokenStandard({
          canisterId: pool.pricingTokenId,
          standard: pool.pricingTokenStandard as TOKEN_STANDARD,
        });
      });

      setLaunchpadLoading(false);
    } else {
      if (!launchpadFetchLoading && launchpadPools.length === 0) {
        setLaunchpadLoading(false);
      }
    }
  }, [launchpadPools, launchpadFetchLoading]);

  return useMemo(() => {
    return {
      loading: fetchGlobalTokensLoading || tokensLoading || registerLoading || launchpadLoading,
    };
  }, [tokensLoading, fetchGlobalTokensLoading, registerLoading, launchpadLoading]);
}
