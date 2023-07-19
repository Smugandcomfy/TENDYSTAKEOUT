import {
  BaseTokenAdapter,
  HoldersRequest,
  TotalHoldersRequest,
  SupplyRequest,
  BalanceRequest,
  TransferRequest,
  SetFeeRequest,
  SetFeeToRequest,
  GetFeeRequest,
  TransactionRequest,
  ApproveRequest,
  AllowanceRequest,
  MetadataRequest,
  SetLogoRequest,
  LogoRequest,
  ActualReceivedByTransferRequest,
} from "./BaseTokenAdapter";
import {
  enumResultFormat,
  PaginationResult,
  ResultStatus,
  nullParamsFormat,
  principalToAddress,
  SubAccount,
  isErrorSubAccount,
} from "utils/sdk/index";
import { token } from "../../actor/token";
import { Holder, Transaction, Metadata } from "./types";
import { _SERVICE as EXTTokenService, User } from "../../idls/token/token";
import { getCapTransactions, getCapUserTransactions, getCapRootId } from "../../hooks/useCap";
import { isBigIntMemo } from "./utils";

export class EXTTokenAdapter extends BaseTokenAdapter<EXTTokenService> {
  public async holders({ canisterId, params }: HoldersRequest) {
    return enumResultFormat<PaginationResult<Holder>>(
      await (
        await this.actor(canisterId)
      ).holders({
        offset: [params.offset],
        limit: [params.limit],
      })
    );
  }

  public async totalHolders({ canisterId }: TotalHoldersRequest) {
    return enumResultFormat<bigint>(await (await this.actor(canisterId)).totalHolders());
  }

  public async supply({ canisterId }: SupplyRequest) {
    return enumResultFormat<bigint>(await (await this.actor(canisterId)).supply());
  }

  public async balance({ canisterId, params }: BalanceRequest) {
    if (!params.user.address && !params.user.principal) throw Error("no user address or principal");

    let account = "";

    if (params.user.principal) {
      const sub = params.subaccount ? SubAccount.fromBytes(Uint8Array.from(params.subaccount)) : undefined;
      account = principalToAddress(params.user.principal.toString(), isErrorSubAccount(sub) ? sub : undefined);
    } else if (params.user.address) {
      account = params.user.address;
    }

    return enumResultFormat<bigint>(
      await (
        await this.actor(canisterId)
      ).balance({
        token: params.token,
        user: { address: account },
      })
    );
  }

  public async transfer({ canisterId, identity, params }: TransferRequest) {
    if (!params.to.address && !params.to.principal) throw Error("No to address or principal");
    if (!params.from.address && !params.from.principal) throw Error("No from address or principal");
    if (isBigIntMemo(params.memo)) throw Error("Can't support bigint (memo)");

    const subaccount = params.subaccount ? SubAccount.fromBytes(Uint8Array.from(params.subaccount)) : undefined;

    return enumResultFormat<bigint>(
      await (
        await this.actor(canisterId, identity)
      ).transfer({
        token: params.token ?? "",
        to: !!params.to.principal
          ? !!params.subaccount
            ? {
                address: principalToAddress(
                  params.to.principal.toString(),
                  isErrorSubAccount(subaccount) ? subaccount : undefined
                ),
              }
            : { address: principalToAddress(params.to.principal.toString()) }
          : { address: params.to.address as string },
        from: !!params.from.principal
          ? { address: principalToAddress(params.from.principal.toString()) }
          : { address: params.from.address as string },
        memo: params.memo ? params.memo : [],
        subaccount: nullParamsFormat<number[]>(undefined),
        nonce: nullParamsFormat<bigint>(params.nonce),
        amount: params.amount,
        notify: params.notify ?? true,
      })
    );
  }

  public async getFee({ canisterId }: GetFeeRequest) {
    return enumResultFormat<bigint>(await (await this.actor(canisterId)).getFee());
  }

  public async setFee({ canisterId, identity, params }: SetFeeRequest) {
    return enumResultFormat<boolean>(await (await this.actor(canisterId, identity)).setFee(params));
  }

  public async setFeeTo({ canisterId, identity, params }: SetFeeToRequest) {
    if (!params.address) throw Error("no user address");

    return enumResultFormat<boolean>(
      await (await this.actor(canisterId, identity)).setFeeTo({ address: params.address })
    );
  }

  public async transactions({ canisterId, params }: TransactionRequest) {
    let cap_id = params.capId;

    if (!cap_id) {
      const extensions = await this.extensions({ canisterId });

      if (extensions.includes("@ext/cap")) {
        cap_id = (await getCapRootId(canisterId))?.toString();
      }
    }

    if (cap_id) {
      if (!params.offset && params.offset !== 0) throw Error("no cap offset");

      if (params.user?.principal) {
        return enumResultFormat<PaginationResult<Transaction>>(
          await getCapUserTransactions(cap_id, params.user?.principal, params.witness ?? false, params.offset)
        );
      }

      return enumResultFormat<PaginationResult<Transaction>>(
        await getCapTransactions(cap_id, params.witness ?? false, params.offset)
      );
    }

    return enumResultFormat<PaginationResult<Transaction>>(
      await (
        await this.actor(canisterId)
      ).transactions({
        hash: nullParamsFormat<string>(params.hash),
        user: nullParamsFormat<User>(params.user?.address ? { address: params.user.address } : undefined),
        offset: nullParamsFormat<bigint>(params.offset ? BigInt(params.offset) : null),
        limit: nullParamsFormat<bigint>(params.limit ? BigInt(params.limit) : null),
        index: nullParamsFormat<bigint>(params.index ? BigInt(params.index) : null),
      })
    );
  }

  public async approve({ canisterId, params, identity }: ApproveRequest) {
    return enumResultFormat<boolean>(
      await (
        await this.actor(canisterId, identity)
      ).approve({
        subaccount: params.subaccount ? [Array.from(params.subaccount)] : [],
        spender: params.spender,
        allowance: BigInt(Number.MAX_VALUE),
      })
    );
  }

  public async allowance({ canisterId, params }: AllowanceRequest) {
    if (!params.owner.address && !params.owner.principal) throw Error("no owner address or principal");

    return enumResultFormat<bigint>(
      await (
        await this.actor(canisterId)
      ).allowance({
        owner: params.owner.address ? { address: params.owner.address } : { principal: params.owner.principal! },
        subaccount: params.subaccount ? [Array.from(params.subaccount)] : [],
        spender: params.spender,
      })
    );
  }

  public async metadata({ canisterId }: MetadataRequest) {
    const metadata = enumResultFormat<{
      fungible: Metadata;
    }>(await (await this.actor(canisterId)).metadata()).data?.fungible;

    return {
      status: ResultStatus.OK,
      data: metadata,
      message: "",
    };
  }

  public async setLogo({ canisterId, params, identity }: SetLogoRequest) {
    return enumResultFormat<boolean>(await (await this.actor(canisterId, identity)).setLogo(params));
  }

  public async logo({ canisterId }: LogoRequest) {
    return enumResultFormat<string>(await (await this.actor(canisterId)).logo());
  }

  public actualReceivedByTransfer({ amount }: ActualReceivedByTransferRequest) {
    return amount;
  }

  public async extensions({ canisterId }: { canisterId: string }) {
    return await (await this.actor(canisterId)).extensions();
  }
}

export const EXTAdapter = new EXTTokenAdapter({
  actor: token,
});
