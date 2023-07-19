import { useMemo, useCallback } from "react";
import { useHistory } from "react-router";
import { Grid, Typography } from "@mui/material";
import { t } from "@lingui/macro";

const DISPLAY_NAME = {
  TOKEN: "token",
  NFT: "nft",
};

const DISPLAY_ITEMS = [
  {
    displayName: DISPLAY_NAME.TOKEN,
    name: t`Token`,
    path: "/wallet/token",
  },
];

export default function WalletPageToggle() {
  const history = useHistory();

  const {
    location: { pathname },
  } = history;

  const currentDisplay = useMemo(() => {
    return DISPLAY_ITEMS.filter((item) => item.path === pathname)[0].displayName;
  }, [pathname]);

  const handleToggle = useCallback(
    (item) => {
      history.push(item.path);
    },
    [history]
  );

  return (
    <Grid container spacing={3}>
      {DISPLAY_ITEMS.map((item) => (
        <Grid item key={item.path}>
          <Typography
            variant="h3"
            color={currentDisplay === item.displayName ? "textPrimary" : ""}
            onClick={() => handleToggle(item)}
            sx={{ cursor: "pointer" }}
          >
            {item.name}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
}
