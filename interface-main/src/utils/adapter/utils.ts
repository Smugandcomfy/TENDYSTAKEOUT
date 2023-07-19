import { DIP20Adapter, DIP20WICPAdapter, DIP20XTCAdapter, EXTAdapter, icrc1Adapter, icrc2Adapter } from "./Token";
import { icrc1, icrc2 } from "../../actor/token";
import { TOKEN_STANDARD, Metadata } from "./types";
import { Transaction } from "../../idls/icrc/icrc1";
import { Transaction as TokenTransaction } from "./types";
import { AccountIdentifier, SubAccount, isErrorSubAccount } from "utils/sdk/index";

export async function tokenStandardVerification(canisterId: string, standard: TOKEN_STANDARD) {
  let valid = false;
  let metadata: undefined | Metadata | null = null;
  let logo: undefined | string | null = null;

  if (standard === TOKEN_STANDARD.DIP20) {
    try {
      metadata = (await DIP20Adapter.metadata({ canisterId })).data;
      logo = (await DIP20Adapter.logo({ canisterId })).data;
      if (metadata?.symbol && metadata?.symbol !== "WICP" && metadata?.symbol !== "XTC") valid = true;
    } catch (error) {
      console.error(error);
      valid = false;
    }
  } else if (standard === TOKEN_STANDARD.DIP20_WICP) {
    try {
      metadata = (await DIP20WICPAdapter.metadata({ canisterId })).data;
      logo = (await DIP20Adapter.logo({ canisterId })).data;
      if (metadata?.symbol && metadata?.symbol === "WICP") valid = true;
    } catch (error) {
      console.error(error);
      valid = false;
    }
  } else if (standard === TOKEN_STANDARD.DIP20_XTC) {
    try {
      metadata = (await DIP20XTCAdapter.metadata({ canisterId })).data;
      logo = (await DIP20Adapter.logo({ canisterId })).data;
      if (metadata?.symbol && metadata.symbol === "XTC") valid = true;
    } catch (error) {
      console.error(error);
      valid = false;
    }
  } else if (standard === TOKEN_STANDARD.EXT) {
    try {
      metadata = (await EXTAdapter.metadata({ canisterId })).data;
      logo = (await EXTAdapter.logo({ canisterId })).data;
      if (metadata?.symbol) valid = true;
    } catch (error) {
      console.error(error);
      valid = false;
    }
  } else if (standard === TOKEN_STANDARD.ICRC2) {
    try {
      metadata = (await icrc2Adapter.metadata({ canisterId })).data;

      const standards = await (await icrc2(canisterId)).icrc1_supported_standards();

      let _valid = false;

      for (let i = 0; i < standards.length; i++) {
        if (standards[i].name.includes("ICRC-2")) {
          _valid = true;
          break;
        }
      }

      if (metadata?.symbol && _valid) valid = true;
    } catch (error) {
      console.error(error);
      valid = false;
    }
  } else if (standard === TOKEN_STANDARD.ICRC1) {
    try {
      metadata = (await icrc1Adapter.metadata({ canisterId })).data;
      const standards = await (await icrc1(canisterId)).icrc1_supported_standards();

      let _valid = false;

      for (let i = 0; i < standards.length; i++) {
        if (standards[i].name.includes("ICRC-1")) {
          _valid = true;
          break;
        }
      }

      if (metadata?.symbol && !!_valid) valid = true;
    } catch (error) {
      console.error(error);
      valid = false;
    }
  }

  return {
    valid,
    metadata,
    logo,
  };
}

export function isBigIntMemo(val: bigint | number[] | undefined): val is bigint {
  if (typeof val === "bigint") return true;
  return false;
}

export function icrcTransactionFormat(transaction: Transaction, index: bigint) {
  const memo = !!transaction.transfer[0]?.memo.length
    ? transaction.transfer[0]?.memo
    : !!transaction.burn[0]?.memo.length
    ? transaction.burn[0]?.memo
    : !!transaction.mint[0]?.memo.length
    ? transaction.mint[0]?.memo
    : undefined;

  const _from = transaction.transfer[0]?.from.owner ?? transaction.burn[0]?.from.owner;
  const _from_sub = transaction.transfer[0]?.from.subaccount[0] ?? transaction.burn[0]?.from.subaccount[0];
  const _to = transaction.transfer[0]?.to.owner ?? transaction.mint[0]?.to.owner;
  const _to_sub = transaction.transfer[0]?.to.subaccount[0] ?? transaction.mint[0]?.to.subaccount[0];

  const from_sub = _from_sub ? SubAccount.fromBytes(Uint8Array.from(_from_sub)) : undefined;
  const from = _from
    ? AccountIdentifier.fromPrincipal({
        principal: _from,
        subAccount: isErrorSubAccount(from_sub) ? from_sub : undefined,
      })
    : undefined;

  const to_sub = _to_sub ? SubAccount.fromBytes(Uint8Array.from(_to_sub)) : undefined;
  const to = _to
    ? AccountIdentifier.fromPrincipal({
        principal: _to,
        subAccount: isErrorSubAccount(to_sub) ? to_sub : undefined,
      })
    : undefined;

  return {
    timestamp: transaction.timestamp,
    hash: "",
    fee: transaction.transfer[0]?.fee[0] ?? BigInt(0),
    from: from ? from.toHex() : "",
    to: to ? to.toHex() : "",
    transType: !!transaction.transfer[0]
      ? { transfer: null }
      : !!transaction.burn[0]
      ? { burn: null }
      : !!transaction.mint[0]
      ? { mint: null }
      : { approve: null },
    amount: transaction.transfer[0]?.amount ?? transaction.burn[0]?.amount ?? transaction.mint[0]?.amount,
    index,
    memo: memo ? [[...memo[0]]] : [],
    status: "",
  } as TokenTransaction;
}
