import { useEffect } from "react";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import PoolsContainer from "components/launchpad/PoolsContainer";
import SetParameters from "components/launchpad/create/SetParameters";
import { useStep, useClearState } from "store/launchpad/hooks";
import Review from "components/launchpad/create/Review";

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return <SetParameters />;
    case 1:
      return <Review />;
    default:
      return <SetParameters />;
  }
}

export default function CreateLaunchpad() {
  const activeStep = useStep();
  const clearState = useClearState();

  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    return () => {
      clearState();
    };
  }, [clearState]);

  return (
    <PoolsContainer>
      <Grid item container justifyContent="center">
        <Grid item xs={matchDownMD ? 10 : 6}>
          {getStepContent(activeStep)}
        </Grid>
      </Grid>
    </PoolsContainer>
  );
}
