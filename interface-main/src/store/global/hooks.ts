import { useEffect, useMemo } from "react";
import { updateTokenList } from "./actions";
import { AppState } from "store/index";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { useTokenList } from "hooks/useTokenList";

export function useAccount() {
  return useAppSelector((state: AppState) => state.auth.account);
}

export interface SwapToken {
  canisterId: string;
  symbol: string;
  name: string;
}

export function useICPPrice() {
  const ICPPriceList = useICPPriceList();

  return useMemo(() => {
    if (ICPPriceList && ICPPriceList.length) {
      const price = ICPPriceList[ICPPriceList.length - 1]["value"];
      return price;
    }
    return undefined;
  }, [ICPPriceList]);
}

export function useICP2CyclesManager() {
  const ICPPriceList = useICPPriceList();

  return useMemo(() => {
    if (ICPPriceList && ICPPriceList.length) {
      return ICPPriceList[ICPPriceList.length - 1]?.xdr ?? 0;
    }
    return 0;
  }, [ICPPriceList]);
}

export function useXDR2USD() {
  return useAppSelector((state: AppState) => state.global.xdr_usdt);
}

export function useICPPriceList() {
  return useAppSelector((state: AppState) => state.global.ICPPriceList);
}

export function useCacheTokenList() {
  return useAppSelector((state: AppState) => state.global.requestTokenList);
}

export function useFetchGlobalTokenList() {
  const dispatch = useAppDispatch();
  const { result: tokenList, loading } = useTokenList();

  useEffect(() => {
    if (tokenList && tokenList.length > 0) {
      const _tokenList = tokenList.sort((a, b) => {
        if (a && b) {
          if (a.rank < b.rank) return -1;
          if (a.rank === b.rank) return 0;
          if (a.rank > b.rank) return 1;
        }

        return 0;
      });

      dispatch(updateTokenList(_tokenList));
    }
  }, [tokenList, dispatch]);

  return {
    loading,
    result: tokenList,
  };
}

export function useGlobalTokenList() {
  return useAppSelector((state: AppState) => state.global.tokenList);
}
