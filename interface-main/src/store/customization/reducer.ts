import { updateTheme } from "./actions";
import { initialState } from "./states";

import { createReducer } from "@reduxjs/toolkit";

export default createReducer(initialState, (builder) => {
  builder.addCase(updateTheme, (state, { payload }) => {
    state.theme = payload;
  });
});
