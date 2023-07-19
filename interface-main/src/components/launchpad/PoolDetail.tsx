import { ReactNode } from "react";
import { Grid, Typography } from "@mui/material";
import Modal from "components/modal/index";
import { parseTokenAmount, timestampFormat } from "utils/sdk/index";
import { t } from "@lingui/macro";
import { usePoolRaiseTokenAmount, usePoolWhitelistSize } from "hooks/launchpad/index";
import { useTokenInfo } from "hooks/token/index";
import { parseExchangeRatio } from "utils/launchpad";

const DetailItem = ({ label, value }: { label: ReactNode; value: ReactNode }) => {
  return (
    <Grid container mb="24px">
      <Grid item xs={4}>
        <Typography>{label}</Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography
          color="textPrimary"
          sx={{
            textAlign: "right",
            wordBreak: "break-all",
          }}
        >
          {value}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default function PoolDetail({ open, onClose, pool }: { open: boolean; onClose: () => void; pool: any }) {
  const { raiseAmount } = usePoolRaiseTokenAmount(pool);
  // const raiseValue = usePoolFundsValue(raiseAmount);
  const { result: soldTokenInfo } = useTokenInfo(pool.soldTokenId);
  const { result: depositTokenInfo } = useTokenInfo(pool.pricingTokenId);
  const { result: whitelistCount } = usePoolWhitelistSize(pool.cid);

  return (
    <Modal title={t`Details`} onClose={onClose} open={open}>
      <DetailItem label={t`Name`} value={pool.name} />
      <DetailItem label={t`Start Time`} value={timestampFormat(pool.startDateTime)} />
      <DetailItem label={t`End Time`} value={timestampFormat(pool.endDateTime)} />
      <DetailItem label={t`Deposit Token`} value={depositTokenInfo?.symbol} />
      <DetailItem label={t`Sale Token`} value={soldTokenInfo?.symbol} />
      <DetailItem label={t`Exchange Ratio`} value={parseExchangeRatio(pool.initialExchangeRatio).toFormat()} />
      <DetailItem
        label={t`Sale Amount`}
        value={parseTokenAmount(pool.expectedSellQuantity, soldTokenInfo?.decimals).toFormat()}
      />
      <DetailItem label={t`Funds To Raise`} value={`${raiseAmount.toFormat()} ${depositTokenInfo?.symbol}`} />
      {/* <DetailItem label={t`Funds Values`} value={raiseValue} /> */}
      <DetailItem label={t`Whitelist Count`} value={Number(whitelistCount ?? 0)} />
    </Modal>
  );
}
