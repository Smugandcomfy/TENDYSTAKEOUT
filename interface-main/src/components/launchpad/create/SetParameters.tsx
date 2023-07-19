import React, { useState } from "react";
import {
  Grid,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Input,
  CircularProgress,
  Button,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "components/TextField";
import NumberFormat from "components/number-format";
import { Trans, t } from "@lingui/macro";
import { useValuesManager, useGoNextStep } from "store/launchpad/hooks";
import FilledTextField from "components/FilledTextField";
import { usePoolStateInfo } from "hooks/launchpad/index";
import XLSX from "xlsx";
import { isValidAddress, parseTokenAmount } from "utils/sdk/index";
import { timeParser } from "utils/launchpad/index";
import AuthButton from "components/authentication/ButtonConnector";
import dayjs from "dayjs";
import { TOKEN_STANDARD } from "constants/tokens";
import { useTokens } from "hooks/launchpad/useToken";

const TOKEN_STANDARDS_MENU = [
  // { label: TOKEN_STANDARD.DIP20, value: TOKEN_STANDARD.DIP20 },
  // { label: TOKEN_STANDARD.EXT, value: TOKEN_STANDARD.EXT },
  { label: TOKEN_STANDARD.ICRC1, value: TOKEN_STANDARD.ICRC1 },
  // { label: TOKEN_STANDARD.ICRC2, value: TOKEN_STANDARD.ICRC2 },
  // { label: TOKEN_STANDARD.ICP, value: TOKEN_STANDARD.ICP },
];

export default function SetParameters() {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));

  const [values, onFiledChange] = useValuesManager();
  const toNextStep = useGoNextStep();

  const { depositTokenInfo, soldTokenInfo } = useTokens();

  const { depositQuantity, errorMessage } = usePoolStateInfo();
  const [importLoading, setImportLoading] = useState(false);

  const handleNextStep = () => {
    toNextStep();
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    setImportLoading(true);

    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (e: any) => {
      const data = e.target.result;

      const xlsx = XLSX.read(data, {
        type: "binary",
      });

      let validAccounts: string[] = [];
      let invalidAccounts: string[] = [];

      for (let i = 0; i < xlsx.SheetNames.length; i++) {
        const sheetData = XLSX.utils.sheet_to_json<{ [key: string]: string }>(xlsx.Sheets[xlsx.SheetNames[i]]);

        sheetData.forEach((row) => {
          const accounts = Object.values(row);
          const keys = Object.keys(row);

          accounts.forEach((account) => {
            if (isValidAddress(account) && !validAccounts.includes(account)) {
              validAccounts.push(account);
            } else {
              if (!invalidAccounts.includes(account) && !validAccounts.includes(account)) {
                invalidAccounts.push(account);
              }
            }
          });

          // push the first row to accounts
          keys.forEach((key) => {
            if (isValidAddress(key) && !validAccounts.includes(key)) {
              validAccounts.push(key);
            } else {
              if (!invalidAccounts.includes(key) && !validAccounts.includes(key)) {
                invalidAccounts.push(key);
              }
            }
          });
        });
      }

      onFiledChange(validAccounts, "whitelist");
      onFiledChange(invalidAccounts, "invalidAccounts");

      setImportLoading(false);

      // reset input value
      event.target.value = null;
    };
  };

  return (
    <Box pb={5}>
      <Grid>
        <Typography color="text.primary">Launchpad Name</Typography>
        <Box mt={2}>
          <TextField
            fullWidth
            placeholder={t`Enter the launchpad name`}
            inputProps={{
              maxLength: 100,
            }}
            value={values.name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => onFiledChange(event.target.value, "name")}
          />
        </Box>
      </Grid>
      <Grid mt={2}>
        <Typography color="text.primary">Launchpad Description</Typography>
        <Box mt={2}>
          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder={t`Enter the launchpad description`}
            inputProps={{
              maxLength: 500,
            }}
            value={values.description}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => onFiledChange(event.target.value, "description")}
          />
        </Box>
      </Grid>
      <Grid mt={2}>
        <Typography color="text.primary">Start/End Time</Typography>
        <Box mt={2}>
          <Grid container justifyContent="space-between">
            <Grid
              item
              sx={{
                width: "48%",
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  renderInput={(params: any) => (
                    <TextField
                      fullWidth
                      {...params}
                      InputProps={{
                        ...(params?.InputProps ?? {}),
                        disableUnderline: true,
                      }}
                      helperText=""
                    />
                  )}
                  value={values.startDateTime ? dayjs(values.startDateTime) : null}
                  onChange={(newValue: any) => {
                    onFiledChange(timeParser(new Date(newValue.toDate()).getTime()).getTime(), "startDateTime");
                  }}
                  minDateTime={dayjs(new Date())}
                  maxDateTime={values.endDateTime ? dayjs(new Date(values.endDateTime)) : undefined}
                />
              </LocalizationProvider>
            </Grid>
            <Grid
              item
              sx={{
                width: "48%",
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  renderInput={(params: any) => (
                    <TextField
                      fullWidth
                      {...params}
                      InputProps={{
                        ...(params?.InputProps ?? {}),
                        disableUnderline: true,
                      }}
                      helperText=""
                    />
                  )}
                  value={values.endDateTime}
                  onChange={(newValue: any) => {
                    onFiledChange(timeParser(newValue), "endDateTime");
                  }}
                  minDateTime={values.startDateTime ? dayjs(new Date(values.startDateTime)) : dayjs(new Date())}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Box>
      </Grid>

      <Grid mt={2}>
        <Typography color="text.primary">Deposit Token</Typography>
        <Box mt={2}>
          <TextField
            fullWidth
            value={values.depositTokenId}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onFiledChange(event.target.value, "depositTokenId")
            }
          />
        </Box>
      </Grid>

      <Grid mt={2}>
        <Typography color="text.primary">Deposit Token Standard</Typography>
        <Box mt={2}>
          <FilledTextField
            select
            contained={false}
            placeholder={t`Please select the deposit token standard`}
            required
            value={values.depositTokenStandard}
            onChange={(value) => onFiledChange(value, "depositTokenStandard")}
            menus={TOKEN_STANDARDS_MENU}
          />
        </Box>
      </Grid>

      <Grid mt={2}>
        <Typography color="text.primary">Sale Token</Typography>
        <Box mt={2}>
          <TextField
            fullWidth
            value={values.soldTokenId}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => onFiledChange(event.target.value, "soldTokenId")}
          />
        </Box>
      </Grid>

      <Grid mt={2}>
        <Typography color="text.primary">Sale Token Standard</Typography>
        <Box mt={2}>
          <FilledTextField
            select
            contained={false}
            placeholder={t`Please select the sale token standard`}
            required
            value={values.soleTokenStandard}
            onChange={(value) => onFiledChange(value, "soleTokenStandard")}
            menus={TOKEN_STANDARDS_MENU}
          />
        </Box>
      </Grid>

      <Grid mt={2}>
        <Typography color="text.primary">Exchange Ratio</Typography>
        <Box mt={2}>
          <TextField
            variant="standard"
            InputProps={{
              endAdornment: <InputAdornment position="end">{depositTokenInfo?.symbol}</InputAdornment>,
              inputComponent: NumberFormat,
              disableUnderline: true,
              inputProps: {
                thousandSeparator: true,
                allowNegative: false,
                maxLength: 20,
                decimalScale: 8,
              },
            }}
            value={values.initialExchangeRatio}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onFiledChange(event.target.value, "initialExchangeRatio")
            }
            fullWidth
            placeholder={t`Price per ${soldTokenInfo ? soldTokenInfo.symbol : "your token"}`}
          />
        </Box>
        <Grid container justifyContent="flex-end" mt={1}>
          {!!soldTokenInfo?.symbol && values.initialExchangeRatio ? (
            <Grid item xs>
              <Typography component="span" fontSize={12}>
                1 {soldTokenInfo?.symbol} = {values.initialExchangeRatio} {depositTokenInfo?.symbol}
              </Typography>
            </Grid>
          ) : null}
        </Grid>
      </Grid>

      <Grid mt={2}>
        <Typography color="text.primary">
          <Trans>Sale Amount</Trans>
        </Typography>
        <Box mt={2}>
          <TextField
            variant="standard"
            InputProps={{
              inputComponent: NumberFormat,
              disableUnderline: true,
              inputProps: {
                thousandSeparator: true,
                allowNegative: false,
                maxLength: 20,
                decimalScale: 8,
              },
            }}
            value={values.expectedSellQuantity}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onFiledChange(event.target.value, "expectedSellQuantity")
            }
            fullWidth
            placeholder={t`The amount of token you want to sale`}
          />

          <Grid container justifyContent="flex-end" mt={1}>
            {(!!soldTokenInfo?.transFee || String(soldTokenInfo?.transFee) === "0") && !!values.expectedSellQuantity ? (
              <Grid item xs>
                <Typography fontSize={12} align="right">
                  <Trans>
                    Transfer Fee:{" "}
                    {parseTokenAmount(String(soldTokenInfo?.transFee), soldTokenInfo?.decimals)
                      .multipliedBy(50)
                      .toFormat()}{" "}
                    {soldTokenInfo?.symbol}
                  </Trans>
                </Typography>
              </Grid>
            ) : null}
          </Grid>
        </Box>
      </Grid>

      <Grid mt={2}>
        <Typography color="text.primary">
          <Trans>Funds To Raise</Trans>
        </Typography>
        <Box mt={2}>
          <TextField
            fullWidth
            disabled
            value={depositQuantity}
            InputProps={{
              disableUnderline: true,
              endAdornment: <InputAdornment position="end">{depositTokenInfo?.symbol}</InputAdornment>,
            }}
          />
        </Box>
      </Grid>

      <Grid mt={2}>
        <Typography color="text.primary">
          <Trans>Number of containers created</Trans>
        </Typography>
        <Box mt={2}>
          <TextField
            variant="standard"
            InputProps={{
              inputComponent: NumberFormat,
              disableUnderline: true,
              inputProps: {
                thousandSeparator: true,
                allowNegative: false,
                maxLength: 20,
                decimalScale: 0,
              },
            }}
            value={values.canisterQuantity}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onFiledChange(event.target.value, "canisterQuantity")
            }
            fullWidth
            placeholder={t`The amount of launchpad canister you want to create`}
          />
        </Box>
      </Grid>

      <Grid mt={4}>
        <Grid container justifyContent="space-between">
          <Grid item sx={{ width: matchDownMD ? "100%" : "48%" }}>
            <Box>
              <label htmlFor="contained-button-file">
                <Input
                  id="contained-button-file"
                  type="file"
                  inputProps={{
                    accept: ".xlsx, .xls",
                  }}
                  sx={{
                    display: "none",
                  }}
                  onChange={handleFileChange}
                />
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  size="large"
                  startIcon={importLoading ? <CircularProgress size={24} color="inherit" /> : null}
                >
                  <Trans>Import Whitelist</Trans>
                </Button>
              </label>
            </Box>

            {!!values.whitelist?.length || !!values.invalidAccounts?.length ? (
              <Box
                mt={1}
                sx={{
                  textAlign: "right",
                }}
              >
                <Typography component="span" fontSize="12px">
                  {values.whitelist?.length} valid accounts
                </Typography>
                {!!values.invalidAccounts?.length ? (
                  <Typography
                    component="span"
                    fontSize="12px"
                    sx={{
                      marginLeft: "5px",
                    }}
                  >
                    {values.invalidAccounts.length} invalid accounts
                  </Typography>
                ) : null}
              </Box>
            ) : null}
          </Grid>
          <Grid item sx={{ width: matchDownMD ? "100%" : "48%", marginTop: matchDownMD ? "20px" : 0 }}>
            <AuthButton variant="contained" fullWidth onClick={handleNextStep} disabled={!!errorMessage} size="large">
              {errorMessage ? errorMessage : <Trans>Next Step</Trans>}
            </AuthButton>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
