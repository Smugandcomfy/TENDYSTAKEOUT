import { ReactNode } from "react";
import { Details } from "components/ActionDetails/index";

export interface ActionDetailsProps {
  title: ReactNode;
  onClose?: () => void;
  content: Details[];
  activeStep: number;
  errorStep: number | undefined;
}

export interface ActionDetails {
  title: ReactNode;
  onClose?: () => void;
  content: Details[];
}

export interface StepsState {
  steps: { [key: string]: ActionDetailsProps };
  opened: string[];
  key: number;
}

export const initialState: StepsState = {
  steps: {},
  opened: [],
  key: 0,
};
