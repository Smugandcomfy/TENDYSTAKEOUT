import Modal from "components/modal/index";
import { Trans, t } from "@lingui/macro";
import { Typography, Grid, Box, Button } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutline";
import { parseTokenAmount, formatDollarAmount } from "utils/sdk/index";
import { useTokenInfo } from "hooks/token/index";
import { WRAPPED_ICP_TOKEN_INFO } from "constants/index";
import { useICPPrice } from "store/global/hooks";
import { parseExchangeRatio } from "utils/launchpad/index";
import { Theme } from "@mui/material/styles";
import { Property, TokenSet } from "types/launchpad";

const useStyles = makeStyles((theme: Theme) => {
  return {
    box: {
      height: "108px",
      background: theme.palette.background.level4,
      borderRadius: "12px",
    },
  };
});

export interface WithdrawSuccProps {
  pool: Property;
  data: TokenSet;
  onConfirm: () => void;
  onClose: () => void;
  open: boolean;
}

export default function WithdrawSuccessModal({ pool, data, onConfirm, onClose, open }: WithdrawSuccProps) {
  const theme = useTheme() as Theme;
  const classes = useStyles();
  const { result: tokenInfo } = useTokenInfo(pool.soldTokenId);
  const ICPPrice = useICPPrice();

  const getUSDValue = (symbol: string, amount: string) => {
    if (symbol === tokenInfo?.symbol) {
      return formatDollarAmount(
        parseTokenAmount(amount, tokenInfo?.decimals)
          .multipliedBy(parseExchangeRatio(pool.initialExchangeRatio))
          .multipliedBy(ICPPrice ?? 0)
          .toNumber()
      );
    } else {
      return formatDollarAmount(
        parseTokenAmount(amount, WRAPPED_ICP_TOKEN_INFO.decimals)
          .multipliedBy(ICPPrice ?? 0)
          .toNumber()
      );
    }
  };

  return (
    <Modal title={t`Withdrew Successfully`} open={open} onClose={onClose}>
      <Grid container flexDirection="column" alignItems="center">
        <CheckCircleIcon
          sx={{
            fontSize: "6em",
            color: theme.themeOption.colors.successDark,
          }}
        />
      </Grid>
      <Grid mt="52px" container justifyContent="space-between">
        {Object.values(data).map((value, index) => (
          <Grid
            item
            key={index}
            sx={{
              width: "48%",
            }}
          >
            <Grid container className={classes.box} flexDirection="column" alignItems="center" justifyContent="center">
              <Typography fontSize="24px" fontWeight={600} color="text.primary">
                {parseTokenAmount(
                  value.quantity,
                  value.symbol === tokenInfo?.symbol ? tokenInfo?.decimals : WRAPPED_ICP_TOKEN_INFO.decimals
                ).toFormat()}{" "}
                {value.symbol}
              </Typography>
              <Typography
                fontSize="18px"
                sx={{
                  marginTop: "12px",
                }}
              >
                ~ {getUSDValue(value.symbol, value.quantity)}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Box mt="45px">
        <Button fullWidth variant="contained" onClick={onConfirm} size="large">
          <Trans>Confirm</Trans>
        </Button>
      </Box>
    </Modal>
  );
}
