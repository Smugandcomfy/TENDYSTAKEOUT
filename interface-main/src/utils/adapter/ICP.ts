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
  PaginationResult,
  ResultStatus,
  principalToAddress,
  enumResultFormat,
  nullParamsFormat,
  SubAccount,
  isErrorSubAccount,
} from "utils/sdk/index";
import { ledgerService } from "../../actor/icp";
import { Holder, Transaction, Metadata } from "./types";
import { _SERVICE as LedgerService } from "../../idls/icp/ledger";
import { ActorIdentity } from "types/global";
import { isBigIntMemo } from "./utils";

export class ICPAdapter extends BaseTokenAdapter<LedgerService> {
  public async holders({ canisterId, params }: HoldersRequest) {
    return {
      status: ResultStatus.OK,
      data: {
        content: [] as Holder[],
        totalElements: 0,
        limit: 10,
        offset: 0,
      } as PaginationResult<Holder>,
      message: "",
    };
  }

  public async totalHolders({ canisterId }: TotalHoldersRequest) {
    return enumResultFormat<bigint>(undefined);
  }

  public async supply({ canisterId }: SupplyRequest) {
    return enumResultFormat<bigint>(undefined);
  }

  public async balance({ canisterId, params }: BalanceRequest) {
    let account = "";

    if (params.user.address) {
      account = params.user.address;
    } else if (params.user.principal) {
      const sub = !!params.subaccount ? SubAccount.fromBytes(Uint8Array.from(params.subaccount)) : undefined;
      account = principalToAddress(params.user.principal.toString(), isErrorSubAccount(sub) ? sub : undefined);
    }

    return enumResultFormat<bigint>(
      (
        await (
          await this.actor(canisterId)
        ).account_balance({
          account: Array.from(Uint8Array.from(Buffer.from(account, "hex"))),
        })
      ).e8s
    );
  }

  public async transfer({ canisterId, identity, params }: TransferRequest) {
    let account = "";

    if (params.to.address) {
      account = params.to.address;
    } else if (params.to.principal) {
      const sub = !!params.subaccount ? SubAccount.fromBytes(Uint8Array.from(params.subaccount)) : undefined;
      account = principalToAddress(params.to.principal.toString(), isErrorSubAccount(sub) ? sub : undefined);
    } else {
      throw Error("no transfer to");
    }

    if (params.memo && !isBigIntMemo(params.memo)) throw Error("Only bigint support (memo)");

    const result = await (
      await this.actor(canisterId, identity)
    ).transfer({
      to: Array.from(Uint8Array.from(Buffer.from(account, "hex"))),
      memo: params.memo ?? BigInt(0),
      amount: { e8s: params.amount },
      created_at_time: nullParamsFormat<{ timestamp_nanos: bigint }>(
        params.create_at_time ? { timestamp_nanos: params.create_at_time } : undefined
      ),
      from_subaccount: nullParamsFormat<number[]>(params.from_sub_account),
      fee: { e8s: BigInt(10000) },
    });

    return enumResultFormat<bigint>(result);
  }

  public async getFee({ canisterId }: GetFeeRequest) {
    return enumResultFormat<bigint>(await (await (await this.actor(canisterId)).transfer_fee({})).transfer_fee.e8s);
  }

  public async setFee({ canisterId, identity, params }: SetFeeRequest) {
    return enumResultFormat<boolean>({ err: "no setFee" });
  }

  public async setFeeTo({ canisterId, identity, params }: SetFeeToRequest) {
    return enumResultFormat<boolean>({ err: "no setFeeTo" });
  }

  public async transactions({ canisterId, params }: TransactionRequest) {
    return enumResultFormat<PaginationResult<Transaction>>({
      content: [],
      totalElements: BigInt(0),
      offset: BigInt(0),
      limit: BigInt(10),
    });
  }

  public async approve({ canisterId, params, identity }: ApproveRequest) {
    return enumResultFormat<boolean>({ err: "no approve" });
  }

  public async allowance({ canisterId, params }: AllowanceRequest) {
    return enumResultFormat<bigint>({ err: "no allowance" });
  }

  public async metadata({ canisterId }: MetadataRequest) {
    const symbol = (await (await this.actor(canisterId)).symbol()).symbol;
    const decimals = (await (await this.actor(canisterId)).decimals()).decimals;
    const name = "Internet Computer";

    return {
      status: ResultStatus.OK,
      data: {
        decimals: decimals,
        ownerAccount: "",
        metadata: [],
        name: name,
        symbol: symbol,
      } as Metadata,
      message: "",
    };
  }

  public async setLogo({ canisterId, params, identity }: SetLogoRequest) {
    return enumResultFormat<boolean>({ err: "no approve" });
  }

  public async logo({ canisterId }: LogoRequest) {
    return enumResultFormat<string>("");
  }

  public actualReceivedByTransfer({ amount }: ActualReceivedByTransferRequest) {
    return amount;
  }
}

export const icpAdapter = new ICPAdapter({
  actor: async (canisterId?: string, identity?: ActorIdentity) => await ledgerService(identity),
});
