import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Box } from "@mui/material";
import { t } from "@lingui/macro";
import { ToggleButton } from "components/SwitchToggle";
import { Wrapper } from "components/index";
import useParsedQueryString from "hooks/useParsedQueryString";
import { Breadcrumbs } from "components/index";
import MintBTC from "./components/ck/Mint";
import DissolveBTC from "./components/ck/Dissolve";
import { useBTCCurrentBlock } from "hooks/useBTCCalls";

export const Buttons = [
  {
    key: "mint",
    value: t`Mint`,
  },
  {
    key: "dissolve",
    value: t`Dissolve`,
  },
];

export default function ckBTC() {
  const history = useHistory();

  const [active, setActive] = useState("");

  const { type } = useParsedQueryString() as { type: string };

  useEffect(() => {
    if (type) setActive(type);
  }, [type]);

  const handleChange = (button: ToggleButton) => {
    setActive(button.key);
    history.push(`/wallet/ckBTC?type=${button.key}`);
  };

  const block = useBTCCurrentBlock();

  return (
    <Wrapper>
      <Breadcrumbs
        prevLink="/wallet/token"
        prevLabel={t`Wallet`}
        currentLabel={type === "dissolve" ? t`Dissolve BTC` : t`Mint BTC`}
      ></Breadcrumbs>
      <Box sx={{ height: "20px" }}></Box>

      {type === "dissolve" ? (
        <DissolveBTC handleChange={handleChange} buttons={Buttons} active={active}></DissolveBTC>
      ) : (
        <MintBTC handleChange={handleChange} buttons={Buttons} active={active} block={block}></MintBTC>
      )}
    </Wrapper>
  );
}
