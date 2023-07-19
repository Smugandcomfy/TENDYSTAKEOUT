import { Grid } from "@mui/material";
import PoolsContainer from "components/launchpad/PoolsContainer";
import PoolList from "components/launchpad/PoolList";

export default function YourLaunchpadPools() {
  return (
    <PoolsContainer>
      <Grid item container justifyContent="center">
        <PoolList />
      </Grid>
    </PoolsContainer>
  );
}
