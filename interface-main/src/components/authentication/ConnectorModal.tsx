import { useState } from "react";
import { makeStyles } from "@mui/styles";
import { Box, Grid, Typography } from "@mui/material";
import Modal from "components/modal";
import { Trans, t } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import PlugWalletLogo from "./icons/PlugWallet";
import StoicWalletLogo from "./icons/StoicWallet";
import InterWalletLogo from "./icons/InternetIdentity";
import NFIDLogo from "./icons/NFID";
import InfinityWalletLogo from "./icons/Infinity";
import TextButton from "components/TextButton";
import { useErrorTip } from "hooks/useTips";
import { Connector } from "actor/Actor";
import { WalletConnector } from "utils/connector";
import { useWalletConnectorManager } from "store/auth/hooks";

const useStyles = makeStyles((theme: Theme) => {
  return {
    wrapper: {
      position: "relative",
      borderRadius: "12px",
      maxWidth: "100%",
    },
    walletBox: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px 16px",
      [theme.breakpoints.down("md")]: {
        gridTemplateColumns: "1fr ",
        gap: "16px 0",
      },
    },
    walletWrapper: {
      cursor: "pointer",
      padding: "12px 16px",
      background: "rgba(255, 255, 255, 0.08)",
      borderRadius: "8px",
      [theme.breakpoints.down("md")]: {
        padding: "8px 14px",
      },
    },
    walletComingSoon: {
      height: "80px",
      background: "rgba(17, 25, 54, 0.4)",
      border: "1px solid #29314F",
      borderRadius: "8px",
      [theme.breakpoints.down("md")]: {
        height: "64px",
      },
    },
  };
});

export const WALLETS = [
  { label: "Internet Identity", value: Connector.IC },
  { label: "Plug", value: Connector.PLUG },
  { label: "Stoic Wallet", value: Connector.STOIC },
  { label: "ICPSwap Wallet", value: Connector.ICPSwap },
  { label: "NFID", value: Connector.NFID },
  { label: "Bitfinity Wallet", value: Connector.INFINITY },
];

export function getWallet(walletType: Connector) {
  return WALLETS.find((wallet) => wallet.value === walletType);
}

export interface WalletConnectorProps {
  open: boolean;
  onClose: () => void;
}

export default function WalletConnectorView() {
  const [open, walletConnectorManager] = useWalletConnectorManager();

  const classes = useStyles();
  const [openErrorTip] = useErrorTip();

  const [connectLoading, setConnectLoading] = useState(
    WALLETS.reduce((prevValue, currValue) => {
      prevValue[currValue.value] = false;
      return prevValue;
    }, {} as { [key: string]: boolean })
  );

  const getLoading = (name: string) => {
    return connectLoading[name];
  };

  const setLoading = (name: string, value: boolean) => {
    setConnectLoading({
      ...connectLoading,
      [name]: value,
    });
  };

  const handleCreateConnect = async (wallet: Connector) => {
    try {
      if (getLoading(wallet)) return;

      if (window.ic && !window.ic.infinityWallet && wallet === Connector.INFINITY) {
        openErrorTip(t`Please install the infinity wallet extension!`);
        return;
      }

      if (window.ic && !window.ic.plug && wallet === Connector.PLUG) {
        openErrorTip(t`Please install the plug wallet extension!`);
        return;
      }

      setLoading(wallet, true);

      const connector = new WalletConnector();

      if (wallet) {
        await connector.create(wallet);
        const connectSuccessful = await connector.connect();

        if (connectSuccessful) {
          setLoading(wallet, false);

          walletConnectorManager(false);
        } else {
          setLoading(wallet, false);
        }
      } else {
        setLoading(wallet, false);
        throw new Error("Not support this wallet right now");
      }
    } catch (error) {
      console.error(error);
      setLoading(wallet, false);
      const w = getWallet(wallet);
      openErrorTip(t`Failed to connect to ${w ? w.label : "wallet"}.`);
    }
  };

  const Wallets = [
    {
      label: "Internet Identity",
      value: Connector.IC,
      logo: InterWalletLogo,
      event: () => handleCreateConnect(Connector.IC),
    },
    { label: "Plug", value: Connector.PLUG, logo: PlugWalletLogo, event: () => handleCreateConnect(Connector.PLUG) },
    {
      label: "Stoic Wallet",
      value: Connector.STOIC,
      logo: StoicWalletLogo,
      event: () => handleCreateConnect(Connector.STOIC),
    },
    { label: "NFID", value: Connector.NFID, logo: NFIDLogo, event: () => handleCreateConnect(Connector.NFID) },
    {
      label: "Bitfinity Wallet",
      value: Connector.INFINITY,
      logo: InfinityWalletLogo,
      event: () => handleCreateConnect(Connector.INFINITY),
    },
  ];

  return (
    <Modal open={open} onClose={() => walletConnectorManager(false)} title={t`Connect a wallet`}>
      <Grid container alignItems="center" flexDirection="column">
        <Box className={classes.wrapper}>
          <Box>
            <Typography
              sx={{
                fontSize: "16px",
                lineHeight: "20px",
              }}
            >
              <Trans>
                By connecting a wallet, you agree to ICPSwap’s{" "}
                <TextButton link="https://iloveics.gitbook.io/icpswap/legal-and-privacy/icpswap-terms-of-service">
                  Terms of Service
                </TextButton>{" "}
                and acknowledge that you have read and understand the{" "}
                <TextButton
                  link="https://iloveics.gitbook.io/icpswap/legal-and-privacy/icpswap-disclaimer"
                  sx={{
                    marginLeft: "0!important",
                  }}
                >
                  ICPSwap Disclaimer
                </TextButton>
                .
              </Trans>
            </Typography>
          </Box>
          <Box mt="24px">
            <Box className={classes.walletBox}>
              {Wallets.map((wallet) => (
                <Grid
                  container
                  alignItems="center"
                  key={wallet.value}
                  className={classes.walletWrapper}
                  onClick={() => wallet.event()}
                >
                  <Grid item xs>
                    <Typography color="text.primary" fontSize="14px" fontWeight={700}>
                      {wallet.label}
                    </Typography>
                  </Grid>
                  <Box
                    sx={{
                      width: "42px",
                      height: "42px",
                    }}
                  >
                    {(() => {
                      const Icon = wallet.logo;
                      return <Icon loading={getLoading(wallet.value)} />;
                    })()}
                  </Box>
                </Grid>
              ))}
            </Box>
          </Box>
        </Box>
      </Grid>
    </Modal>
  );
}
