import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { open, close, updateStepDetails, updateKey } from "./actions";
import { ActionDetails } from "./state";
import store from "../index";

export function useCurrKey() {
  return useAppSelector((state) => state.step.key);
}

export function useUpdateKey() {
  const dispatch = useAppDispatch();

  return useCallback(() => {
    dispatch(updateKey());
  }, [dispatch]);
}

export function useStepManager(): [(key: string | undefined) => void, (key: string | undefined) => void] {
  const dispatch = useAppDispatch();

  const _open = useCallback(
    (key: string | undefined) => {
      dispatch(open(key));
    },
    [dispatch]
  );

  const _close = useCallback(
    (key: string | undefined) => {
      dispatch(close(key));
    },
    [dispatch]
  );

  return [_open, _close];
}

export function useInitialAndUpdateStep() {
  const dispatch = useAppDispatch();
  const [, close] = useStepManager();

  return useCallback(
    (key: string, step: ActionDetails) => {
      const prevStep = getStepDetails(key) ?? {};

      dispatch(
        updateStepDetails({
          key,
          value: {
            ...step,
            activeStep: prevStep.activeStep ?? 0,
            errorStep: prevStep.errorStep,
            onClose: () => close(key),
          },
        })
      );
    },
    [dispatch, close]
  );
}

export function useUpdateCallStep() {
  const dispatch = useAppDispatch();

  return useCallback(
    (key: string, activeStep: number, errorStep: number | undefined) => {
      const prevStep = getStepDetails(key) ?? {};

      dispatch(updateStepDetails({ key, value: { ...prevStep, activeStep, errorStep } }));
    },
    [dispatch]
  );
}

export function useOpenedSteps() {
  return useAppSelector((state) => state.step.opened);
}

export function useStepDetails(key: string) {
  return useAppSelector((state) => state.step.steps[key]);
}

export function getStepDetails(key: string) {
  return store.getState().step.steps[key];
}
