import React, { useState, useContext } from "react";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { BigNumber, parseTokenAmount, formatTokenAmount, isValidAddress, isValidPrincipal } from "utils/sdk/index";
import { ICP_TOKEN_INFO, WRAPPED_ICP_TOKEN_INFO } from "constants/tokens";
import CircularProgress from "@mui/material/CircularProgress";
import { useErrorTip, useSuccessTip } from "hooks/useTips";
import { Trans, t } from "@lingui/macro";
import { tokenTransfer } from "hooks/token/useTokenTransfer";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { getLocaleMessage } from "locales/services";
import Identity, { CallbackProps, SubmitLoadingProps } from "components/Identity/index";
import { Theme } from "@mui/material/styles";
import { TokenInfo } from "types/token";
import { ActorIdentity } from "types/index";
import { useAccountPrincipalString, useAccount, useAccountPrincipal } from "store/auth/hooks";
import WalletContext from "components/Wallet/context";
import { Modal, NumberFormat } from "components/index";
import { Principal } from "@dfinity/principal";
import MaxButton from "components/MaxButton";

const useStyles = makeStyles((theme: Theme) => {
  return {
    warningText: {
      color: theme.palette.warning.dark,
    },
  };
});

export type Values = {
  to: string;
  amount: string;
};

function usePrincipalStandard(standard: string) {
  return standard.includes("DIP20") || standard.includes("ICRC");
}

function useAccountStandard(standard: string) {
  return !usePrincipalStandard(standard);
}

export default function TransferModal({
  open,
  onClose,
  onTransferSuccess,
  token,
  chatTransferTo,
}: {
  open: boolean;
  onClose: () => void;
  onTransferSuccess?: () => void;
  token: TokenInfo;
  chatTransferTo?: string;
}) {
  const classes = useStyles();
  const account = useAccount();
  const principalString = useAccountPrincipalString();
  const principal = useAccountPrincipal();
  const [openErrorTip] = useErrorTip();
  const [openSuccessTip] = useSuccessTip();

  const { refreshTotalBalance, setRefreshTotalBalance } = useContext(WalletContext);

  const { result: balance } = useTokenBalance(token.canisterId, principal);

  const initialValues = {
    to: chatTransferTo ?? "",
    amount: "",
  };

  const [values, setValues] = useState<Values>(initialValues);

  const handleFieldChange = (value: string, field: string) => {
    setValues({
      ...values,
      [field]: value,
    });
  };

  const getErrorMessage = () => {
    if (!values.to) return t`Enter transfer to`;

    if (usePrincipalStandard(token.standard)) {
      try {
        Principal.fromText(values.to);
      } catch (error) {
        return t`Invalid principal ID`;
      }
    } else {
      if (!isValidAddress(values.to) && !isValidPrincipal(values.to)) return t`Invalid account ID or principal ID`;
    }

    if (!values.amount) return t`Enter an amount`;
    if (
      values.amount &&
      new BigNumber(values.amount ?? 0).isGreaterThan(parseTokenAmount(balance ?? 0, token.decimals))
    )
      return t`Insufficient balance`;
    if (!new BigNumber(values.amount).minus(parseTokenAmount(token.transFee, token.decimals)).isGreaterThan(0))
      return t`Must be greater than trans fee`;
  };

  const handleSubmit = async (identity: ActorIdentity, { loading, closeLoading }: SubmitLoadingProps) => {
    try {
      if (loading) return;

      const { status, message } = await tokenTransfer({
        canisterId: token.canisterId.toString(),
        to: values.to,
        amount: formatTokenAmount(
          new BigNumber(values.amount).minus(parseTokenAmount(token.transFee, token.decimals)),
          token.decimals
        ),
        identity,
        from: account,
      });

      if (status === "ok") {
        openSuccessTip(t`Transferred successfully`);
        setValues(initialValues);
        if (onTransferSuccess) onTransferSuccess();
        if (
          token.canisterId.toString() === ICP_TOKEN_INFO.canisterId ||
          token.canisterId.toString() === WRAPPED_ICP_TOKEN_INFO.canisterId
        ) {
          if (setRefreshTotalBalance) setRefreshTotalBalance(!refreshTotalBalance);
        }
      } else {
        openErrorTip(getLocaleMessage(message) ?? t`Failed to transfer`);
      }

      closeLoading();
    } catch (error) {
      console.error(error);
      closeLoading();
    }
  };

  const balanceActuallyToAccount = () => {
    const amount = new BigNumber(values.amount ?? 0).minus(parseTokenAmount(token.transFee, token.decimals));
    return amount.isGreaterThan(0) ? amount.toFormat() : 0;
  };

  const addressHelpText = () => {
    if (
      (usePrincipalStandard(token.standard) && principalString === values.to) ||
      (useAccountStandard(token.standard) && account === values.to) ||
      (useAccountStandard(token.standard) && isValidPrincipal(values.to) && principalString === values.to)
    ) {
      return (
        <span className={classes.warningText}>
          <Trans>Be careful, you are transferring tokens to your own address!</Trans>
        </span>
      );
    }
  };

  const errorMessage = getErrorMessage();

  const handleMax = (event: React.MouseEvent<HTMLParagraphElement>) => {
    event.stopPropagation();

    if (balance) {
      handleFieldChange(parseTokenAmount(balance, token.decimals).toString(), "amount");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={t`Transfer`}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField label={t`Token Symbol`} value={token.symbol} fullWidth disabled />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label={t`To`}
            value={values.to}
            placeholder={
              usePrincipalStandard(token.standard) ? t`Enter the principal ID` : t`Enter the account ID or principal ID`
            }
            onChange={({ target: { value } }) => handleFieldChange(value, "to")}
            helperText={addressHelpText()}
            fullWidth
            autoComplete="To"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label={t`Amount`}
            type="text"
            value={values.amount}
            onChange={({ target: { value } }) => handleFieldChange(value, "amount")}
            fullWidth
            inputProps={{
              autocomplete: "new-password",
              form: {
                autocomplete: "off",
              },
            }}
            InputProps={{
              inputComponent: NumberFormat,
              inputProps: {
                allowNegative: false,
                decimalScale: Number(token.decimals),
              },
            }}
            autoComplete="off"
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container alignItems="center">
            <Typography>
              <Trans>
                Balance:{" "}
                {`${
                  balance
                    ? new BigNumber(
                        parseTokenAmount(balance, token.decimals).toFixed(token.decimals > 8 ? 8 : token.decimals)
                      ).toFormat()
                    : "--"
                }`}
              </Trans>
            </Typography>
            <MaxButton
              sx={{
                marginLeft: "6px",
              }}
              onClick={handleMax}
            ></MaxButton>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            <Trans>Fee:</Trans> {parseTokenAmount(token?.transFee?.toString(), token.decimals).toFormat()}
            &nbsp;{token.symbol}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            <Trans>Actually:</Trans> {balanceActuallyToAccount()}
            &nbsp;{token.symbol}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography color="text.warning">
            <Trans>Please ensure that the receiving address supports this Token/NFT!</Trans>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Identity onSubmit={handleSubmit} fullScreenLoading>
            {({ submit, loading }: CallbackProps) => (
              <Button
                variant="contained"
                fullWidth
                color="primary"
                size="large"
                disabled={loading || !!errorMessage}
                onClick={submit}
              >
                {errorMessage ? (
                  errorMessage
                ) : !loading ? (
                  <Trans>Confirm</Trans>
                ) : (
                  <CircularProgress size={26} color="inherit" />
                )}
              </Button>
            )}
          </Identity>
        </Grid>
      </Grid>
    </Modal>
  );
}
