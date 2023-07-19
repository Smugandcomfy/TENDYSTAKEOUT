import { createReducer } from "@reduxjs/toolkit";
import { open, close, updateStepDetails, updateKey } from "./actions";
import { initialState } from "./state";

export default createReducer(initialState, (builder) => {
  builder
    .addCase(open, (state, { payload }) => {
      if (payload) {
        // state.opened = [...state.opened, payload];
        state.opened = [payload];
      }
    })
    .addCase(close, (state, { payload }) => {
      if (payload && state.opened.includes(payload)) {
        // const _opened = [...state.opened];
        // _opened.splice(state.opened.indexOf(payload), 1);
        // state.opened = [..._opened];
        state.opened = [];
      }
    })
    .addCase(updateStepDetails, (state, { payload }) => {
      state.steps = {
        ...state.steps,
        [payload.key]: payload.value,
      };
    })
    .addCase(updateKey, (state) => {
      state.key = state.key + 1;
    });
});
