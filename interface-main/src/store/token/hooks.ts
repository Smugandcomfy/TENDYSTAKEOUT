import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { updateTokenLogo, updateTokenFee } from "./actions";

export function useUpdateStateTokenLogo() {
  const dispatch = useAppDispatch();

  return useCallback(
    (logo: string | undefined, canisterId: string | undefined) => {
      if (logo && canisterId) {
        dispatch(updateTokenLogo({ logo, canisterId }));
      }
    },
    [dispatch]
  );
}

export function useStateTokenLogo(canisterId: string | undefined) {
  const logos = useAppSelector((state) => state.token.logos);

  return useMemo(() => {
    if (canisterId) {
      return logos[canisterId];
    }
  }, [canisterId, logos]);
}

export function useUpdateStateTokenFee() {
  const dispatch = useAppDispatch();

  return useCallback(
    (fee: string | undefined, canisterId: string | undefined) => {
      if (fee && canisterId) {
        dispatch(updateTokenFee({ fee, canisterId }));
      }
    },
    [dispatch]
  );
}

export function useStateTokenFee(canisterId: string | undefined) {
  const fees = useAppSelector((state) => state.token.fees);

  return useMemo(() => {
    if (canisterId) {
      return fees[canisterId];
    }
  }, [canisterId, fees]);
}
