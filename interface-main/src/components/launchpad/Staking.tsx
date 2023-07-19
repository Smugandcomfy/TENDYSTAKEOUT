import React, { useState } from "react";
import Modal from "components/modal/swap";
import { Trans, t } from "@lingui/macro";
import { Typography, Box, Button, useTheme } from "@mui/material";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { useTokenInfo } from "hooks/token/index";
import { useAccountPrincipal } from "store/auth/hooks";
import { useErrorTip, useSuccessTip } from "hooks/useTips";
import NumberFormat from "components/number-format";
import { parseTokenAmount, formatTokenAmount, numberToString, moErrMessageFormat } from "utils/sdk/index";
import TextField from "components/TextField/index";
import Identity, { CallbackProps } from "components/Identity";
import { ActorIdentity } from "types/global";
import { Theme } from "@mui/material/styles";
import { Property } from "types/index";
import { useDeposit } from "hooks/launchpad/useDeposit";
import { useLoadingTip, TIP_KEY } from "hooks/useTips";
import StepViewButton from "components/Steps/View";

export interface StakingProps {
  open: boolean;
  onClose: () => void;
  pool: Property;
  launchpadCanisterId: string;
  isFirstTimeStaking: boolean;
  onStakingSuccess: () => void;
  onStakingFailed?: () => void;
}

export default function Staking({
  pool,
  launchpadCanisterId,
  isFirstTimeStaking,
  onStakingSuccess,
  onStakingFailed,
  open,
  onClose,
}: StakingProps) {
  const theme = useTheme() as Theme;
  const principal = useAccountPrincipal();
  const [openErrorTip] = useErrorTip();

  const [openSuccessTip] = useSuccessTip();

  const { result: depositTokenInfo } = useTokenInfo(pool.pricingTokenId);

  const { result: _balance = 0 } = useTokenBalance(depositTokenInfo?.canisterId, principal);
  const balance = parseTokenAmount(_balance, depositTokenInfo?.decimals);

  const [amount, setAmount] = useState<number | null | string>(null);

  const deposit = useDeposit();

  const [openLoadingTip, closeLoadingTip] = useLoadingTip();

  const handleStaking = async (identity: ActorIdentity) => {
    if (!depositTokenInfo || !launchpadCanisterId || !principal) return;

    let loadingKey: TIP_KEY = "";

    try {
      const depositTokenAmount = numberToString(formatTokenAmount(amount, depositTokenInfo.decimals));

      const { call, key } = deposit(depositTokenInfo, depositTokenAmount, launchpadCanisterId, isFirstTimeStaking);

      loadingKey = openLoadingTip(t`Deposit ${amount} ${depositTokenInfo.symbol} to ${launchpadCanisterId}`, {
        extraContent: <StepViewButton step={key}></StepViewButton>,
      });

      const result = await call();

      if (result) {
        openSuccessTip(t`Deposited Successfully`);
        if (onStakingSuccess) onStakingSuccess();
      }

      closeLoadingTip(loadingKey);
    } catch (err) {
      const error = moErrMessageFormat(err);
      console.log(err);
      openErrorTip(error ?? t`Failed to deposit`);
      if (onStakingFailed) onStakingFailed();
      if (loadingKey) closeLoadingTip(loadingKey);
    }
  };

  const handleMax = () => {
    setAmount(balance.toFixed(4));
  };

  let errorMessage = "";
  if (balance.isLessThan(amount ?? 0)) errorMessage = t`Insufficient ${depositTokenInfo?.symbol ?? "token"} balance`;
  if (!amount) errorMessage = t`Enter the amount`;

  return (
    <Modal title={t`Deposit ${depositTokenInfo?.symbol ?? "Token"}`} open={open} onClose={onClose}>
      <Box>
        <TextField
          placeholder="Deposit Amount"
          fullWidth
          variant="standard"
          InputProps={{
            inputComponent: NumberFormat,
            disableUnderline: true,
            inputProps: {
              thousandSeparator: true,
              decimalScale: 4,
              allowNegative: false,
              maxLength: 20,
            },
            endAdornment: balance?.isGreaterThan(0) ? (
              <Box
                sx={{
                  borderRadius: "2px",
                  padding: "1px 2px",
                  background: theme.colors.darkSecondaryMain,
                  cursor: "pointer",
                }}
                onClick={handleMax}
              >
                <Typography color="text.primary" fontSize="12px">
                  <Trans>Max</Trans>
                </Typography>
              </Box>
            ) : null,
          }}
          value={amount}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAmount(event.target.value)}
        />
        <Box mt={1}>
          <Typography align="right">
            <Trans>Balance:</Trans>{" "}
            <Typography component="span" color="text.primary">
              {balance.toFormat()}
            </Typography>
          </Typography>
        </Box>
      </Box>
      <Box mt={5} mb={3}>
        <Identity onSubmit={handleStaking}>
          {({ submit }: CallbackProps) => (
            <Button variant="contained" fullWidth size="large" disabled={!!errorMessage} onClick={submit}>
              {!!errorMessage ? errorMessage : <Trans>Confirm</Trans>}
            </Button>
          )}
        </Identity>
      </Box>
    </Modal>
  );
}
