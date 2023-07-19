import { TOKEN_STANDARD } from "constants/tokens";

export type Values = {
  name: string;
  description: string;
  startDateTime: number;
  endDateTime: number;
  depositTokenId: string;
  depositTokenStandard: TOKEN_STANDARD;
  soldTokenId: string;
  soleTokenStandard: TOKEN_STANDARD;
  initialExchangeRatio: number;
  expectedSellQuantity: number;
  whitelist: undefined | string[];
  invalidAccounts: undefined | string[];
  canisterQuantity: number;
};

export interface LaunchpadState {
  readonly step: number;
  readonly values: Values;
}

export const initialState: LaunchpadState = {
  step: 0,
  values: {
    startDateTime: new Date(new Date().getTime() + 10 * 60 * 1000).getTime(),
    endDateTime: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000).getTime(),
    canisterQuantity: 1,
  } as Values,
};
