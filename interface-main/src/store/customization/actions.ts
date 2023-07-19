import { createAction } from "@reduxjs/toolkit";

export const updateTheme = createAction<string>("customization/updateTheme");

export const updateLocal = createAction<string>("customization/updateLocal");
