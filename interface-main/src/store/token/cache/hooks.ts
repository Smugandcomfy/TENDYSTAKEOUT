import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { updateTokenInfo, updateTokenStandard, updateImportedToken } from "./actions";
import { CacheTokenInfo, TokenMetadata } from "types/token";
import store from "store/index";
import { TOKEN_STANDARD } from "constants/tokens";

export function useUpdateStateTokenInfo() {
  const dispatch = useAppDispatch();

  return useCallback(
    (tokenInfo: CacheTokenInfo | undefined) => {
      if (tokenInfo) {
        dispatch(updateTokenInfo(tokenInfo));
      }
    },
    [dispatch]
  );
}

export function useStateTokenInfo(canisterId: string | undefined | null) {
  const tokens = useAppSelector((state) => state.tokenCache.tokens);

  return useMemo(() => {
    if (canisterId) {
      return tokens[canisterId];
    }
  }, [canisterId, tokens]);
}

export function useUpdateTokenStandard() {
  const dispatch = useAppDispatch();

  return useCallback(
    ({ canisterId, standard }: { canisterId: string; standard: TOKEN_STANDARD }) => {
      if (canisterId) {
        dispatch(updateTokenStandard({ canisterId, standard }));
      }
    },
    [dispatch]
  );
}

export function useTokenStandard(canisterId: string | undefined) {
  const standards = useAppSelector((state) => state.tokenCache.standards);

  return useMemo(() => {
    if (canisterId) {
      return standards[canisterId];
    }
  }, [canisterId, standards]);
}

export function getTokenStandard(canisterId: string | undefined) {
  const {
    tokenCache: { standards },
  } = store.getState();

  if (canisterId) {
    return standards[canisterId];
  }
}

export function useUpdateImportedToken() {
  const dispatch = useAppDispatch();

  return useCallback(
    (canisterId: string, metadata: TokenMetadata) => {
      dispatch(updateImportedToken({ canisterId, metadata }));
    },
    [dispatch]
  );
}

export function useImportedTokens() {
  return useAppSelector((state) => state.tokenCache.importedTokens);
}

export function useTokenStandards() {
  return useAppSelector((state) => state.tokenCache.standards);
}
