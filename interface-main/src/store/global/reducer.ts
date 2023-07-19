import { updateICPPriceList, addCatchToken, updateUserLocale, updateTokenList } from "./actions";
import { initialState } from "./states";

import { createReducer } from "@reduxjs/toolkit";

export default createReducer(initialState, (builder) => {
  builder
    .addCase(updateICPPriceList, (state, { payload }) => {
      state.ICPPriceList = payload;
    })
    .addCase(addCatchToken, (state, { payload }) => {
      state.requestTokenList = [...state.requestTokenList, ...(payload ? payload : [])];
    })
    .addCase(updateUserLocale, (state, { payload }) => {
      state.userLocale = payload;
    })
    .addCase(updateTokenList, (state, { payload }) => {
      state.tokenList = payload;
    });
});
