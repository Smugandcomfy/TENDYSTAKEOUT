import { TokenCanisterInfo } from "types/token";

export interface TokenState {
  ICSTokenInfo: TokenCanisterInfo;
  logos: { [canisterId: string]: string };
  fees: { [canisterId: string]: string };
}

export const initialState: TokenState = {
  ICSTokenInfo: {} as TokenCanisterInfo,
  logos: {},
  fees: {},
};
