import { numberToString, BigNumber, isValidPrincipal } from "utils/sdk/index";
import { Principal } from "@dfinity/principal";
import { ActorIdentity } from "types/index";
import { Tokens } from "utils/adapter/Token";

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
