import { useCallback } from "react";
import { useTokenTransferOrApprove } from "hooks/token/useTokenApprove";
import { launchpadCanister } from "actor/index";
import { isUseTransfer } from "utils/token/index";
import { getActorIdentity } from "components/Identity";
import { useErrorTip, TIP_OPTIONS } from "hooks/useTips";
import { ResultStatus, enumResultFormat } from "utils/sdk/index";
import { useStepCalls, newStepKey } from "hooks/useStepCall";
import { useInitialAndUpdateStep } from "store/steps/hooks";
import { getDepositStepView } from "components/launchpad/DepositSteps";
import { TokenInfo } from "types/index";
import { t } from "@lingui/macro";

function useDepositStepView() {
  const updateStep = useInitialAndUpdateStep();

  return useCallback((token: TokenInfo, amount: string, key: number | string) => {
    if (!token) return undefined;

    const content = getDepositStepView({
      token,
      amount,
      key: key.toString(),
    });

    updateStep(String(key), {
      content,
      title: t`Deposit Details`,
    });
  }, []);
}

async function addInvestor(poolId: string, isFirstTimeStaking: boolean) {
  const identity = await getActorIdentity();

  if (isFirstTimeStaking) {
    return enumResultFormat<boolean>(await (await launchpadCanister(poolId, identity)).addInvestor());
  } else {
    return enumResultFormat<boolean>(await (await launchpadCanister(poolId, identity)).appendPricingTokenQuantity());
  }
}

async function addInvestorFromApprove(poolId: string, tokenQuantity: string, isFirstTimeStaking: boolean) {
  const identity = await getActorIdentity();

  if (isFirstTimeStaking) {
    return enumResultFormat<boolean>(
      await (await launchpadCanister(poolId, identity)).addInvestorFromApprove(tokenQuantity)
    );
  } else {
    return enumResultFormat<boolean>(
      await (await launchpadCanister(poolId, identity)).appendPricingTokenQuantityFromApprove(tokenQuantity)
    );
  }
}

function useAddInvestor() {
  const [openErrorTip] = useErrorTip();

  return useCallback(
    async (
      token: string,
      tokenQuantity: string,
      poolId: string,
      isFirstTimeStaking: boolean,
      options?: TIP_OPTIONS
    ) => {
      const useTransfer = isUseTransfer(token);

      let status: ResultStatus = ResultStatus.ERROR;
      let message: string = "";

      if (useTransfer) {
        const { status: _status, message: _message } = await addInvestor(poolId, isFirstTimeStaking);
        status = _status;
        message = _message;
      } else {
        const { status: _status, message: _message } = await addInvestorFromApprove(
          poolId,
          tokenQuantity,
          isFirstTimeStaking
        );
        status = _status;
        message = _message;
      }

      if (status === "err") {
        openErrorTip(`Failed to deposit ${token}: ${message}`, options);
        return false;
      }

      return true;
    },
    []
  );
}

interface CallProps {
  token: string;
  tokenQuantity: string;
  poolId: string;
  isFirstTimeStaking: boolean;
}

function useCalls() {
  const transOrApprove = useTokenTransferOrApprove();
  const addInvestor = useAddInvestor();

  return useCallback(({ token, tokenQuantity, poolId, isFirstTimeStaking }: CallProps) => {
    const call0 = async () => await transOrApprove(token, tokenQuantity, poolId);
    const call1 = async () => await addInvestor(token, tokenQuantity, poolId, isFirstTimeStaking);

    return [call0, call1];
  }, []);
}

export function useDeposit() {
  const createCalls = useCalls();
  const createStep = useStepCalls();
  const createStepView = useDepositStepView();

  return useCallback(
    (token: TokenInfo, tokenQuantity: string, poolId: string, isFirstTimeStaking: boolean) => {
      const key = newStepKey();

      const _calls = createCalls({ token: token.canisterId, tokenQuantity, poolId, isFirstTimeStaking });

      createStepView(token, tokenQuantity, key);

      const { call, reset, retry } = createStep(_calls, key.toString());

      return { call, reset, retry, key };
    },
    [createCalls, createStep, createStepView]
  );
}
