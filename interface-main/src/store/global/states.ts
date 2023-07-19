import { DEFAULT_LOCALE, SupportedLocale } from "constants/locales";
import { ICPPriceInfo, TokenMetadata } from "types/token";
import { TokenListTokenMetadata } from "types/token-list";

export interface GlobalState {
  xdr_usdt: number;
  ICPPriceList: ICPPriceInfo[];
  tokenList: TokenListTokenMetadata[];
  hasBeenClaimTestToken: boolean;
  requestTokenList: TokenMetadata[];
  swapTokenList: [];
  userLocale: SupportedLocale;
}

export const initialState: GlobalState = {
  xdr_usdt: 1.33,
  ICPPriceList: [],
  tokenList: [],
  hasBeenClaimTestToken: false,
  requestTokenList: [],
  swapTokenList: [],
  userLocale: DEFAULT_LOCALE,
};
