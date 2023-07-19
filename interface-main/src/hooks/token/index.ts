import { useMemo, useEffect, useState } from "react";
import { ICP_TOKEN_INFO, WRAPPED_ICP_TOKEN_INFO } from "constants/index";
import { TokenInfo, CacheTokenInfo } from "types/token";
import { getTokenBaseInfo, getTokenLogo, getTokenTransFee } from "./useTokenInfo";
import { useUpdateStateTokenInfo, useStateTokenInfo } from "store/token/cache/hooks";
import {
  useUpdateStateTokenLogo,
  useStateTokenLogo,
  useUpdateStateTokenFee,
  useStateTokenFee,
} from "store/token/hooks";
import store from "store/index";
import { updateTokenLogo, updateTokenFee } from "store/token/actions";
import { updateTokenInfo } from "store/token/cache/actions";
import { isValidPrincipal } from "utils/sdk";

export async function _getTokenLogo(tokenId: string) {
  const stateLogo = store.getState().token.logos[tokenId];
  if (stateLogo) return stateLogo;

  const logo = await getTokenLogo(tokenId);

  if (logo) {
    store.dispatch(updateTokenLogo({ canisterId: tokenId, logo }));
  }

  return logo;
}

export async function _getTokenFee(tokenId: string) {
  const stateFee = store.getState().token.fees[tokenId];
  if (stateFee) return stateFee;

  const fee = await getTokenTransFee(tokenId);

  if (fee) {
    store.dispatch(updateTokenFee({ canisterId: tokenId, fee: fee.toString() }));
  }

  return fee?.toString();
}

export async function _getTokenInfo(tokenId: string) {
  const stateTokenInfo = store.getState().tokenCache.tokens[tokenId];

  const logo = await _getTokenLogo(tokenId);
  const fee = await _getTokenFee(tokenId);

  if (logo === undefined || fee === undefined) return undefined;

  if (stateTokenInfo) {
    return {
      ...stateTokenInfo,
      logo: logo,
      transFee: BigInt(fee),
    } as TokenInfo;
  }

  const baseTokenInfo = await getTokenBaseInfo(tokenId);
  if (baseTokenInfo) {
    store.dispatch(updateTokenInfo(baseTokenInfo));
    return {
      ...baseTokenInfo,
      logo: logo,
      transFee: BigInt(fee),
    } as TokenInfo;
  }
}

export function useTokenLogo(tokenId: string | undefined) {
  const [tokenLogo, setTokenLogo] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const updateStateLogo = useUpdateStateTokenLogo();
  const stateTokenLogo = useStateTokenLogo(tokenId);

  useEffect(() => {
    if (stateTokenLogo) {
      setTokenLogo(stateTokenLogo);
    } else {
      if (tokenId) {
        setLoading(true);
        getTokenLogo(tokenId).then((logo) => {
          setTokenLogo(logo);
          updateStateLogo(logo, tokenId);
        });
        setLoading(false);
      }
    }
  }, [tokenId, stateTokenLogo]);

  return useMemo(() => {
    return {
      result: tokenLogo,
      loading,
    };
  }, [tokenLogo, loading]);
}

export function useTokenFee(tokenId: string | undefined) {
  const [fee, setFee] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const updateTokenFee = useUpdateStateTokenFee();
  const stateTokenFee = useStateTokenFee(tokenId);

  useEffect(() => {
    if (stateTokenFee) {
      setFee(stateTokenFee);
    } else {
      if (tokenId) {
        setLoading(true);
        getTokenTransFee(tokenId).then((fee) => {
          setFee(fee?.toString());
          updateTokenFee(fee?.toString(), tokenId);
        });
        setLoading(false);
      }
    }
  }, [tokenId, stateTokenFee]);

  return useMemo(() => {
    return {
      result: fee,
      loading,
    };
  }, [fee, loading]);
}

export function _useTokenInfo(tokenId: string | undefined) {
  const [tokenInfo, setTokenInfo] = useState<CacheTokenInfo | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const updateStateTokenInfo = useUpdateStateTokenInfo();
  const stateTokenInfo = useStateTokenInfo(tokenId);

  const { result: tokenLogo } = useTokenLogo(tokenId);
  const { result: tokenFee } = useTokenFee(tokenId);

  useEffect(() => {
    if (stateTokenInfo && !!stateTokenInfo.symbol) {
      setTokenInfo(stateTokenInfo);
    } else {
      if (tokenId) {
        setLoading(true);

        getTokenBaseInfo(tokenId).then((baseTokenInfo) => {
          setTokenInfo(baseTokenInfo);
          updateStateTokenInfo(baseTokenInfo);
          setLoading(false);
        });
      }
    }
  }, [tokenId, stateTokenInfo?.symbol]);

  return useMemo(() => {
    if (!tokenInfo || tokenLogo === undefined || tokenFee === undefined) {
      return {
        result: undefined,
        loading,
      };
    }

    return {
      result: {
        ...tokenInfo,
        logo: tokenLogo,
        transFee: BigInt(tokenFee),
      } as TokenInfo,
      loading,
    };
  }, [tokenInfo, loading, tokenLogo, tokenFee]);
}

export function useTokenInfo(tokenId: string | undefined) {
  let _tokenId =
    tokenId === ICP_TOKEN_INFO.canisterId || tokenId === WRAPPED_ICP_TOKEN_INFO.canisterId ? undefined : tokenId;

  if (tokenId && !isValidPrincipal(tokenId)) _tokenId = undefined;

  const { result: tokenInfo, loading } = _useTokenInfo(_tokenId);

  return useMemo(() => {
    if (!tokenId) return { result: undefined, loading: false };

    if (tokenId === ICP_TOKEN_INFO.canisterId) return { loading: false, result: ICP_TOKEN_INFO };
    if (tokenId === WRAPPED_ICP_TOKEN_INFO.canisterId) return { loading: false, result: WRAPPED_ICP_TOKEN_INFO };

    return { loading, result: tokenInfo };
  }, [tokenInfo, tokenId, loading]);
}
