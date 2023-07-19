import { Grid, useTheme, useMediaQuery } from "@mui/material";
import WalletPageToggle from "components/Wallet/PageToggle";

export default function NFTListHeader() {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid container>
      <Grid item xs={matchDownSM ? 12 : 3}>
        <WalletPageToggle />
      </Grid>
    </Grid>
  );
}
