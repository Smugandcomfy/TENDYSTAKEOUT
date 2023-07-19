import { useCallsData } from "hooks/useCallsData";
import { enumResultFormat, nullParamsFormat } from "utils/sdk/index";
import { useCallback, useEffect, useMemo } from "react";
import { ckBTCActor } from "actor/ckBTC";
import { Principal } from "@dfinity/principal";
import { getActorIdentity } from "components/Identity";
import { UtxoStatus } from "../idls/ckBTCMint";
import {
  useUserBTCDepositAddress,
  useUpdateUserBTCDepositAddress,
  useUserBTCWithdrawAddress,
  useUpdateUserBTCWithdrawAddress,
} from "store/wallet/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useUserTxs } from "store/wallet/hooks";
import { useUpdateUserTx } from "store/wallet/hooks";
import { TxState } from "types/ckBTC";
import { useIntervalFetch } from "./useIntervalFetch";

export function isEndedState(state: TxState) {
  return !(state !== "Confirmed" && state !== "AmountTooLow");
}

export function useBTCDepositAddress(principal: string | undefined, subaccount?: Uint8Array) {
  const storeUserDepositAddress = useUserBTCDepositAddress(principal);
  const updateUserBTCAddress = useUpdateUserBTCDepositAddress();

  return useCallsData(
    useCallback(async () => {
      if (storeUserDepositAddress) return storeUserDepositAddress;

      const identity = await getActorIdentity();

      const address = enumResultFormat<string>(
        await (
          await ckBTCActor(identity)
        ).get_btc_address({
          owner: nullParamsFormat(Principal.fromText(principal!)),
          subaccount: nullParamsFormat<Uint8Array>(subaccount),
        })
      ).data;

      if (address && principal) {
        updateUserBTCAddress(principal, address);
      }

      return address;
    }, [principal, subaccount, storeUserDepositAddress]),
    !!principal
  );
}

export function useUpdateBalanceCallback() {
  return useCallback(async (principal: string | undefined, subaccount?: Uint8Array) => {
    const identity = await getActorIdentity();

    return enumResultFormat<Array<UtxoStatus>>(
      await (
        await ckBTCActor(identity)
      ).update_balance({
        owner: nullParamsFormat<Principal>(Principal.fromText(principal!)),
        subaccount: nullParamsFormat<Uint8Array>(subaccount),
      })
    );
  }, []);
}

export function useBTCWithdrawAddress() {
  const principal = useAccountPrincipalString();
  const storeAddress = useUserBTCWithdrawAddress(principal);
  const updateUserWithdrawAddress = useUpdateUserBTCWithdrawAddress();

  return useCallsData(
    useCallback(async () => {
      if (storeAddress)
        return {
          owner: Principal.fromText(storeAddress.owner),
          subaccount: storeAddress.subaccount,
        };

      const identity = await getActorIdentity();

      const address = enumResultFormat<{ owner: Principal; subaccount: [] | Uint8Array[] }>(
        await (await ckBTCActor(identity)).get_withdrawal_account()
      ).data;

      if (address) {
        updateUserWithdrawAddress(principal, address.owner, address.subaccount);
      }

      return address;
    }, [storeAddress?.owner]),
    !!principal
  );
}

export function useRetrieveBTCCallback() {
  return useCallback(async (address: string, amount: bigint) => {
    const identity = await getActorIdentity();

    return enumResultFormat<{
      block_index: bigint;
    }>(
      await (
        await ckBTCActor(identity)
      ).retrieve_btc({
        address,
        amount,
      })
    );
  }, []);
}

type VOut = {
  scriptpubkey: string;
  scriptpubkey_address: string;
  scriptpubkey_asm: string;
  scriptpubkey_type: string;
  value: number;
};

type VIn = {
  txid: string;
  vout: number;
  prevout: {
    scriptpubkey: string;
    scriptpubkey_asm: string;
    scriptpubkey_type: string;
    scriptpubkey_address: string;
    value: 200000;
  };
  scriptsig: string;
  scriptsig_asm: string;
};

export type BTCTx = {
  fee: number;
  locktime: number;
  size: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
  version: number;
  txid: string;
  weight: number;
  vout: VOut[];
  vin: VIn[];
};

export function useBTCTransactions(address: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      try {
        const result = await fetch(`https://blockstream.info/api/address/${address}/txs`);
        return (await result.json()) as BTCTx[];
      } catch (error) {
        return undefined;
      }
    }, [address]),
    !!address,
    reload
  );
}

export function useBTCTransaction(tx: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      try {
        const result = await fetch(`https://blockchain.info/rawtx/${tx}`);
        const json = await result.json();
        return json as BTCTx[];
      } catch (error) {
        return undefined;
      }
    }, [tx]),
    !!tx,
    reload
  );
}

export function useFetchUserTxStates() {
  const principal = useAccountPrincipalString();
  const txs = useUserTxs(principal);
  const updateUserTx = useUpdateUserTx();

  useEffect(() => {
    async function call() {
      if (txs && txs.length) {
        for (let i = 0; i < txs.length; i++) {
          const block_index = BigInt(txs[i].block_index);
          const state = txs[i].state;
          if (!isEndedState(state)) {
            const res = await (await ckBTCActor()).retrieve_btc_status({ block_index: block_index });
            updateUserTx(principal, block_index, res, undefined);
          }
        }
      }
    }

    let timer = setInterval(() => {
      call();
    }, 10000);

    return () => {
      clearInterval(timer);
    };
  }, [txs]);
}

export function useBTCCurrentBlock() {
  const call = async () => {
    try {
      const result = await fetch(`https://blockchain.info/q/getblockcount`);
      return (await result.json()) as number;
    } catch (error) {
      return undefined;
    }
  };

  const block = useIntervalFetch(call, undefined, 30000);

  return useMemo(() => block, [block]);
}
