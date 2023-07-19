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
} from "utils/sdk/index";
import { icrc1 } from "../../actor/token";
import { Holder, Transaction, Metadata } from "./types";
import { _SERVICE as ICRC1Service, GetTransactionsResponse } from "../../idls/icrc/icrc1";
import { Principal } from "@dfinity/principal";
import { isBigIntMemo, icrcTransactionFormat } from "./utils";

export class ICRC1Adapter extends BaseTokenAdapter<ICRC1Service> {
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
    return enumResultFormat<bigint>(await (await this.actor(canisterId)).icrc1_total_supply());
  }

  public async balance({ canisterId, params }: BalanceRequest) {
    if (!!params.user.principal) {
      return enumResultFormat<bigint>(
        await (
          await this.actor(canisterId)
        ).icrc1_balance_of({
          owner: params.user.principal,
          subaccount: nullParamsFormat<Array<number>>(params.subaccount ? params.subaccount : undefined),
        })
      );
    }

    return enumResultFormat<bigint>(BigInt(0));
  }

  public async transfer({ canisterId, identity, params }: TransferRequest) {
    if (!params.to.principal) throw Error("no user principal address");
    if (isBigIntMemo(params.memo)) throw Error("Can't support bigint (memo)");

    const result = await (
      await this.actor(canisterId, identity)
    ).icrc1_transfer({
      to: {
        owner: params.to.principal,
        subaccount: nullParamsFormat<Array<number>>(params.subaccount ? params.subaccount : undefined),
      },
      memo: nullParamsFormat<number[]>(params.memo),
      amount: params.amount,
      created_at_time: nullParamsFormat<bigint>(params.create_at_time),
      from_subaccount: nullParamsFormat<Array<number>>(params.from_sub_account ? params.from_sub_account : undefined),
      fee: nullParamsFormat<bigint>(params.fee),
    });

    return enumResultFormat<bigint>(result);
  }

  public async getFee({ canisterId }: GetFeeRequest) {
    return enumResultFormat<bigint>(await (await this.actor(canisterId)).icrc1_fee());
  }

  public async setFee({ canisterId, identity, params }: SetFeeRequest) {
    return enumResultFormat<boolean>({ err: "no setFee" });
  }

  public async setFeeTo({ canisterId, identity, params }: SetFeeToRequest) {
    return enumResultFormat<boolean>({ err: "no setFeeTo" });
  }

  public async transactions({ canisterId, params }: TransactionRequest) {
    if (typeof params.offset === undefined || typeof params.limit === undefined) throw Error("no offset or limit");

    const _result = enumResultFormat<GetTransactionsResponse>(
      await (await this.actor(canisterId)).get_transactions({ start: BigInt(0), length: BigInt(0) })
    ).data;

    if (_result) {
      const { first_index, log_length } = _result;
      const totalElements = log_length - first_index;

      let start = BigInt(0);

      if (params.limit! <= log_length) {
        start = log_length - BigInt(params.offset!) - BigInt(1) - BigInt(params.limit!);
      }

      const result = enumResultFormat<GetTransactionsResponse>(
        await (await this.actor(canisterId)).get_transactions({ start, length: BigInt(params.limit!) })
      ).data;

      const transactions = (result?.transactions ?? []).map((ele, index) =>
        icrcTransactionFormat(ele, start + BigInt(index))
      );

      return enumResultFormat<PaginationResult<Transaction>>({
        content: transactions.reverse(),
        totalElements: totalElements,
        offset: BigInt(params.offset!),
        limit: BigInt(params.limit!),
      });
    }

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
    const metadata = await (await this.actor(canisterId)).icrc1_metadata();

    let name: string = "";
    let symbol: string = "";
    let decimals: bigint = BigInt(0);
    // let fee: bigint = BigInt(0);

    for (let i = 0; i < metadata.length; i++) {
      const ele = metadata[i];
      if (ele[0] === "icrc1:name") {
        const val = ele[1] as { Text: string };
        name = val.Text;
      } else if (ele[0] === "icrc1:symbol") {
        const val = ele[1] as { Text: string };
        symbol = val.Text;
      } else if (ele[0] === "icrc1:decimals") {
        const val = ele[1] as { Nat: bigint };
        decimals = val.Nat;
      } else if (ele[0] === "icrc1:fee") {
        // const val = ele[1] as { Nat: bigint };
        // fee = val.Nat;
      }
    }

    const owner = await (await this.actor(canisterId)).icrc1_minting_account();

    let _owner: Principal | undefined = undefined;

    if (owner[0]) {
      _owner = owner[0].owner;
    }

    return {
      status: ResultStatus.OK,
      data: {
        decimals: Number(decimals),
        ownerAccount: _owner ? principalToAddress(_owner.toString()) : "",
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
    return enumResultFormat<string>(await (await this.actor(canisterId)).icrc1_logo());
  }

  public actualReceivedByTransfer({ amount }: ActualReceivedByTransferRequest) {
    return amount;
  }
}

export const icrc1Adapter = new ICRC1Adapter({
  actor: icrc1,
});
