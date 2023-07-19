import { useCallback } from "react";
import { Principal } from "@dfinity/principal";
import { ActorIdentity, TokenInfo, TokenAllowance } from "types/index";
import { StatusResult1 } from "types/global";
import { Tokens } from "../utils/adapter/Token";
import { isPrincipal } from "utils/sdk/index";

export interface TokenAllowances {
  token: TokenInfo;
  allowances: TokenAllowance[];
}

export interface Allowance {
  canisterId: string;
  account: Principal | string;
  spenderCanisterId: string;
}

export async function allowance({ canisterId, account, spenderCanisterId }: Allowance) {
  return (
    await Tokens.allowance({
      canisterId,
      params: {
        spender: Principal.fromText(spenderCanisterId),
        owner: isPrincipal(account) ? { principal: account } : { address: account },
        subaccount: undefined,
      },
    })
  ).data;
}

export interface Approve {
  canisterId: string;
  identity: ActorIdentity;
  spenderCanisterId: string;
  value: number | string | bigint;
  account: string | Principal | undefined;
}

export async function approve({ canisterId, identity, spenderCanisterId, value, account }: Approve) {
  return Tokens.approve({
    canisterId,
    identity,
    params: {
      spender: Principal.fromText(spenderCanisterId),
      allowance: BigInt(value),
      subaccount: undefined,
      account: account!,
    },
  });
}

export function useApprove(): (approveParams: Approve) => Promise<StatusResult1<boolean>> {
  return useCallback(async ({ canisterId, identity, spenderCanisterId, value, account }: Approve) => {
    if (!account)
      return await Promise.resolve({
        status: "err",
        message: "Invalid account",
      } as StatusResult1<boolean>);

    const allowedBalance = await allowance({
      canisterId,
      account,
      spenderCanisterId,
    });

    if (!allowedBalance || allowedBalance === BigInt(0) || BigInt(value ?? 0) > allowedBalance) {
      return await approve({ canisterId, identity, spenderCanisterId, value, account });
    } else {
      return await Promise.resolve({
        status: "ok",
        data: true,
        message: "You have approved successfully",
      } as StatusResult1<boolean>);
    }
  }, []);
}
