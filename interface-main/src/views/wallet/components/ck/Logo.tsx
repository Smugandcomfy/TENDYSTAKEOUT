import { Box } from "@mui/material";
import { ckBTC_LOGO, icBTC_logo } from "constants/ckBTC";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  logo_box: {
    position: "relative",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    "&.ck": {
      background:
        "linear-gradient(0deg, rgba(105, 108, 225, 0.39), rgba(105, 108, 225, 0.39)), linear-gradient(0deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.14))",
    },
    "&.ic": {
      background: "linear-gradient(135.36deg, #3A425F 15.81%, rgba(41, 49, 79, 0) 77.64%)",
    },
  },
  logo: {
    width: "74px",
    height: "74px",
    position: "absolute",
    top: "3px",
    left: "3px",
  },
}));

function SwitchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 6L12 12L6 18"
        stroke="#8572FF"
        strokeOpacity="0.6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 6L18 12L12 18" stroke="#8572FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Logo({ type }: { type: "mint" | "dissolve" }) {
  const classes = useStyles();

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "0 59px" }}>
      <Box className={`${classes.logo_box} ${type === "mint" ? "ic" : "ck"}`}>
        <Box className={classes.logo}>
          <img src={type === "mint" ? icBTC_logo : ckBTC_LOGO} alt="" width="100%" height="100%"></img>
        </Box>
      </Box>

      <SwitchIcon></SwitchIcon>

      <Box className={`${classes.logo_box} ${type === "mint" ? "ck" : "ic"}`}>
        <Box className={classes.logo}>
          <img src={type === "mint" ? ckBTC_LOGO : icBTC_logo} alt="" width="100%" height="100%"></img>
        </Box>
      </Box>
    </Box>
  );
}
