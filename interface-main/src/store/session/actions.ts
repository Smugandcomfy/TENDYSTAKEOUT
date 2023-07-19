import { createAction } from "@reduxjs/toolkit";

export const updateLoginAccount = createAction<string>("session/updateLoginAccount");
export const updateLockStatus = createAction<boolean>("session/updateLockStatus");
