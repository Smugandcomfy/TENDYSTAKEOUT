import { Box, Button, CircularProgress, Typography } from "@mui/material";
import Logo from "./Logo";
import { Trans, t } from "@lingui/macro";
import { useBTCWithdrawAddress, useRetrieveBTCCallback, useFetchUserTxStates } from "hooks/useBTCCalls";
import { useAccountPrincipalString } from "store/auth/hooks";
import { ckBTC_ID } from "constants/ckBTC";
import { useState } from "react";
import { tokenTransfer } from "hooks/token/useTokenTransfer";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import FilledTextField from "components/FilledTextField";
import NumberFormat from "components/number-format";
import { useTokenInfo } from "hooks/token/index";
import { parseTokenAmount, formatTokenAmount, numberToString, ResultStatus, BigNumber } from "utils/sdk/index";
import Identity, { CallbackProps } from "components/Identity";
import { ActorIdentity } from "types/global";
import { validate } from "bitcoin-address-validation";
import { MessageTypes, useTips } from "hooks/useTips";
import Links from "./Links";
import { MainCard } from "components/index";
import Toggle, { ToggleButton } from "components/SwitchToggle";
import { useUpdateUserTx } from "store/wallet/hooks";
import DissolveRecords from "./DissolveRecords";

export default function DissolveBTC({
  buttons,
  handleChange,
  active,
}: {
  buttons: { key: string; value: string }[];
  handleChange: (button: ToggleButton) => void;
  active: string;
}) {
  const principal = useAccountPrincipalString();

  const [reload, setReload] = useState(false);
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);

  const [loading, setLoading] = useState(false);

  const { result: ckBTCBalance, loading: balanceLoading } = useTokenBalance(ckBTC_ID, principal, reload);
  const { result: token } = useTokenInfo(ckBTC_ID);

  const retrieve = useRetrieveBTCCallback();
  const updateUserTx = useUpdateUserTx();

  useFetchUserTxStates();

  const [openTip] = useTips();

  const { result: btc_withdraw_address } = useBTCWithdrawAddress();

  const handleSubmit = async (identity: ActorIdentity) => {
    if (!amount || !principal || !token || !address || !btc_withdraw_address) return;

    const _amount = formatTokenAmount(amount, token.decimals);

    setLoading(true);

    const { status, message } = await tokenTransfer({
      canisterId: ckBTC_ID,
      to: btc_withdraw_address.owner.toString(),
      amount: _amount,
      identity,
      from: principal,
      subaccount: btc_withdraw_address.subaccount[0] ? [...btc_withdraw_address.subaccount[0]] : undefined,
    });

    if (status === ResultStatus.ERROR) {
      openTip(message ?? t`Failed to dissolve`, MessageTypes.error);
      setLoading(false);
      return;
    }

    const { status: status1, message: message1, data } = await retrieve(address, BigInt(numberToString(_amount)));

    if (status1 === ResultStatus.ERROR) {
      openTip(message1 ?? t`Failed to dissolve`, MessageTypes.error);
    } else {
      openTip("Dissolve successfully", MessageTypes.success);
      if (data?.block_index) {
        updateUserTx(principal, data.block_index, undefined, numberToString(_amount));
      }
      setReload(!reload);
      setAmount(undefined);
      setAddress(undefined);
    }

    setLoading(false);
  };

  const handleMax = () => {
    if (!token) return;
    setAmount(
      parseTokenAmount(ckBTCBalance, token?.decimals)
        .minus(parseTokenAmount(token.transFee, token.decimals))
        .toFixed(token.decimals - 1)
    );
  };

  let error = "";
  if (address && !validate(address)) error = t`Invalid bitcoin address`;
  if (!amount) error = t`Enter the amount`;
  if (amount && !new BigNumber(amount).isGreaterThan(0.001)) error = t`Min amount is 0.001 ckBTC`;
  if (!address) error = t`Enter the address`;

  return (
    <>
      <MainCard>
        <Toggle buttons={buttons} onChange={handleChange} active={active} />
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "20px 0 0 0" }}>
          <Logo type="dissolve"></Logo>

          <Box
            sx={{
              margin: "20px 0 0 0",
              display: "flex",
              gap: "0 10px",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography color="#fff">
                <Trans>Balance:</Trans>
                &nbsp;{parseTokenAmount(ckBTCBalance, token?.decimals).toFormat()} ckBTC
              </Typography>
              {/* <Typography color="#fff" sx={{ margin: "10px 0 0 0" }}>
                <Trans>Dissolving:</Trans>&nbsp;0 ckBTC
              </Typography> */}
            </Box>

            <Button variant="outlined" size="small" disabled={balanceLoading} onClick={() => setReload(!reload)}>
              <Trans>Update</Trans>
            </Button>
          </Box>

          <Box sx={{ margin: "40px 0 0 0", width: "100%", maxWidth: "474px" }}>
            <Typography color="#fff">
              <Trans>Transfer ckBTC to retrieving account:</Trans>
            </Typography>

            <Typography sx={{ margin: "10px 0 0 0" }}>
              <Typography component="span" color="#D3625B">
                *
              </Typography>
              <Trans>Address:</Trans>
            </Typography>

            <Box sx={{ margin: "15px 0 0 0" }}>
              <FilledTextField
                value={address}
                onChange={(value) => setAddress(value)}
                inputProps={{
                  maxLength: 255,
                }}
              ></FilledTextField>
            </Box>

            <Typography sx={{ margin: "10px 0 0 0" }}>
              <Typography component="span" color="#D3625B">
                *
              </Typography>
              <Trans>Amount: (includes bitcoin network fees)</Trans>
            </Typography>

            <Box sx={{ margin: "15px 0 0 0" }}>
              <FilledTextField
                value={amount}
                onChange={(value) => setAmount(value)}
                InputProps={{
                  inputComponent: NumberFormat,
                  inputProps: {
                    allowNegative: false,
                    decimalScale: 8,
                    maxLength: 26,
                  },
                }}
              ></FilledTextField>

              <Box sx={{ margin: "5px 0 0 0", display: "flex", justifyContent: "space-between" }}>
                <Typography component="div">
                  <Typography>
                    <Trans>Dissolve Fee: 0.0000001ckBTC</Trans>
                  </Typography>
                  <Typography>
                    <Trans>(Excludes Bitcoin Network Tx fees)</Trans>
                  </Typography>
                </Typography>
                <Typography color="secondary" sx={{ cursor: "pointer" }} onClick={handleMax}>
                  <Trans>Max</Trans>
                </Typography>
              </Box>

              <Box sx={{ width: "100%", margin: "20px 0 0 0" }}>
                <Identity onSubmit={handleSubmit}>
                  {({ submit }: CallbackProps) => (
                    <Button variant="contained" fullWidth size="large" onClick={submit} disabled={!!error || loading}>
                      {loading ? (
                        <CircularProgress color="inherit" size={22} sx={{ margin: "0 5px 0 0" }}></CircularProgress>
                      ) : null}
                      {error ? error : <Trans>Transfer ckBTC</Trans>}
                    </Button>
                  )}
                </Identity>
              </Box>
            </Box>
          </Box>

          <Links></Links>
        </Box>
      </MainCard>

      <Box sx={{ margin: "20px 0 0 0" }}>
        <DissolveRecords></DissolveRecords>
      </Box>
    </>
  );
}
