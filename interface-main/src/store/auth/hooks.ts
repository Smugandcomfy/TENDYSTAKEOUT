import { useAppDispatch } from "store/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { updateLockStatus as _updateLockStatus, updateLoginAccount } from "../session/actions";
import { isPrincipal } from "utils/sdk/index";
import { login, logout, updateConnected, updateWalletConnector } from "./actions";
import store from "../index";
import { useAppSelector } from "store/hooks";
import { Connector } from "actor/Actor";
import { Principal } from "@dfinity/principal";
import {
  getConnectorIsConnected,
  getConnectorPrincipal,
  getConnectorAccountId,
  initialConnector,
} from "utils/connector";
import { actor } from "actor/Actor";

export function useWalletType() {
  return useAppSelector((state) => state.auth.walletType);
}

export function getWalletType() {
  return store.getState().auth.walletType;
}

export function useIsPlugWallet() {
  const walletType = useAppSelector((state) => state.auth.walletType);
  return walletType === Connector.PLUG;
}

export function useIsICPSwapWallet() {
  const walletType = useAppSelector((state) => state.auth.walletType);
  return walletType === Connector.ICPSwap;
}

export async function getWalletIsConnected() {
  const {
    auth: { walletType },
  } = store.getState();

  let isConnected = false;

  if (walletType) {
    await initialConnector(walletType);
    isConnected = await getConnectorIsConnected();
  }

  return isConnected;
}

export function useIsConnected() {
  return useAppSelector((state) => state.auth.isConnected);
}

export function getStoreWalletConnected() {
  const { auth } = store.getState();
  return auth.isConnected;
}

export function getStoreWalletUnlocked() {
  const { session } = store.getState();
  return session.isUnLocked;
}

export function useWalletConnectManager() {
  const dispatch = useAppDispatch();
  const isConnected = useIsConnected();
  const [loading, setLoading] = useState(true);

  const isUnLocked = useIsUnLocked();

  useEffect(() => {
    (async () => {
      const isConnected = await getWalletIsConnected();
      dispatch(updateConnected({ isConnected }));

      if (isConnected) {
        initialActorHttpAgent();
      }

      setLoading(false);
    })();
  }, [isUnLocked]);

  return useMemo(() => [isConnected, loading], [isConnected, loading]);
}

export function useIsUnLocked() {
  return useAppSelector((state) => state.session.isUnLocked);
}

export function useAccount() {
  return useAppSelector((state) => state.auth.account);
}

export function useAccountManager(): [string, (account: string) => Promise<void>] {
  const account = useAccount();
  const dispatch = useAppDispatch();

  const updateAccount = useCallback(
    async (account: string) => {
      await dispatch(updateLoginAccount(account));
    },
    [dispatch]
  );

  return [account, updateAccount];
}

export function updateLockStatus(locked: boolean) {
  store.dispatch(_updateLockStatus(locked));
}

export interface UpdateAuthProps {
  walletType: Connector;
}

export async function updateAuth({ walletType }: UpdateAuthProps) {
  const principal = await getConnectorPrincipal();
  const account = await getConnectorAccountId();

  store.dispatch(
    login({
      name: walletType,
      mnemonic: "",
      account,
      principal,
      walletType: walletType,
      password: "",
    })
  );

  store.dispatch(updateConnected({ isConnected: true }));
  store.dispatch(_updateLockStatus(false));
}

export function useUserLogout() {
  const dispatch = useAppDispatch();
  const [, updateAccount] = useAccountManager();
  const walletType = useWalletType();

  return useCallback(async () => {
    await dispatch(logout());
    if (walletType) window.icConnector.disconnect();
    await updateAccount("");
    await updateLockStatus(true);
    dispatch(updateConnected({ isConnected: false }));
  }, [dispatch, updateLockStatus, updateAccount]);
}

export function useAccountPrincipal(): Principal | undefined {
  const principal = useAppSelector((state) => state.auth.principal);

  return useMemo(() => {
    if (!principal) return undefined;

    if (isPrincipal(principal)) return principal as Principal;

    return Principal.fromText(principal);
  }, [principal]);
}

export function useAccountPrincipalString() {
  const principal = useAppSelector((state) => state.auth.principal);

  if (isPrincipal(principal)) return principal?.toString();

  return principal;
}

export function initialActorHttpAgent() {
  const { auth } = store.getState();
  const walletType = auth.walletType;

  if (!walletType) return;

  actor.setConnector(walletType);
}

export function useWalletConnectorManager(): [boolean, (open: boolean) => void] {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.auth.walletConnectorOpen);

  const manage = useCallback(
    (open: boolean) => {
      dispatch(updateWalletConnector(open));
    },
    [dispatch]
  );

  return [open, manage];
}
