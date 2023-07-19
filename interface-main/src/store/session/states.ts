export interface SessionState {
  isUnLocked: boolean;
  account: string;
}

export const initialState: SessionState = {
  isUnLocked: false,
  account: "",
};
