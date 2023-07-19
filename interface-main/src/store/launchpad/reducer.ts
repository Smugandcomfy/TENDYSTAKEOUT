import { createReducer } from "@reduxjs/toolkit";
import { updateStep, updateLaunchpadValue, clearState } from "./actions";
import { initialState, LaunchpadState } from "./states";

export default createReducer<LaunchpadState>(initialState, (builder) => {
  builder
    .addCase(updateStep, (state, { payload }) => {
      state.step = payload;
    })
    .addCase(updateLaunchpadValue, (state, { payload }) => {
      const { field, value } = payload;

      state.values = {
        ...state.values,
        [field]: value,
      };
    })
    .addCase(clearState, () => {
      return {
        ...initialState,
      };
    });
});
