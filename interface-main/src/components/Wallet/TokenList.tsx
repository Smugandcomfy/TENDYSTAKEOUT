import { useState, useEffect, useMemo } from "react";
import { Grid } from "@mui/material";
import TokenListTable from "components/Wallet/TokenListTable";
import TokenListHeader from "components/Wallet/TokenListHeader";
import { ICP_METADATA, WRAPPED_ICP_METADATA } from "constants/tokens";
import { NETWORK, network } from "constants/server";
import { useWalletCatchTokenIds, useUpdateHideSmallBalanceManager } from "store/wallet/hooks";
import { useHistory } from "react-router-dom";
import { DISPLAY_TOKENS_IN_IC, DISPLAY_IN_WALLET_FOREVER } from "constants/wallet";

export default function WalletTokenList() {
  const [searchValue, setSearchValue] = useState("");
  const [isHideSmallBalances, setIsHideSmallBalances] = useUpdateHideSmallBalanceManager();
  const [listLoading, setListLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [symbol, setSymbol] = useState("");
  const walletCacheTokenIds = useWalletCatchTokenIds();
  const history = useHistory();

  const sourceData = useMemo(() => {
    let tokens = [ICP_METADATA.canisterId.toString(), WRAPPED_ICP_METADATA.canisterId.toString()];

    if (network === NETWORK.IC) {
      tokens = [...tokens, ...DISPLAY_TOKENS_IN_IC];
    }

    return [...tokens, ...walletCacheTokenIds.filter((id) => !DISPLAY_IN_WALLET_FOREVER.includes(id))];
  }, [setListLoading, walletCacheTokenIds]);

  useEffect(() => {
    if (history.location.search.includes("&")) {
      const searchArr = history.location.search.split("&") || [];

      searchArr.forEach((item) => {
        if (item.includes("address")) {
          const address = item.split("=")[1];
          setAddress(address);
        }
        if (item.includes("symbol")) {
          const symbol = item.split("=")[1];
          setSymbol(symbol);
        }
      });
    }
  }, [history.location.search]);

  const handleSearchValue = (value: string) => {
    setSearchValue(value);
  };

  const hideSmallBalances = (hideOrNot: boolean) => {
    setIsHideSmallBalances(hideOrNot);
  };

  return (
    <>
      <Grid container flexDirection="column" spacing={3}>
        <Grid item xs={12}>
          <TokenListHeader
            onHideSmallBalances={hideSmallBalances}
            onSearchValue={handleSearchValue}
            isHideSmallBalances={isHideSmallBalances}
          />
        </Grid>
        <Grid item xs={12}>
          <TokenListTable
            address={address}
            setAddress={setAddress}
            symbol={symbol}
            setSymbol={setSymbol}
            isHideSmallBalances={isHideSmallBalances}
            list={sourceData}
            loading={listLoading}
            searchValue={searchValue}
          />
        </Grid>
      </Grid>
    </>
  );
}
