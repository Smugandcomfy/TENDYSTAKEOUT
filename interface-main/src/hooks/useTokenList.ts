import { useCallback } from "react";
import { useCallsData } from "hooks/useCallsData";
import { tokenList } from "actor/token-list";
import { enumResultFormat } from "utils/sdk/index";
import { TokenMetadata } from "types/token-list";
import { network, NETWORK } from "constants/server";

export function useTokenList() {
  return useCallsData(
    useCallback(async () => {
      if (network !== NETWORK.IC) return [];
      return enumResultFormat<TokenMetadata[]>(await (await tokenList()).getList()).data;
    }, [])
  );
}
