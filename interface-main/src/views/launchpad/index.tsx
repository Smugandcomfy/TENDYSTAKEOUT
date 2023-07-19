import { useState } from "react";
import MainCard from "components/cards/MainCard";
import { Box, Grid, useMediaQuery, createTheme } from "@mui/material";
import { usePools } from "hooks/launchpad";
import Pool from "components/launchpad/Pool";
import { t } from "@lingui/macro";
import Toggle, { ToggleButton } from "components/SwitchToggle";
import { LAUNCHPAD_STATE } from "constants/launchpad";
import { getQueryPagination } from "utils/sdk/index";
import { Pagination, PaginationType, NoData, StaticLoading, Wrapper } from "components/index";
import { Property } from "types/launchpad";

const customizeTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 820,
      md: 1220,
      lg: 1400,
      xl: 1920,
    },
  },
});

const ToggleButtons = [
  {
    key: LAUNCHPAD_STATE.ONGOING,
    value: t`Latest`,
  },
  {
    key: LAUNCHPAD_STATE.FINISHED,
    value: t`Finished`,
  },
];

export default function Pools() {
  const matchDownLG = useMediaQuery(customizeTheme.breakpoints.down("lg")); // 3 columns
  const matchDownMD = useMediaQuery(customizeTheme.breakpoints.down("md")); // 2 columns
  const matchDownSM = useMediaQuery(customizeTheme.breakpoints.down("sm")); // 1 columns

  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const [displayStatus, setDisplayStatus] = useState("processing");
  const [displayFinished, setDisplayFinished] = useState(false);

  const DefaultPagination = {
    pageNum: 1,
    pageSize: 8,
  };

  const [pagination, setPagination] = useState(DefaultPagination);

  const handleToggleChange = (activeButton: ToggleButton) => {
    if (activeButton.key === LAUNCHPAD_STATE.ONGOING) {
      setDisplayStatus("processing");
      setDisplayFinished(false);
    } else {
      setDisplayStatus(LAUNCHPAD_STATE.FINISHED);
      setDisplayFinished(true);
    }
    setPagination(DefaultPagination);
  };

  const onPageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  const [offset] = getQueryPagination(pagination.pageNum, pagination.pageSize);

  const { result, loading } = usePools(displayStatus, offset, pagination.pageSize, refreshTrigger);
  const { totalElements, content: list } = result ?? { totalElements: 0, content: [] as Property[] };

  let data: { [key: string]: Property[] } = {};
  let columns = 4;

  for (let i = 0; i < list.length; i++) {
    // 4 columns
    if (!matchDownLG) {
      const index = i % 3;
      if (!data[index]) data[index] = [];
      data[index].push(list[i]);
      columns = 4;
    } else {
      if (matchDownSM) {
        if (!data[0]) data[0] = [];
        data[0].push(list[i]);
        columns = 12;
      } else if (matchDownMD) {
        const index = i % 2;
        if (!data[index]) data[index] = [];
        data[index].push(list[i]);
        columns = 6;
      } else {
        const index = i % 3;
        if (!data[index]) data[index] = [];
        data[index].push(list[i]);
        columns = 4;
      }
    }
  }

  const handleToggleTrigger = () => {
    setRefreshTrigger(!refreshTrigger);
  };

  return (
    <Wrapper>
      <MainCard>
        <Grid mb={3}>
          <Toggle buttons={ToggleButtons} onChange={handleToggleChange} />
        </Grid>
        {!Object.keys(data).length && !loading ? (
          <Grid
            sx={{
              height: "300px",
            }}
            container
            alignItems="center"
          >
            <NoData />
          </Grid>
        ) : null}
        {!!Object.keys(data).length || loading ? (
          <Box sx={{ position: "relative", minHeight: "300px" }}>
            {!!Object.keys(data).length ? (
              <Grid container spacing={2}>
                {Object.keys(data).map((key: string, index: number) => {
                  return (
                    <Grid item xs={columns} key={index}>
                      <Grid container spacing={2} flexDirection="column">
                        {data[key].map((pool) => (
                          <Grid item xs key={pool.cid}>
                            <Pool pool={pool} displayFinished={displayFinished} refreshList={handleToggleTrigger} />
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
            ) : null}
            {loading ? (
              <Grid
                sx={{
                  width: "100%",
                  minHeight: "300px",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
                container
                alignItems="center"
              >
                <StaticLoading loading={loading} mask />
              </Grid>
            ) : null}
          </Box>
        ) : null}
        {Number(totalElements ?? 0) > 0 ? (
          <Pagination count={Number(totalElements)} onPageChange={onPageChange} defaultPageSize={pagination.pageSize} />
        ) : null}
      </MainCard>
    </Wrapper>
  );
}
