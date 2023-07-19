import { createAction } from "@reduxjs/toolkit";

export const updateStep = createAction<number>("launchpad/updateStep");
export const updateLaunchpadValue = createAction<{ [key: string]: any }>("launchpad/updateLaunchpadValue");
export const clearState = createAction("launchpad/clearState");
