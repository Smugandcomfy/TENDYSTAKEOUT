import customizationReducer from "./customization/reducer";
import walletReducer from "./wallet/reducer";
import globalReducer from "./global/reducer";
import loadingReducer from "./loadingReducer";
import tokenReducer from "./token/reducer";
import launchpadReducer from "./launchpad/reducer";
import AuthReducer from "./auth/reducer";
import sessionReducer from "./session/reducer";
import tokenCacheReducer from "./token/cache/reducer";
import callReducer from "./call/reducer";
import StepReducer from "./steps/reducer";

export { sessionReducer, launchpadReducer, tokenCacheReducer };

export default {
  customization: customizationReducer,
  loading: loadingReducer,
  wallet: walletReducer,
  global: globalReducer,
  token: tokenReducer,
  launchpad: launchpadReducer,
  auth: AuthReducer,
  call: callReducer,
  step: StepReducer,
};
