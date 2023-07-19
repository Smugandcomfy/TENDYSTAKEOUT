import { useCallsData } from "../useCallsData";
import { useCallback } from "react";
import {
  numberToString,
  BigNumber,
  isValidPrincipal,
  isPrincipal,
  AccountIdentifier,
  SubAccount,
  enumResultFormat,
} from "utils/sdk/index";
import { ICP_TOKEN_INFO } from "constants/tokens";
import { Principal } from "@dfinity/principal";
import { ActorIdentity } from "types/index";
import { TokenInfo } from "types/token";
import { tokenList } from "actor/token-list";
import { getTokenStandard } from "store/token/cache/hooks";
import TokenDefaultLogo from "assets/images/Token_default_logo.png";
import { balanceAdapter, isNeedBalanceAdapter } from "utils/token/adapter";
import { Tokens } from "utils/adapter/Token";
import { TOKEN_STANDARD } from "constants/tokens";

export async function getTokenTotalHolder(canisterId: string | undefined) {
  if (!canisterId) return undefined;

  return (
    await Tokens.totalHolders({
      canisterId: canisterId!,
    })
  ).data;
}

export function useTokenTotalHolder(canisterId: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      return await getTokenTotalHolder(canisterId);
    }, [canisterId]),
    !!canisterId,
    reload
  );
}

export function useTokenHolders(canisterId: string, offset: bigint, limit: bigint) {
  return useCallsData(
    useCallback(async () => {
      return (
        await Tokens.holders({
          canisterId,
          params: {
            offset,
            limit,
          },
        })
      ).data;
    }, [offset, limit, canisterId]),
    !!canisterId && (!!offset || offset === BigInt(0)) && !!limit
  );
}

export interface TokenTransferProps {
  canisterId: string;
  to: string;
  amount: BigNumber | number;
  identity: ActorIdentity;
  from: string;
  subaccount?: number[];
  memo?: number[] | bigint;
}

export async function tokenTransfer({ canisterId, to, amount, identity, from, subaccount, memo }: TokenTransferProps) {
  return await Tokens.transfer({
    identity,
    canisterId: canisterId,
    params: {
      from: isValidPrincipal(from) ? { principal: Principal.fromText(from) } : { address: from },
      to: isValidPrincipal(to) ? { principal: Principal.fromText(to) } : { address: to },
      amount: BigInt(numberToString(amount)),
      subaccount,
      memo,
    },
  });
}

export async function getTokenBalance(
  canisterId: string,
  account: string | Principal,
  subAccountPrincipal?: Principal
) {
  if (isNeedBalanceAdapter(canisterId)) return await balanceAdapter(canisterId, account);

  const standard = getTokenStandard(canisterId);

  if (standard === TOKEN_STANDARD.EXT) {
    const address = isPrincipal(account)
      ? !!subAccountPrincipal
        ? AccountIdentifier.fromPrincipal({
            principal: account,
            subAccount: SubAccount.fromPrincipal(subAccountPrincipal),
          }).toHex()
        : AccountIdentifier.fromPrincipal({
            principal: account,
          }).toHex()
      : account;

    return await Tokens.balance({
      canisterId,
      params: {
        user: { address },
        token: "",
      },
    });
  }

  return await Tokens.balance({
    canisterId,
    params: {
      user: isPrincipal(account)
        ? { principal: account }
        : isValidPrincipal(account)
        ? { principal: Principal.fromText(account) }
        : { address: account },
      token: "",
      subaccount: subAccountPrincipal ? [...SubAccount.fromPrincipal(subAccountPrincipal).toUint8Array()] : undefined,
    },
  });
}

export async function getTokenTransFee(canisterId: string | undefined | null) {
  if (!canisterId) return undefined;
  return (await Tokens.getFee({ canisterId })).data;
}

export function useTokenTransFee(canisterId: string | undefined | null, reload?: boolean) {
  return useCallsData(
    useCallback(async () => await getTokenTransFee(canisterId), [canisterId]),
    !!canisterId,
    reload
  );
}

export function useTokenTransactions(canisterId: string, account: string | undefined, offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      return getTokenTransaction(canisterId, account, offset, limit);
    }, [offset, limit, canisterId]),
    !!canisterId && (!!offset || offset === 0) && !!limit
  );
}

export async function getTokenTransaction(
  canisterId: string,
  account: string | undefined,
  offset: number,
  limit: number
) {
  return (
    await Tokens.transactions({
      canisterId,
      params: {
        user: account ? { address: account } : undefined,
        offset: offset,
        limit: limit,
      },
    })
  ).data;
}

export async function getTokenSupply(canisterId: string | undefined) {
  if (!canisterId) return undefined;
  return (await Tokens.supply({ canisterId: canisterId! })).data;
}

export function useTokenSupply(canisterId: string | undefined, reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      return await getTokenSupply(canisterId);
    }, [canisterId]),
    !!canisterId,
    reload
  );
}

export async function getTokenMetadata(canisterId: string) {
  return Tokens.metadata({ canisterId });
}

export async function _getTokenMetadata(canisterId: string | undefined) {
  if (!canisterId) return undefined;
  return (await Tokens.metadata({ canisterId })).data;
}

export function useTokenMetadata(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => await _getTokenMetadata(canisterId!), [canisterId]),
    !!canisterId
  );
}

export async function getTokenLogo(canisterId: string | undefined) {
  if (!canisterId) return undefined;

  let logo: string | undefined = "";

  if (ICP_TOKEN_INFO.canisterId === canisterId) return ICP_TOKEN_INFO.logo;

  if (getTokenStandard(canisterId) === TOKEN_STANDARD.ICRC1) {
    const logo = enumResultFormat<string>(await (await tokenList()).getLogo(canisterId)).data;
    return !!logo ? logo : TokenDefaultLogo;
  }

  logo = await (await Tokens.logo({ canisterId: canisterId! })).data;

  return !!logo ? logo : TokenDefaultLogo;
}

export function useTokenLogo(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      return await getTokenLogo(canisterId);
    }, [canisterId]),
    !!canisterId
  );
}

export async function getTokenBaseInfo(canisterId: string | undefined) {
  if (!canisterId) return undefined;

  return Promise.all([getTokenSupply(canisterId), getTokenTotalHolder(canisterId), _getTokenMetadata(canisterId)]).then(
    ([supply, totalHolders, metadata]) => {
      return {
        timestamp: undefined,
        totalSupply: supply ?? BigInt(0),
        logo: "",
        transFee: BigInt(0),
        decimals: metadata?.decimals ?? 0,
        ownerAccount: metadata?.ownerAccount ?? "",
        metadata: [],
        name: metadata?.name ?? "",
        symbol: metadata?.symbol ?? "",
        canisterId: canisterId,
        _canisterId: Principal.fromText(canisterId),
        standard: getTokenStandard(canisterId) ?? TOKEN_STANDARD.EXT,
        totalHolders: totalHolders ?? BigInt(0),
      } as TokenInfo;
    }
  );
}

export async function getTokenInfo(canisterId: string | undefined) {
  if (!canisterId) return undefined;

  return Promise.all([getTokenLogo(canisterId), getTokenTransFee(canisterId), getTokenBaseInfo(canisterId)]).then(
    ([logo, fee, baseInfo]) => {
      return {
        timestamp: undefined,
        totalSupply: baseInfo?.totalSupply ?? BigInt(0),
        logo: logo ?? "",
        transFee: fee ?? BigInt(0),
        decimals: baseInfo?.decimals ?? 0,
        ownerAccount: baseInfo?.ownerAccount ?? "",
        metadata: [],
        name: baseInfo?.name ?? "",
        symbol: baseInfo?.symbol ?? "",
        canisterId: canisterId,
        _canisterId: Principal.fromText(canisterId),
        standard: getTokenStandard(canisterId) ?? TOKEN_STANDARD.EXT,
        totalHolders: baseInfo?.totalHolders ?? BigInt(0),
      } as TokenInfo;
    }
  );
}

export function useTokenInfo(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      return await getTokenInfo(canisterId);
    }, [canisterId]),
    !!canisterId
  );
}
