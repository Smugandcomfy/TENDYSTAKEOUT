import { createAction } from "@reduxjs/toolkit";
import { ICPPriceInfo, TokenMetadata } from "types/token";
import { SupportedLocale } from "constants/locales";
import { TokenMetadata as TokenListTokenMetadata } from "types/token-list";

export const updateICPPriceList = createAction<ICPPriceInfo[]>("global/updateICPPriceList");

export const addCatchToken = createAction<TokenMetadata[]>("global/addCatchToken");

export const updateUserLocale = createAction<SupportedLocale>("global/updateUserLocale");

export const updateTokenList = createAction<TokenListTokenMetadata[]>("global/updateTokenList");

export const updatePoolStandardInitialed = createAction<boolean>("global/updatePoolStandardInitialed");
