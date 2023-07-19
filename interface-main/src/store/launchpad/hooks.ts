import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { updateStep, updateLaunchpadValue, clearState } from "./actions";
import { useAppSelector } from "store/hooks";
import { Values } from "./states";

export function useValues() {
  return useAppSelector((state) => state.launchpad.values);
}

export function useClearStep() {
  const dispatch = useDispatch();

  return useCallback(() => {
    dispatch(updateStep(0));
  }, [dispatch]);
}

export function useClearState() {
  const dispatch = useDispatch();

  return useCallback(() => {
    dispatch(clearState());
  }, [dispatch]);
}

export function useStep() {
  return useAppSelector((state) => state.launchpad.step);
}

export function useGoNextStep() {
  const dispatch = useDispatch();
  const curStep = useStep();

  return useCallback(() => {
    dispatch(updateStep(curStep + 1));
  }, [dispatch, curStep]);
}

export function useGoPrevStep() {
  const dispatch = useDispatch();
  const curStep = useStep();

  return useCallback(() => {
    dispatch(updateStep(curStep - 1));
  }, [dispatch, curStep]);
}

export function useValuesManager(): [Values, (value: any, field: string) => void] {
  const dispatch = useDispatch();
  const values = useValues();

  const onFiledChange = useCallback(
    (value, field) => {
      dispatch(updateLaunchpadValue({ value, field }));
    },
    [dispatch]
  );

  return useMemo(() => [values, onFiledChange], [values, onFiledChange]);
}

export type Value = {
  value: any;
  field: string;
};

export function useUpdateValue() {
  const dispatch = useDispatch();

  return useCallback(
    (values: Value[]) => {
      values.forEach(({ value, field }) => {
        dispatch(updateLaunchpadValue({ value, field }));
      });
    },
    [dispatch]
  );
}
