import { updateICSInfo, updateTokenLogo } from "./actions";
import { initialState } from "./states";
import { createReducer } from "@reduxjs/toolkit";

export default createReducer(initialState, (builder) => {
  builder
    .addCase(updateICSInfo, (state, { payload }) => {
      state.ICSTokenInfo = payload;
    })
    .addCase(updateTokenLogo, (state, { payload }) => {
      state.logos[payload.canisterId] = payload.logo;
    });
});
