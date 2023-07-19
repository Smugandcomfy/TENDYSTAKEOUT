import React from "react";
import { useHistory } from "react-router-dom";
import { Grid, Box, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import MainCard from "components/cards/MainCard";
import { useValuesManager, useGoPrevStep } from "store/launchpad/hooks";
import { usePoolStateInfo, createLaunchpad, createLaunchpadManager } from "hooks/launchpad/index";
import { useFullscreenLoading, useErrorTip, useSuccessTip } from "hooks/useTips";
import {
  moErrMessageFormat,
  BigNumber,
  parseTokenAmount,
  numberToString,
  formatTokenAmount,
  ResultStatus,
} from "utils/sdk/index";
import dayjs from "dayjs";
import { LaunchpadLocales } from "locales/services";
import Identity, { CallbackProps } from "components/Identity";
import { useAccountPrincipal } from "store/auth/hooks";
import { ActorIdentity } from "types/global";
import { useTokenInfo } from "hooks/token/index";
import { useTokenTransferOrApprove } from "hooks/token/useTokenApprove";
import { tokenTransfer } from "hooks/token/useTokenTransfer";

export function DetailItem({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <Grid container>
      <Grid item xs>
        <Typography>{label}</Typography>
      </Grid>
      <Grid item xs>
        <Typography color="text.primary" align="right">
          {value}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default function Review() {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));

  const [openFullscreenLoading, closeFullscreenLoading] = useFullscreenLoading();

  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();

  const principal = useAccountPrincipal();

  const [values] = useValuesManager();
  const toPrevStep = useGoPrevStep();

  const history = useHistory();

  const { result: depositTokenInfo } = useTokenInfo(values.depositTokenId);

  const { depositQuantity, soldTokenInfo } = usePoolStateInfo();

  const tokenTransferOrApprove = useTokenTransferOrApprove();

  const handleCreateLaunchpad = async (identity: ActorIdentity) => {
    if (!soldTokenInfo || !principal) return;

    openFullscreenLoading();

    try {
      const result = await createLaunchpadManager({
        values,
        tokenInfo: soldTokenInfo,
        identity,
        soldTokenStandard: values.soleTokenStandard,
        creatorPrincipal: principal,
      });

      if (result.status === "ok" && !!result.data) {
        const managerCanisterId = result.data;

        const status = await tokenTransferOrApprove(
          soldTokenInfo.canisterId.toString(),
          numberToString(formatTokenAmount(values.expectedSellQuantity, soldTokenInfo.decimals)),
          managerCanisterId
        );

        if (!status) {
          openErrorTip(t`Failed to transfer or approve`);
          return;
        }

        if (soldTokenInfo.transFee > BigInt(0)) {
          const result = await tokenTransfer({
            canisterId: soldTokenInfo.canisterId.toString(),
            to: managerCanisterId,
            amount: new BigNumber(String(soldTokenInfo.transFee * BigInt(50))),
            identity: identity,
            from: principal.toString(),
          });

          if (result.status === ResultStatus.ERROR) {
            openErrorTip(t`Failed to transfer 50 times fee`);
          }
        }

        const result1 = await createLaunchpad({
          canisterId: managerCanisterId,
          values,
          decimals: soldTokenInfo.decimals,
          identity,
          creatorPrincipal: principal,
        });

        if (result1.status === ResultStatus.OK) {
          openSuccessTip(t`Created successfully`);
          history.push("/console/launchpad/your");
        } else {
          openErrorTip(LaunchpadLocales[result1.message] ?? result1.message ?? t`Failed to create`);
        }
      } else {
        openErrorTip(t`Failed to create`);
        closeFullscreenLoading();
      }
    } catch (err) {
      console.log(err);
      // @ts-ignore
      const error = moErrMessageFormat(err);
      openErrorTip(LaunchpadLocales[error] ?? error ?? t`Failed to create`);
    }

    closeFullscreenLoading();
  };

  return (
    <Box pb={5}>
      <MainCard level={4}>
        <Typography variant="h3" color="text.primary">
          <Trans>Launchpad Details</Trans>
        </Typography>
        <Box mt={2}>
          <Box>
            <DetailItem label={t`Start Time`} value={dayjs(values.startDateTime).format("YYYY-MM-DD HH:mm")} />
          </Box>
          <Box mt={3}>
            <DetailItem label={t`End Time`} value={dayjs(values.endDateTime).format("YYYY-MM-DD HH:mm")} />
          </Box>
          <Box mt={3}>
            <DetailItem label={t`Deposit Token`} value={depositTokenInfo?.symbol} />
          </Box>
          <Box mt={3}>
            <DetailItem label={t`Sale Token`} value={!!soldTokenInfo ? soldTokenInfo?.symbol : "--"} />
          </Box>
          <Box mt={3}>
            <DetailItem
              label={t`Exchange Ratio`}
              value={
                !!soldTokenInfo
                  ? `1 ${soldTokenInfo?.symbol} = ${values.initialExchangeRatio} ${depositTokenInfo?.symbol}`
                  : "--"
              }
            />
          </Box>
          <Box mt={3}>
            <DetailItem
              label={t`Whitelist`}
              value={`${!!values.whitelist?.length ? values.whitelist.length : "Null"}`}
            />
          </Box>
        </Box>
      </MainCard>
      <Box mt="26px">
        <MainCard level={4}>
          <Box>
            <DetailItem label={t`Sale Amount`} value={new BigNumber(values.expectedSellQuantity).toFormat()} />
          </Box>
          <Box mt={3}>
            <DetailItem
              label={t`Transfer Fee`}
              value={`${parseTokenAmount(String(soldTokenInfo?.transFee), soldTokenInfo?.decimals)
                .multipliedBy(50)
                .toFormat()} ${soldTokenInfo?.symbol}`}
            />
          </Box>
          <Box mt={3}>
            <DetailItem label={t`Funds To Raise`} value={`${depositQuantity} ${depositTokenInfo?.symbol}`} />
          </Box>
          <Box mt={3}>
            <DetailItem label={t`Amount of canister created`} value={`${values.canisterQuantity}`} />
          </Box>
          {/* <Box mt={3}>
            <DetailItem label={t`Funds Values`} value={totalFunds} />
          </Box> */}
        </MainCard>
      </Box>
      <Grid mt={4}>
        <Grid container justifyContent="space-between">
          <Grid item sx={{ width: matchDownMD ? "100%" : "48%" }}>
            <Button variant="outlined" fullWidth onClick={toPrevStep} size="large">
              <Trans>Previous Step</Trans>
            </Button>
          </Grid>
          <Grid item sx={{ width: matchDownMD ? "100%" : "48%", marginTop: matchDownMD ? "20px" : 0 }}>
            <Identity onSubmit={handleCreateLaunchpad}>
              {({ submit }: CallbackProps) => (
                <Button variant="contained" fullWidth onClick={submit} size="large">
                  <Trans>Confirm</Trans>
                </Button>
              )}
            </Identity>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
