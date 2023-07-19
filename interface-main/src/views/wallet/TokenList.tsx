import { useState } from "react";
import { Grid } from "@mui/material";
import TokenList from "components/Wallet/TokenList";
import MainCard from "components/cards/MainCard";
import WalletContext from "components/Wallet/context";
import { useIsConnected } from "store/auth/hooks";
import ConnectWallet from "components/ConnectWallet";

export default function WalletTokenList() {
  const [refreshBalance, setRefreshBalance] = useState<number>(0);
  const [refreshTotalBalance, setRefreshTotalBalance] = useState(false);

  const walletIsConnected = useIsConnected();

  return walletIsConnected ? (
    <WalletContext.Provider value={{ refreshTotalBalance, setRefreshTotalBalance, refreshBalance, setRefreshBalance }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard>{walletIsConnected ? <TokenList /> : null}</MainCard>
        </Grid>
      </Grid>
    </WalletContext.Provider>
  ) : (
    <ConnectWallet />
  );
}
