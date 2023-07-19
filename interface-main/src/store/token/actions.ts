import { createAction } from "@reduxjs/toolkit";
import { TokenCanisterInfo } from "types/token";

export const updateICSInfo = createAction<TokenCanisterInfo>("token/updateICSInfo");

export const updateTokenLogo = createAction<{ canisterId: string; logo: string }>("token/updateTokenLogo");

export const updateTokenFee = createAction<{ canisterId: string; fee: string }>("token/updateTokenFee");
