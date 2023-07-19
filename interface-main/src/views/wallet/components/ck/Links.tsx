import { Box, Typography } from "@mui/material";
import { Trans } from "@lingui/macro";
import { ckBTC_CANISTER, ckBTC_DASHBOARD } from "constants/ckBTC";

function ArrowIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.43866 2.42969H1.16146V0.429688H8.85723H9.85723V1.42969V9.12545H7.85723V3.83954L1.94156 9.75521L0.527344 8.341L6.43866 2.42969Z"
        fill="#5669DC"
      />
    </svg>
  );
}

export default function BTCLinks() {
  return (
    <Box sx={{ margin: "30px 0 0 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px 0" }}>
      <a href={ckBTC_DASHBOARD} target="_blank" style={{ textDecoration: "none" }} rel="noreferrer">
        <Box sx={{ display: "flex", gap: "0 10px", alignItems: "center" }}>
          <Typography>
            <Trans>Open in ckBTC Dashboard</Trans>
          </Typography>
          <ArrowIcon></ArrowIcon>
        </Box>
      </a>

      <a href={ckBTC_CANISTER} target="_blank" style={{ textDecoration: "none" }} rel="noreferrer">
        <Box sx={{ display: "flex", gap: "0 10px", alignItems: "center" }}>
          <Typography>
            <Trans>Open in ckBTC canister</Trans>
          </Typography>
          <ArrowIcon></ArrowIcon>
        </Box>
      </a>
    </Box>
  );
}
