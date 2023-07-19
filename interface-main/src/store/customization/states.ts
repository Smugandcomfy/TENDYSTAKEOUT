import config from "themes/config";

export interface CustomizationState {
  isOpen: string[];
  fontFamily: string;
  borderRadius: number;
  outlinedFilled: boolean;
  theme: string;
  rtlLayout: boolean;
  opened: boolean;
}

export const initialState: CustomizationState = {
  isOpen: [], //for active default menu
  fontFamily: config.fontFamily,
  borderRadius: config.borderRadius,
  outlinedFilled: config.outlinedFilled,
  theme: config.theme,
  rtlLayout: config.rtlLayout,
  opened: true,
};
