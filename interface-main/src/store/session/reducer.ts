import { createReducer } from "@reduxjs/toolkit";
import { updateLoginAccount, updateLockStatus } from "./actions";
import { initialState } from "./states";

export default createReducer(initialState, (builder) => {
  builder
    .addCase(updateLoginAccount, (state, { payload }) => {
      state.account = payload;
    })
    .addCase(updateLockStatus, (state, { payload }) => {
      state.isUnLocked = !payload;
    });
});
