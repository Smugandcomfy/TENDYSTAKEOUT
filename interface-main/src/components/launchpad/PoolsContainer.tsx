import { ReactNode } from "react";
import { Box } from "@mui/material";
import { t } from "@lingui/macro";
import Toggle from "components/SwitchToggle";
import { Wrapper, MainCard } from "components/index";

export default function PoolsContainer({ children }: { children: ReactNode }) {
  const ToggleButton = [
    {
      key: "create",
      value: t`Create`,
      path: "/console/launchpad/create",
    },
    {
      key: "your",
      value: t`Your Launchpad`,
      path: "/console/launchpad/your",
    },
  ];

  return (
    <Wrapper>
      <MainCard>
        <Toggle buttons={ToggleButton} />
        <Box mt={5}>{children}</Box>
      </MainCard>
    </Wrapper>
  );
}
