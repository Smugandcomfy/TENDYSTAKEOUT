import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import ErrorImage from "assets/images/Error";
import MainLayout from "components/AppBody";
import { Trans } from "@lingui/macro";
import copy from "copy-to-clipboard";

type ErrorBoundaryState = {
  error: Error | null;
};

export default class ErrorBoundary extends React.Component<unknown, ErrorBoundaryState> {
  constructor(props: unknown) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  render() {
    const { error } = this.state;

    const handleCopyError = () => {
      copy(error?.toString() ?? "");
    };

    if (error !== null) {
      return (
        <MainLayout>
          <Box sx={{ width: "100%", height: "calc(100vh - 280px)" }}>
            <Grid container alignItems="center" justifyContent="center" sx={{ width: "100%", height: "100%" }}>
              <Grid item>
                <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center" }}>
                  <Typography color="text.primary" align="center" sx={{ fontSize: "24px", margin: "0 0 20px 0" }}>
                    <Trans>Oops, you've encountered an error</Trans>
                  </Typography>

                  <ErrorImage />

                  <Box
                    sx={{
                      width: "374px",
                      height: "182px",
                      background: "rgba(17, 25, 54, 0.2)",
                      borderRadius: "8px",
                      padding: "24px",
                    }}
                  >
                    <Box sx={{ height: "112px", overflow: "hidden" }}>
                      <Typography color="text.primary" fontSize="12px" sx={{ wordBreak: "break-word" }}>
                        {error.toString()}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: "42px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "10px",
                        background: "#4F5A84",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      onClick={handleCopyError}
                    >
                      <Typography color="text.primary" fontSize="12px">
                        <Trans>Copy</Trans>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </MainLayout>
      );
    }

    return this.props.children;
  }
}
