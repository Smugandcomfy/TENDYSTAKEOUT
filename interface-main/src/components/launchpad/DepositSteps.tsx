import { Box, Avatar } from "@mui/material";
import { t } from "@lingui/macro";
import { isUseTransfer } from "utils/token/index";
import { TokenInfo } from "types/token";
import { parseTokenAmount, toSignificant } from "utils/sdk/index";

export interface StepsProps {
  token: TokenInfo;
  amount: string;
  key: string;
}

export function getDepositStepView({ token, amount, key }: StepsProps) {
  const symbol = token.symbol;
  const address = token.canisterId;
  const logo0 = token.logo;

  const amount0Value = (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Avatar sx={{ width: "16px", height: "16px", margin: "0 4px 0 0" }} src={logo0}>
        &nbsp;
      </Avatar>
      {toSignificant(parseTokenAmount(amount, token.decimals).toString(), 8)}
    </Box>
  );

  const isTokenInUseTransfer = isUseTransfer(token.canisterId);

  const steps = [
    {
      title: isTokenInUseTransfer ? t`Transfer ${symbol}` : t`Approve ${symbol}`,
      step: 0,
      children: [
        { label: t`Amount`, value: amount0Value },
        { label: t`Canister Id`, value: address },
      ],
    },
    {
      title: t`Deposit ${symbol}`,
      step: 1,
      children: [
        {
          label: t`Amount`,
          value: amount0Value,
        },
        { label: t`Canister Id`, value: address },
      ],
    },
  ];

  return steps;
}
