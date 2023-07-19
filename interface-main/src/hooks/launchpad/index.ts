import { useMemo, useCallback } from "react";
import { t } from "@lingui/macro";
import { useValuesManager } from "store/launchpad/hooks";
import { formatDollarAmount } from "utils/sdk/index";
import { useICPPrice } from "store/global/hooks";
import { launchpadManager, launchpadController, launchpadCanister } from "../../actor/index";
import {
  formatTokenAmount,
  parseTokenAmount,
  numberToString,
  isValidQueryPagination,
  nullParamsFormat,
  BigNumber,
  enumResultFormat,
} from "utils/sdk/index";
import { TOKEN_STANDARD, WRAPPED_ICP_TOKEN_INFO } from "constants/index";
import { useCallsData, usePaginationAllData } from "hooks/useCallsData";
import { useTokenInfo } from "hooks/token";
import { formatExchangeRatio, parseExchangeRatio } from "utils/launchpad";
import { ActorIdentity, PaginationResult } from "types/index";
import { Property, TokenSet, Investor } from "types/launchpad";
import { Values } from "store/launchpad/states";
import { Principal } from "@dfinity/principal";
import { isValidPrincipal } from "utils/sdk/index";

function millisecond2Nanosecond(time: number | string) {
  return new BigNumber(new Date(time).getTime()).multipliedBy(1000000).toNumber();
}

function getErrorMessage(values: Values, actualSoldAmount: BigNumber): string {
  if (!values.name) return t`Enter the name`;
  if (!values.description) return t`Enter the description`;
  if (!values.startDateTime || !values.endDateTime) return t`Select the range time`;
  if (values.startDateTime >= values.endDateTime) return t`Invalid range time`;
  if (!values.soldTokenId) return t`Enter the sale token canister id`;
  if (!values.soleTokenStandard) return t`Select the sale token standard`;
  if (!isValidPrincipal(values.soldTokenId)) return t`Invalid sale token id`;
  if (!values.depositTokenId) return t`Enter the deposit token canister id`;
  if (!values.depositTokenStandard) return t`Select the deposit token standard`;
  if (!isValidPrincipal(values.depositTokenId)) return t`Invalid deposit token id`;
  if (!values.initialExchangeRatio) return t`Enter the exchange ratio`;
  if (!values.expectedSellQuantity) return t`Enter the sale amount`;
  if (!actualSoldAmount?.isGreaterThan(0)) return t`Actual sold amount is not valid`;
  if (!new BigNumber(values.canisterQuantity).isGreaterThan(0))
    return t`The amount of canister create should greater than 0`;
  return "";
}

export function usePoolStateInfo() {
  const [values] = useValuesManager();

  const soldTokenId = useMemo(() => {
    if (!values.soldTokenId || !values.soleTokenStandard) return undefined;
    return values.soldTokenId;
  }, [values.soldTokenId, values.soleTokenStandard]);

  const { result: soldTokenInfo } = useTokenInfo(soldTokenId);

  const depositQuantity = useMemo(() => {
    if (!values.initialExchangeRatio || !values.expectedSellQuantity) return null;
    return new BigNumber(values.initialExchangeRatio).multipliedBy(values.expectedSellQuantity);
  }, [values]);

  const actualSoldAmount = new BigNumber(values.expectedSellQuantity ?? 0).minus(
    parseTokenAmount(String(soldTokenInfo?.transFee), soldTokenInfo?.decimals)
  );

  const errorMessage = getErrorMessage(values, actualSoldAmount);

  return useMemo(() => {
    return {
      errorMessage,
      depositQuantity: depositQuantity ? depositQuantity.toFormat(WRAPPED_ICP_TOKEN_INFO.decimals) : "--",
      soldTokenInfo,
      values,
      actualSoldAmount,
    };
  }, [errorMessage, depositQuantity, soldTokenInfo, values]);
}

export type GenerateManagerProp = {
  values: Values;
  tokenInfo: any;
  identity: ActorIdentity;
  soldTokenStandard: TOKEN_STANDARD;
  creatorPrincipal: Principal;
};

export async function createLaunchpadManager({
  values,
  tokenInfo,
  identity,
  soldTokenStandard,
  creatorPrincipal,
}: GenerateManagerProp) {
  console.log({
    creatorPrincipal,
    soldTokenStandard,
    startDateTime: BigInt(millisecond2Nanosecond(values.startDateTime)),
    endDateTime: BigInt(millisecond2Nanosecond(values.endDateTime)),
    receiveTokenDateTime: BigInt(0),
    expectedSellQuantity: numberToString(formatTokenAmount(values.expectedSellQuantity, tokenInfo.decimals)),
    limitedAmountOnce: "0",
    initialExchangeRatio: numberToString(formatExchangeRatio(values.initialExchangeRatio)),
    id: "",
    cid: "",
    depositedQuantity: "0",
    createdDateTime: BigInt(0),
    creator: "",
    depositDateTime: nullParamsFormat<bigint>(null),
    expectedFundraisingPricingTokenQuantity: "0",
    soldQuantity: "0",
    withdrawalDateTime: nullParamsFormat<bigint>(null),
    settled: nullParamsFormat<boolean>(null),
    extraTokenFee: nullParamsFormat<bigint>(null),
    name: values.name,
    description: values.description,
    soldTokenId: values.soldTokenId,
    pricingTokenId: values.depositTokenId,
    pricingTokenStandard: values.depositTokenStandard.toString(),
    fundraisingPricingTokenQuantity: [],
    canisterQuantity: values.canisterQuantity,
  });

  return enumResultFormat<string>(
    await (
      await launchpadController(identity)
    ).generate({
      creatorPrincipal,
      soldTokenStandard,
      startDateTime: BigInt(millisecond2Nanosecond(values.startDateTime)),
      endDateTime: BigInt(millisecond2Nanosecond(values.endDateTime)),
      receiveTokenDateTime: BigInt(0),
      expectedSellQuantity: numberToString(formatTokenAmount(values.expectedSellQuantity, tokenInfo.decimals)),
      limitedAmountOnce: "0",
      initialExchangeRatio: numberToString(formatExchangeRatio(values.initialExchangeRatio)),
      id: "",
      cid: "",
      depositedQuantity: "0",
      createdDateTime: BigInt(0),
      creator: "",
      depositDateTime: nullParamsFormat<bigint>(null),
      // fundraisingWICPQuantity: nullParamsFormat<string>(null),
      // expectedFundraisingWICPQuantity: "0",
      expectedFundraisingPricingTokenQuantity: "0",
      soldQuantity: "0",
      withdrawalDateTime: nullParamsFormat<bigint>(null),
      settled: nullParamsFormat<boolean>(null),
      extraTokenFee: nullParamsFormat<bigint>(null),
      name: values.name,
      description: values.description,
      soldTokenId: values.soldTokenId,
      pricingTokenId: values.depositTokenId,
      pricingTokenStandard: values.depositTokenStandard.toString(),
      fundraisingPricingTokenQuantity: [],
      canisterQuantity: BigInt(values.canisterQuantity ?? 5),
    })
  );
}

export type CreateLaunchpadProp = {
  canisterId: string;
  values: Values;
  decimals: number | bigint;
  identity: ActorIdentity;
  creatorPrincipal: Principal;
};

export async function createLaunchpad({
  canisterId,
  values,
  decimals,
  identity,
  creatorPrincipal,
}: CreateLaunchpadProp) {
  return enumResultFormat<Property>(
    await (
      await launchpadController(identity)
    ).install(
      canisterId,
      {
        creatorPrincipal,
        startDateTime: BigInt(millisecond2Nanosecond(values.startDateTime)),
        endDateTime: BigInt(millisecond2Nanosecond(values.endDateTime)),
        receiveTokenDateTime: BigInt(0),
        expectedSellQuantity: numberToString(formatTokenAmount(values.expectedSellQuantity, decimals)),
        limitedAmountOnce: "0",
        initialExchangeRatio: numberToString(formatExchangeRatio(values.initialExchangeRatio)),
        id: "",
        cid: "",
        depositedQuantity: "0",
        createdDateTime: BigInt(0),
        creator: "",
        depositDateTime: nullParamsFormat<bigint>(null),
        soldQuantity: "0",
        withdrawalDateTime: nullParamsFormat<bigint>(null),
        settled: nullParamsFormat<boolean>(null),
        extraTokenFee: nullParamsFormat<bigint>(null),
        name: values.name,
        description: values.description,
        pricingTokenId: values.depositTokenId,
        pricingTokenStandard: values.depositTokenStandard.toString(),
        soldTokenId: values.soldTokenId,
        soldTokenStandard: values.soleTokenStandard,
        expectedFundraisingPricingTokenQuantity: "0",
        fundraisingPricingTokenQuantity: [],
        canisterQuantity: BigInt(values.canisterQuantity ?? 5),
      },
      values.whitelist ? values.whitelist : []
    )
  );
}

export function useAllPools() {
  const query = useCallback(async (offset: number, limit: number) => {
    return enumResultFormat<PaginationResult<Property>>(
      await (await launchpadController()).getAllPools("all", BigInt(offset), BigInt(limit))
    ).data;
  }, []);

  return usePaginationAllData(query, 100);
}

export function usePools(statuses: string, offset: number, limit: number, refresh?: boolean) {
  return useCallsData(
    useCallback(async () => {
      return enumResultFormat<PaginationResult<Property>>(
        await (await launchpadController()).getAllPools(statuses, BigInt(offset), BigInt(limit))
      ).data;
    }, [statuses, offset, limit]),
    !!statuses && isValidQueryPagination(offset, limit),
    refresh
  );
}

export function useUserLaunchpadPools(account: string, offset: number, limit: number, reload?: any) {
  return useCallsData(
    useCallback(async () => {
      return enumResultFormat<PaginationResult<Property>>(
        await (await launchpadController()).getPoolsByOwner(account, BigInt(offset), BigInt(limit))
      ).data;
    }, [account, offset, limit]),
    !!account && isValidQueryPagination(offset, limit),
    reload
  );
}

export async function withdrawRaisedTokens(identity: ActorIdentity, canisterId: string) {
  return enumResultFormat<TokenSet>(await (await launchpadManager(canisterId, identity)).withdraw());
}

export function useParticipantsSize(canisterId: string) {
  return useCallsData(
    useCallback(async () => {
      return enumResultFormat<bigint>(await (await launchpadManager(canisterId)).getInvestorsSize()).data;
    }, [canisterId]),
    !!canisterId
  );
}

export async function claimTokens(identity: ActorIdentity, canisterId: string) {
  return enumResultFormat<TokenSet>(await (await launchpadCanister(canisterId, identity)).withdraw2Investor());
}

export function useUserStakingDetails(canisterId: string, account: string, reload?: number) {
  return useCallsData(
    useCallback(async () => {
      try {
        return enumResultFormat<Investor>(await (await launchpadCanister(canisterId)).getInvestorDetail(account)).data;
      } catch (err) {
        console.log(err);
        return undefined;
      }
    }, [account, canisterId]),
    !!account && !!canisterId,
    reload
  );
}

export function usePoolRaiseTokenAmount(pool: { [key: string]: any }) {
  const { result: tokenInfo } = useTokenInfo(pool.soldTokenId);

  return useMemo(() => {
    let raiseAmount = new BigNumber(0);
    let raisedAmount = new BigNumber(0);

    if (pool && tokenInfo) {
      raiseAmount = parseTokenAmount(pool.expectedSellQuantity, tokenInfo.decimals).multipliedBy(
        parseExchangeRatio(pool.initialExchangeRatio)
      );

      raisedAmount = parseTokenAmount(pool.soldQuantity, tokenInfo.decimals).multipliedBy(
        parseExchangeRatio(pool.initialExchangeRatio)
      );
    }

    return {
      raiseAmount: raiseAmount,
      raisedAmount: raisedAmount,
    };
  }, [pool, tokenInfo]);
}

export function usePoolFundsValue(tokenAmount: BigNumber | undefined): string {
  const ICPPrice = useICPPrice();

  return useMemo(() => {
    if (!tokenAmount || !ICPPrice) return formatDollarAmount(0);

    return formatDollarAmount(tokenAmount.multipliedBy(ICPPrice).toNumber());
  }, [tokenAmount, ICPPrice]);
}

export function useLaunchpadQuantity(canisterId: string, refresh?: number) {
  return useCallsData(
    useCallback(async () => {
      return enumResultFormat<string>(await (await launchpadManager(canisterId)).getPricingTokenQuantity()).data;
    }, [canisterId]),
    !!canisterId,
    refresh
  );
}

export async function getPoolDetail(canisterId: string) {
  return enumResultFormat<Property>(await (await launchpadManager(canisterId)).getDetail()).data;
}

export function usePoolDetail(canisterId: string, reload?: number) {
  return useCallsData(
    useCallback(async () => getPoolDetail(canisterId), [canisterId]),
    !!canisterId,
    reload
  );
}

export function usePoolWhitelistSize(canisterId: string) {
  return useCallsData(
    useCallback(async () => {
      // return enumResultFormat<bigint>(await (await launchpadManager(canisterId)).getWhitelistSize()).data;
      return await (await launchpadManager(canisterId)).getWhitelistSize();
    }, [canisterId]),
    !!canisterId
  );
}

export function useIsInWhitelist(canisterId: string, address: string) {
  return useCallsData(
    useCallback(async () => {
      return enumResultFormat<boolean>(await (await launchpadManager(canisterId)).inWhitelist(address)).data;
    }, [canisterId, address]),
    !!canisterId && !!address
  );
}

export async function generateLaunchpadTicket(canisterId: string, account: string) {
  return enumResultFormat<string>(await (await launchpadManager(canisterId)).generateTicket(account));
}

export async function getLaunchpadTicket(canisterId: string, account: string, ticket: string) {
  return enumResultFormat<{ ticket: string; cid: string }>(
    await (await launchpadManager(canisterId)).getTicketPackage(account, ticket)
  );
}

export async function settle(canisterId: string) {
  return enumResultFormat<boolean>(await (await launchpadManager(canisterId)).settle());
}
