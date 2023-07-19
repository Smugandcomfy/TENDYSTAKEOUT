import { useMemo, useState, useEffect, memo, ReactNode } from "react";
import { Typography, Grid, Box, Avatar, Link } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import { Trans, t } from "@lingui/macro";
import { useTokenInfo } from "hooks/token/index";
import dayjs from "dayjs";
import { isDarkTheme, getExplorerPrincipalLink } from "utils";
import { useAccount } from "store/global/hooks";
import {
  useUserStakingDetails,
  useLaunchpadQuantity,
  claimTokens,
  usePoolDetail,
  usePoolRaiseTokenAmount,
  usePoolFundsValue,
  usePoolWhitelistSize,
  useIsInWhitelist,
} from "hooks/launchpad/index";
import { useLaunchpadTicket } from "hooks/launchpad/ticket";
import { useFullscreenLoading, useErrorTip, useSuccessTip } from "hooks/useTips";
import { LaunchpadLocales } from "locales/services";
import { getLaunchpadState, parseExchangeRatio } from "utils/launchpad/index";
import { LAUNCHPAD_STATE } from "constants/launchpad";
import isBoolean from "lodash/isBoolean";
import StakingModal from "components/launchpad/Staking";
import WhitelistLabel from "assets/images/launchpad/WhitelistLabel";
import { toSignificant, nanosecond2Millisecond, parseTokenAmount, BigNumber } from "utils/sdk/index";
import Identity, { CallbackProps } from "components/Identity";
import { Property } from "types/launchpad";
import { TokenInfo } from "types/token";
import { ActorIdentity } from "types/global";
import { Theme } from "@mui/material/styles";
import Button from "components/authentication/ButtonConnector";
import { isElement } from "react-is";

const useStyles = makeStyles((theme: Theme) => {
  const isDark = isDarkTheme(theme);

  return {
    poolInfoContainer: {
      position: "relative",
      background: isDark ? theme.palette.background.level1 : "rgba(36, 19, 103, 0.86)",
      borderRadius: "4px 4px 0 0",
    },
    poolInfo: {
      position: "relative",
      minHeight: "210px",
      borderRadius: "4px 4px 0 0",
      overflow: "hidden",
      "&.upcoming": {
        background: "rgba(45, 148, 243, 0.34)",
        "& .colorBlock": {
          background: "rgba(10, 96, 158, 0.31)",
          filter: "blur(54px)",
        },
      },
      "&.ongoing": {
        background: "rgba(101, 80, 186, 0.18)",
        "& .colorBlock": {
          background: "rgba(53, 6, 89, 0.5)",
          filter: "blur(54px)",
        },
      },
      "&.finished": {
        background: theme.palette.background.level1,
        "& .colorBlock": {
          background: "rgba(0, 55, 95, 0.31)",
          filter: "blur(54px)",
        },
      },
      "& .colorBlock": {
        width: "154px",
        height: "124px",
        marginTop: "-124px",
        zIndex: 0,
      },
    },
    whitelistLabel: {
      position: "absolute",
      top: 0,
      right: 0,
    },
    status: {
      width: "77px",
      height: "30px",
      borderTopLeftRadius: "4px",
      borderBottomRightRadius: "4px",
      "&.finished": {
        background: "rgba(255, 255, 255, 0.1)",
        color: theme.palette.text.secondary,
      },
      "&.ongoing": {
        background: "#654DA9",
        color: "#fff",
        border: "1px solid #6E55B4",
      },
      "&.upcoming": {
        background: "#2D94F3",
        color: "#fff",
        border: "1px solid #3C9FFA",
      },
    },
    id: {
      padding: "0 8px",
      height: "30px",
      backgroundColor: theme.colors.secondaryMain,
      color: theme.palette.text.primary,
      borderRadius: "4px",
    },
    staking: {
      background: theme.palette.background.level1,
      padding: "20px 24px",
      borderRadius: "0 0 4px 4px",
    },
    pendingBar: {
      background: "#212946",
      borderRadius: "2px",
      height: "4px",
      "& .percentage": {
        height: "100%",
        borderRadius: "2px",
        transition: "all 300ms",
        "&.ongoing": {
          background: "linear-gradient(90deg, rgba(134, 114, 255, 0.08) -0.41%, #8572FF 100.41%)",
        },
        "&.upcoming": {
          background: "#5669DC",
        },
      },
    },
    inputBox: {
      background: "#212946",
      borderRadius: "8px",
      padding: "5px 16px",
      border: "1px solid #29314F",
      height: "44px",
    },
    poolDetail: {
      borderTop: `1px solid ${isDark ? "#313A5A" : "#E0E0E0"}`,
      marginTop: "20px",
    },
    description: {
      lineHeight: "24px",
      wordBreak: "break-word",
      cursor: "pointer",
      "&.hidden": {
        ...theme.mixins.overflowEllipsis2,
      },
    },
  };
});

function toDouble(string: number | string) {
  const newString = String(string);

  if (newString.length < 2) {
    return `0${newString}`;
  }

  return string;
}

type CountingTime = {
  hour: string | number;
  min: string | number;
  sec: string | number;
};

function countTime(time: string | number | Date): CountingTime {
  const now = new Date().getTime();
  const end = new Date(time).getTime();

  const diff = end - now;

  if (diff <= 0) {
    return {
      hour: "00",
      min: "00",
      sec: "00",
    };
  }

  const sec = parseInt(String((diff / 1000) % 60));
  const min = parseInt(String((diff / (60 * 1000)) % 60));
  const hour = parseInt(String(diff / (60 * 60 * 1000)));

  return {
    hour: toDouble(hour),
    min: toDouble(min),
    sec: toDouble(sec),
  };
}

export function PoolDetailItem({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <Grid container>
      <Grid item xs>
        <Typography>{label}</Typography>
      </Grid>
      <Grid item>{isElement(value) ? value : <Typography color="text.primary">{value}</Typography>}</Grid>
    </Grid>
  );
}

export function timeFormatter(time: bigint | string | number | undefined, format?: string) {
  return time ? dayjs(nanosecond2Millisecond(time)).format(format ?? "YYYY-MM-DD HH:mm") : "--";
}

export const Counter = memo(
  ({ pool, isOngoing, isFinished }: { pool: Property; isOngoing: boolean; isFinished: boolean }) => {
    const [count, setCount] = useState<CountingTime | null>(null);

    useEffect(() => {
      let timer: number | undefined = undefined;

      if (!isFinished) {
        let endTime = nanosecond2Millisecond(isOngoing ? pool.endDateTime : pool.startDateTime);

        timer = window.setInterval(() => {
          setCount(countTime(endTime));
        }, 1000);
      }

      return () => {
        clearInterval(timer);
        timer = undefined;
      };
    }, [pool, isFinished, isOngoing]);

    return (
      <Typography fontSize="12px" align="center">
        <Trans>
          <Typography fontSize="12px" color="secondary" component="span">
            {count?.hour && count?.hour !== "00" ? `${count.hour}h ` : ""}
            {count?.min ?? "00"}m {count?.sec ?? "00"}s
          </Typography>{" "}
          left for {isOngoing ? "ending" : "starting"}
        </Trans>
      </Typography>
    );
  }
);

export function PoolInfo({ pool, whitelistSize }: { pool: Property; whitelistSize: null | undefined | bigint }) {
  const classes = useStyles();

  const [descHidden, setDescHidden] = useState(true);
  const { statusText, statusClassName } = getLaunchpadState(pool);

  const { result: tokenInfo } = useTokenInfo(pool.soldTokenId);

  const handleToggleDescription = () => {
    setDescHidden(!descHidden);
  };

  return (
    <Box className={`${classes.poolInfoContainer} ${statusClassName}`}>
      <Box className={`${classes.poolInfo} ${statusClassName}`}>
        <Grid container>
          <Grid item xs>
            <Grid
              container
              className={`${classes.status} ${statusClassName}`}
              alignItems="center"
              justifyContent="center"
            >
              {statusText}
            </Grid>
          </Grid>
        </Grid>
        <Grid container flexDirection="column" alignItems="center">
          <Avatar src={tokenInfo?.logo} sx={{ width: "60px", height: "60px" }}>
            &nbsp;
          </Avatar>
          <Typography color="text.primary" variant="h3" sx={{ marginTop: "14px", padding: "0 10px" }}>
            {pool.name}
          </Typography>
        </Grid>
        <Box p="0 24px 10px 24px" mt={2} sx={{ position: "relative", zIndex: 10 }}>
          <Typography
            className={`${classes.description} ${descHidden ? "hidden" : ""}`}
            onClick={handleToggleDescription}
          >
            {pool.description}
          </Typography>
        </Box>
        <Box className={`colorBlock`} />
      </Box>
      {new BigNumber(String(whitelistSize ?? 0)).isGreaterThan(0) ? (
        <Box className={classes.whitelistLabel}>
          <WhitelistLabel />
          <Typography
            sx={{
              position: "absolute",
              top: "14px",
              left: "15px",
              fontSize: "12px",
              transform: "rotate(45deg) scale(0.8)",
            }}
          >
            Whitelist
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}

// function LinkIcon() {
//   return (
//     <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path
//         fillRule="evenodd"
//         clipRule="evenodd"
//         d="M6.43866 2.42969H1.1619V0.429688H8.85766H9.85766V1.42969V9.12545H7.85766V3.83911L1.94156 9.75521L0.527344 8.341L6.43866 2.42969Z"
//         fill="#8672FF"
//       />
//     </svg>
//   );
// }

export interface PoolDetailsProps {
  pool: Property;
  quantityScale: BigNumber;
  quantity: bigint | null | string | number | undefined;
  depositTokenInfo: undefined | TokenInfo;
  soldTokenInfo: undefined | TokenInfo;
  raiseAmount: BigNumber;
  totalFunds: string;
}

export function PoolDetails({
  pool,
  quantityScale,
  quantity,
  depositTokenInfo,
  soldTokenInfo,
  raiseAmount,
  totalFunds,
}: PoolDetailsProps) {
  const classes = useStyles();

  const [poolDetailShow, setPoolDetailShow] = useState(false);

  const handleShowPoolDetail = () => {
    setPoolDetailShow(!poolDetailShow);
  };

  return (
    <>
      <Box mt="18px" sx={{ textAlign: "center" }}>
        <Typography
          component="span"
          color="secondary.main"
          sx={{
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick={handleShowPoolDetail}
        >
          {poolDetailShow ? t`Hide` : t`Details`}
        </Typography>
      </Box>
      {poolDetailShow && (
        <Box className={classes.poolDetail}>
          <Box mt="20px">
            <PoolDetailItem
              label={t`Canister ID`}
              value={
                <Link href={getExplorerPrincipalLink(pool.cid)} target="_blank">
                  {pool.cid}
                </Link>
              }
            />
          </Box>
          <Box mt="20px">
            <PoolDetailItem label={t`Start Time`} value={timeFormatter(pool.startDateTime)} />
          </Box>
          <Box mt="20px">
            <PoolDetailItem label={t`End Time`} value={timeFormatter(pool.endDateTime)} />
          </Box>
          <Box mt="20px">
            <PoolDetailItem
              label={t`Tokens Offered`}
              value={
                <Typography color="text.primary">
                  {parseTokenAmount(pool.expectedSellQuantity, soldTokenInfo?.decimals).toFormat()}{" "}
                  <Link href={getExplorerPrincipalLink(pool.soldTokenId)} target="_blank">
                    {soldTokenInfo?.symbol}
                  </Link>
                </Typography>
              }
            />
          </Box>
          <Box mt="20px">
            <PoolDetailItem
              label={t`Sale Price`}
              value={`1 ${soldTokenInfo?.symbol} = ${parseExchangeRatio(pool.initialExchangeRatio).toFormat()} ${
                depositTokenInfo?.symbol
              }`}
            />
          </Box>

          <Box mt="20px">
            <PoolDetailItem
              label={t`To Raise`}
              value={
                <Typography color="text.primary">
                  {raiseAmount ? raiseAmount.toFormat(4) : "--"}{" "}
                  <Link href={getExplorerPrincipalLink(pool.pricingTokenId)} target="_blank">
                    {depositTokenInfo?.symbol}
                  </Link>
                </Typography>
              }
            />
          </Box>

          <Box mt="20px">
            <PoolDetailItem
              label={t`Total Deposited`}
              value={
                <Typography color="text.primary">
                  {new BigNumber(
                    toSignificant(parseTokenAmount(quantity ?? 0, depositTokenInfo?.decimals).toNumber() ?? 0, 6) ?? 0
                  ).toFormat()}{" "}
                  <Typography color="text.primary" fontSize="12px" component="span">
                    (
                    {quantityScale.isGreaterThan(100)
                      ? new BigNumber(quantityScale.toFixed(0)).toFormat()
                      : quantityScale.toFixed(2)}
                    %)
                  </Typography>
                </Typography>
              }
            />
          </Box>
        </Box>
      )}
    </>
  );
}

export interface PoolProps {
  pool: Property;
  displayFinished: boolean;
  refreshList: () => void;
}

export default function LaunchpadPool({ pool: _pool, displayFinished, refreshList }: PoolProps) {
  const classes = useStyles();
  const theme = useTheme() as Theme;
  const account = useAccount();

  const { result: depositTokenInfo } = useTokenInfo(_pool.pricingTokenId);

  const [openFullscreenLoading, closeFullscreenLoading] = useFullscreenLoading();
  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const { result: poolDetail } = usePoolDetail(_pool.cid, reloadTrigger);

  const [stakingModalShow, setStakingModalShow] = useState(false);

  const pool = useMemo(() => {
    if (poolDetail) return poolDetail;
    return _pool ?? {};
  }, [poolDetail, _pool]);

  const { status } = getLaunchpadState(pool);

  const isFinished = LAUNCHPAD_STATE.FINISHED === status;
  const isOngoing = LAUNCHPAD_STATE.ONGOING === status;
  const isUpcoming = LAUNCHPAD_STATE.UPCOMING === status;

  const launchpadCanisterId = useLaunchpadTicket(account, pool.cid);

  const { result: soldTokenInfo } = useTokenInfo(pool.soldTokenId);

  const { result: userStakingDetails, loading: stakingDetailsLoading } = useUserStakingDetails(
    launchpadCanisterId,
    account,
    reloadTrigger
  );

  const { result: quantity } = useLaunchpadQuantity(pool.cid, reloadTrigger);
  const { result: whitelistSize } = usePoolWhitelistSize(pool.cid);

  const { raiseAmount } = usePoolRaiseTokenAmount(pool);
  const totalFunds = usePoolFundsValue(raiseAmount);

  const userStakingTokenAmount = useMemo(() => {
    if (!userStakingDetails || !depositTokenInfo) return 0;

    return parseTokenAmount(
      userStakingDetails.expectedDepositedPricingTokenQuantity,
      depositTokenInfo.decimals
    ).toNumber();
  }, [userStakingDetails, depositTokenInfo]);

  const userStakingPercent = useMemo(() => {
    if (!userStakingTokenAmount || !quantity || stakingDetailsLoading || !depositTokenInfo) return "--";

    return `${new BigNumber(userStakingTokenAmount)
      .dividedBy(parseTokenAmount(quantity, depositTokenInfo.decimals))
      .multipliedBy(100)
      .toFixed(2)}%`;
  }, [userStakingTokenAmount, quantity, depositTokenInfo]);

  const quantityScale = useMemo(() => {
    if (!quantity || !raiseAmount || !depositTokenInfo) return new BigNumber(0);

    return parseTokenAmount(quantity, depositTokenInfo.decimals).dividedBy(raiseAmount).multipliedBy(100);
  }, [quantity, raiseAmount, depositTokenInfo]);

  useEffect(() => {
    // let timer0: number | undefined = undefined;
    let timer1: number | undefined = undefined;

    if (!isFinished) {
      let endTime = nanosecond2Millisecond(isOngoing ? pool.endDateTime : pool.startDateTime);

      // timer0 = window.setInterval(() => {
      //   if (new BigNumber(endTime).isGreaterThan(new Date().getTime())) {
      //     setReloadTrigger((prevState) => prevState + 1);
      //   }
      // }, 5000);

      timer1 = window.setInterval(() => {
        if (new BigNumber(endTime).isLessThan(new Date().getTime())) {
          refreshList();
        }
      }, 1000);
    }

    return () => {
      // clearInterval(timer0);
      clearInterval(timer1);
      // timer0 = undefined;
      timer1 = undefined;
    };
  }, [pool, setReloadTrigger, isFinished]);

  const isFirstTimeStaking = new BigNumber(
    !!userStakingDetails?.expectedBuyTokenQuantity ? userStakingDetails?.expectedBuyTokenQuantity : 0
  ).isEqualTo(0);

  const handleStakingSuccess = () => {
    setReloadTrigger(reloadTrigger + 1);
    setStakingModalShow(false);
  };

  const handleClaim = async (identity: ActorIdentity) => {
    openFullscreenLoading();

    const { status, data, message } = await claimTokens(identity, launchpadCanisterId);

    if (status === "ok" || isBoolean(data)) {
      openSuccessTip(t`Claimed successfully`);
      setReloadTrigger(reloadTrigger + 1);
    } else {
      openErrorTip(LaunchpadLocales[message] ?? t`Failed to claim`);
    }

    closeFullscreenLoading();
  };

  const hasClaimed = !!userStakingDetails?.withdrawalDateTime[0] && !!userStakingDetails?.withdrawalDateTime[0];
  const hasSettled = !!poolDetail?.settled && !!poolDetail?.settled[0] && poolDetail?.settled[0] === true;

  const userClaimAmount = parseTokenAmount(
    userStakingDetails?.finalTokenSet[0]?.token?.quantity ?? 0,
    soldTokenInfo?.decimals
  );

  const { result: isInWhitelistResult, loading: isInWhitelistLoading } = useIsInWhitelist(pool.cid, account);
  const isInWhitelist = isInWhitelistResult === true;

  return isFinished && !displayFinished ? null : (
    <>
      <PoolInfo pool={pool} whitelistSize={whitelistSize} />
      <Box className={classes.staking}>
        {!isFinished ? (
          <Grid container>
            <Grid item xs>
              <Typography>{<Trans>Start Time</Trans>}</Typography>
              <Typography
                color="text.primary"
                sx={{
                  fontSize: "18px",
                  marginTop: "15px",
                }}
              >
                {dayjs(nanosecond2Millisecond(pool.startDateTime)).format("MM-DD HH:mm")}
              </Typography>
            </Grid>
            <Grid item>
              <Typography align="right">
                <Trans>End Time</Trans>
              </Typography>
              <Typography
                color="text.primary"
                align="right"
                sx={{
                  fontSize: "18px",
                  marginTop: "15px",
                }}
              >
                {dayjs(nanosecond2Millisecond(pool.endDateTime)).format("MM-DD HH:mm")}
              </Typography>
            </Grid>
          </Grid>
        ) : null}
        {(isOngoing || isUpcoming) && (
          <Box mt="14px" className={classes.pendingBar}>
            <Box
              className={`percentage ${status}`}
              style={{
                width: `${quantityScale.isGreaterThan(100) ? "100" : quantityScale.toFixed(2)}%`,
              }}
            ></Box>
          </Box>
        )}
        {(isOngoing || isUpcoming) && (
          <Box mt="14px">
            {/* use _pool to avoid render Counter when refresh component by 5mins interval */}
            <Counter isOngoing={isOngoing} isFinished={isFinished} pool={_pool} />
          </Box>
        )}
        <Box mt={3}>
          <Box>
            <Grid container>
              <Typography fontSize="12px">
                <Trans>Deposit {depositTokenInfo?.symbol} Amount</Trans>
              </Typography>
              <Grid item xs>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 500,
                    [theme.breakpoints.down("sm")]: {
                      fontSize: "14px",
                    },
                  }}
                  color="text.primary"
                  align="right"
                >
                  {new BigNumber(userStakingTokenAmount).toFormat()}
                </Typography>
              </Grid>
            </Grid>
            <Grid container mt={2}>
              <Typography fontSize="12px">
                <Trans>Deposit Percentage</Trans>
              </Typography>
              <Grid item xs>
                <Typography color="text.primary" align="right">
                  {userStakingPercent}
                </Typography>
              </Grid>
            </Grid>
            {isFinished ? (
              <Grid container mt={2}>
                <Typography fontSize="12px">
                  <Trans>{soldTokenInfo?.symbol} Claim Amount</Trans>
                </Typography>
                <Grid item xs>
                  <Typography color="text.primary" align="right">
                    {userClaimAmount.toFormat()}
                  </Typography>
                </Grid>
              </Grid>
            ) : null}
          </Box>
          <Box mt="14px">
            <Box mt="26px">
              {status === LAUNCHPAD_STATE.FINISHED ? (
                hasClaimed ? (
                  <Button variant="contained" fullWidth size="large" disabled>
                    <Trans>You have claimed</Trans>
                  </Button>
                ) : (
                  <Identity onSubmit={handleClaim}>
                    {({ submit }: CallbackProps) => (
                      <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={submit}
                        disabled={userClaimAmount.isEqualTo(0) || !hasSettled}
                      >
                        {hasSettled ? <Trans>Claim</Trans> : <Trans>Waiting for settlement</Trans>}
                      </Button>
                    )}
                  </Identity>
                )
              ) : (
                <Button
                  size="large"
                  variant="contained"
                  fullWidth
                  disabled={status !== LAUNCHPAD_STATE.ONGOING || isInWhitelistLoading || !isInWhitelist}
                  onClick={() => {
                    setStakingModalShow(true);
                  }}
                >
                  {isInWhitelist ? <Trans>Deposit</Trans> : <Trans>You are not in whitelist</Trans>}
                </Button>
              )}
            </Box>
            <PoolDetails
              pool={pool}
              quantity={quantity}
              quantityScale={quantityScale}
              depositTokenInfo={depositTokenInfo}
              soldTokenInfo={soldTokenInfo}
              raiseAmount={raiseAmount}
              totalFunds={totalFunds}
            />
          </Box>
        </Box>
        {stakingModalShow ? (
          <StakingModal
            isFirstTimeStaking={isFirstTimeStaking}
            pool={pool}
            launchpadCanisterId={launchpadCanisterId}
            onStakingSuccess={handleStakingSuccess}
            open={stakingModalShow}
            onClose={() => setStakingModalShow(false)}
          />
        ) : null}
      </Box>
    </>
  );
}
