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
import { PaginationResult, ResultStatus, principalToAddress, enumResultFormat } from "utils/sdk/index";
import { dip20, dip20BalanceActor, dip20SupplyActor } from "../../actor/token";
import { Holder, Transaction, DIP20Metadata, Metadata } from "./types";
import { Principal } from "@dfinity/principal";
import DIP20Service, { TokenInfo } from "../../idls/dip20/dip20";
import { getCapTransactions, getCapUserTransactions, getCapRootId } from "../../hooks/useCap";

export class DIP20TokenAdapter extends BaseTokenAdapter<DIP20Service> {
  public async holders({ canisterId, params }: HoldersRequest) {
    const totalHolder = (await this.totalHolders({ canisterId })).data;

    if (totalHolder) {
      const _holders = (await (await this.actor(canisterId)).getHolders(params.offset, params.limit)) as Array<
        [Principal, bigint]
      >;

      const holders = _holders.map((holder) => {
        return {
          balance: holder[1],
          account: holder[0].toString(),
        };
      }) as Holder[];

      return {
        status: ResultStatus.OK,
        message: "",
        data: {
          content: holders,
          totalElements: Number(totalHolder),
          limit: Number(params.limit),
          offset: Number(params.offset),
        } as PaginationResult<Holder>,
      };
    }

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
    let tokenInfo: null | TokenInfo = null;

    try {
      tokenInfo = (await (await this.actor(canisterId)).getTokenInfo()) as TokenInfo;
      return enumResultFormat<bigint>(tokenInfo.holderNumber);
    } catch (error) {
      console.log(error);
      console.log("DIP20Adapter: no getTokenInfo method");
    }

    return enumResultFormat<bigint>(undefined);
  }

  public async supply({ canisterId }: SupplyRequest) {
    try {
      return enumResultFormat<bigint>(await (await this.actor(canisterId)).totalSupply());
    } catch (error) {
      console.log(error);
      return enumResultFormat<bigint>(await (await dip20SupplyActor(canisterId)).totalSupply());
    }
  }

  public async balance({ canisterId, params }: BalanceRequest) {
    if (!!params.user.principal) {
      let balance = BigInt(0);

      try {
        balance = (await (await this.actor(canisterId)).balanceOf(params.user.principal)) as bigint;
      } catch (error) {
        console.log(error);
        balance = (await (await dip20BalanceActor(canisterId)).balanceOf(params.user.principal)) as bigint;
      }

      return {
        status: ResultStatus.OK,
        data: balance,
        message: "",
      };
    }

    return enumResultFormat<bigint>(BigInt(0));
  }

  public async transfer({ canisterId, identity, params }: TransferRequest) {
    if (!params.to.principal) throw Error("no user principal");

    const result = await (await this.actor(canisterId, identity)).transfer(params.to.principal, params.amount);
    return enumResultFormat<bigint>(result);
  }

  public async getFee({ canisterId }: GetFeeRequest) {
    const metadata = await (await this.actor(canisterId)).getMetadata();
    return enumResultFormat<bigint>(metadata.fee);
  }

  public async setFee({ canisterId, identity, params }: SetFeeRequest) {
    return enumResultFormat<boolean>(await (await this.actor(canisterId, identity)).setFee(params));
  }

  public async setFeeTo({ canisterId, identity, params }: SetFeeToRequest) {
    if (!params.principal) throw Error("no principal");
    return enumResultFormat<boolean>(await (await this.actor(canisterId, identity)).setFeeTo(params.principal));
  }

  public async transactions({ canisterId, params }: TransactionRequest) {
    let cap_id: string | undefined = params.capId;

    if (!cap_id) {
      cap_id = (await getCapRootId(canisterId))?.toString();
    }

    if (cap_id) {
      if (!params.offset && params.offset !== 0) throw Error("no cap offset");

      if (params.user?.principal) {
        return enumResultFormat<PaginationResult<Transaction>>(
          await getCapUserTransactions(
            cap_id.toString(),
            params.user?.principal,
            params.witness ?? false,
            params.offset
          )
        );
      }

      return enumResultFormat<PaginationResult<Transaction>>(
        await getCapTransactions(cap_id.toString(), params.witness ?? false, params.offset)
      );
    }

    return enumResultFormat<PaginationResult<Transaction>>({
      Ok: {
        content: [],
        totalElements: BigInt(0),
        offset: BigInt(0),
        limit: BigInt(10),
      },
    });
  }

  public async approve({ canisterId, params, identity }: ApproveRequest) {
    // 10 times approve amount to fix dip20 insufficient allowance amount
    // TODO: A better way to fix it
    return enumResultFormat<boolean>(
      await (await this.actor(canisterId, identity)).approve(params.spender, params.allowance * BigInt(10))
    );
  }

  public async allowance({ canisterId, params }: AllowanceRequest) {
    if (!params.owner.principal) {
      throw Error("no principal");
    }

    return enumResultFormat<bigint>(
      await (await this.actor(canisterId)).allowance(params.owner.principal, params.spender)
    );
  }

  public async metadata({ canisterId }: MetadataRequest) {
    const metadata = (await (await this.actor(canisterId)).getMetadata()) as DIP20Metadata;

    return {
      status: ResultStatus.OK,
      data: {
        decimals: metadata.decimals,
        ownerAccount: metadata.owner ? principalToAddress(metadata.owner.toString()) : "",
        metadata: [],
        name: metadata.name,
        symbol: metadata.symbol,
      } as Metadata,
      message: "",
    };
  }

  public async setLogo({ canisterId, params, identity }: SetLogoRequest) {
    return enumResultFormat<boolean>(await (await this.actor(canisterId, identity)).setLogo(params));
  }

  public async logo({ canisterId }: LogoRequest) {
    const logo = (await (await this.actor(canisterId)).logo()) as string;

    return {
      status: ResultStatus.OK,
      data: logo,
      message: "",
    };
  }

  public actualReceivedByTransfer({ amount }: ActualReceivedByTransferRequest) {
    return amount;
  }
}

export const DIP20Adapter = new DIP20TokenAdapter({
  actor: dip20,
});
