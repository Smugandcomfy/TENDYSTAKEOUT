import { useAppSelector } from "store/hooks";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { useFetchGlobalTokenList } from "store/global/hooks";
import { useWalletConnectManager } from "store/auth/hooks";
import { SnackbarProvider } from "components/notistack";
import ErrorBoundary from "components/ErrorBoundary";
import WalletConnector from "components/authentication/ConnectorModal";
import { useWalletConnectorManager } from "store/auth/hooks";
import Loader from "components/Loading/LinearLoader";
import { useInitialTokenStandard } from "hooks/useInitialTokenStandard";
import GlobalSteps from "components/Steps/index";
import ActorError from "components/ActorError";

import Routes from "./routes";
import theme from "./themes";
import NavigationScroll from "./components/NavigationScroll";
import { FullscreenLoading } from "./components/index";

export default function App() {
  const customization = useAppSelector((state) => state.customization);

  const [, loading] = useWalletConnectManager();

  const [walletConnectorOpen] = useWalletConnectorManager();

  const { loading: fetchGlobalTokensLoading } = useFetchGlobalTokenList();
  const { loading: isInitialStandardLoading } = useInitialTokenStandard({ fetchGlobalTokensLoading });

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme(customization)}>
        <SnackbarProvider maxSnack={100}>
          <ActorError>
            <CssBaseline />
            <NavigationScroll>
              {loading || isInitialStandardLoading ? (
                <Loader />
              ) : (
                <ErrorBoundary>
                  <Routes />
                </ErrorBoundary>
              )}
              <FullscreenLoading />
              <GlobalSteps />
              {walletConnectorOpen ? <WalletConnector /> : null}
            </NavigationScroll>
          </ActorError>
        </SnackbarProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
