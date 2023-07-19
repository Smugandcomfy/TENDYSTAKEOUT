import { useState, useMemo, ReactNode } from "react";
import {
  Grid,
  Typography,
  useTheme,
  Table,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
  TableBody,
  Box,
  Link,
} from "@mui/material";
import { getExplorerPrincipalLink } from "utils";
import {
  parseTokenAmount,
  nanosecond2Millisecond,
  shortenAddress,
  BigNumber,
  ResultStatus,
  shorten,
  getQueryPagination,
  moErrMessageFormat,
} from "utils/sdk/index";
import { useAccount } from "store/global/hooks";
import { Trans, t } from "@lingui/macro";
import {
  useUserLaunchpadPools,
  withdrawRaisedTokens,
  useParticipantsSize,
  usePoolDetail,
  settle,
} from "hooks/launchpad/index";
import { useTokenInfo } from "hooks/token/index";
import { useFullscreenLoading, useSuccessTip, useErrorTip } from "hooks/useTips";
import PoolDetail from "components/launchpad/PoolDetail";
import { getLaunchpadState } from "utils/launchpad/index";
import { LAUNCHPAD_STATE_COLORS } from "constants/launchpad";
import WithdrawSucc from "components/launchpad/WithdrawSucc";
import { useLaunchpadQuantity } from "hooks/launchpad/index";
import { Pagination, PaginationType, NoData, ListLoading } from "components/index";
import dayjs from "dayjs";
import Identity, { CallbackProps, SubmitLoadingProps } from "components/Identity";
import { ActorIdentity } from "types/global";
import { Property, TokenSet } from "types/launchpad";
import { Theme } from "@mui/material/styles";
import { getLaunchpadMessage } from "locales/services";

export function TextButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  const theme = useTheme() as Theme;

  return (
    <Box
      component="span"
      onClick={onClick}
      sx={{
        color: theme.colors.secondaryMain,
        cursor: "pointer",
        "&:hover": {
          textDecoration: "underline",
        },
        "&+span": {
          marginLeft: "8px",
        },
      }}
    >
      {children}
    </Box>
  );
}

export interface PoolItemProps {
  pool: Property;
  onDetailClick: (pool: Property) => void;
  onSettleSuccess: () => void;
  onWithdrawSuccess: (data: TokenSet | undefined, pool: Property | null) => void;
}

export function PoolItem({ pool: _pool, onDetailClick, onSettleSuccess, onWithdrawSuccess }: PoolItemProps) {
  const { result: poolDetail } = usePoolDetail(_pool.cid);

  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();
  const [openFullscreenLoading, closeFullscreenLoading, loading] = useFullscreenLoading();

  const pool = useMemo(() => {
    if (poolDetail) return poolDetail;
    return _pool ?? {};
  }, [poolDetail, _pool]);

  const { result: soldTokenInfo } = useTokenInfo(pool.soldTokenId);
  const { result: depositTokenInfo } = useTokenInfo(_pool.pricingTokenId);

  const { status, statusText } = getLaunchpadState(pool);
  const { result: launchpadQuantity = 0 } = useLaunchpadQuantity(pool.cid);

  const raisedAmount = useMemo(() => {
    if (!pool || !launchpadQuantity || !depositTokenInfo) return new BigNumber(0);
    return parseTokenAmount(launchpadQuantity, depositTokenInfo.decimals);
  }, [launchpadQuantity, pool, depositTokenInfo]);

  const { result: participantsSize } = useParticipantsSize(pool.cid);

  const hasBeenWithdrawn = pool?.withdrawalDateTime && pool?.withdrawalDateTime.length;

  const hasBeenSettle = pool?.settled && pool?.settled[0] && pool?.settled[0] === true;

  const handleSettleClick = async (pool: Property) => {
    if (loading) return;
    openFullscreenLoading();
    const { status, message } = await settle(pool.cid);
    closeFullscreenLoading();

    if (status === "ok") {
      openSuccessTip(t`Settle Successfully`);
      if (onSettleSuccess) onSettleSuccess();
    } else {
      openErrorTip(getLaunchpadMessage(message) ?? t`Settle Failed`);
    }
  };

  const handleWithdraw = async (
    identity: ActorIdentity,
    pool: Property,
    { loading, closeLoading }: SubmitLoadingProps
  ) => {
    if (loading) return;

    try {
      const { status, data, message } = await withdrawRaisedTokens(identity, pool.cid);

      if (status === ResultStatus.OK) {
        openSuccessTip(t`Withdrew Successfully`);
        onWithdrawSuccess(data, pool);
      } else {
        openErrorTip(getLaunchpadMessage(message) ?? t`Failed to withdraw`);
      }
    } catch (err: any) {
      openErrorTip(getLaunchpadMessage(moErrMessageFormat(err)) ?? t`Failed to withdraw`);
    }

    closeLoading();
  };

  return (
    <TableRow>
      <TableCell>
        <Link href={getExplorerPrincipalLink(pool.cid)} target="_blank">
          {shortenAddress(pool.cid, 5)}
        </Link>
      </TableCell>
      <TableCell>
        <Typography>{shorten(pool.name, 20)}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{dayjs(nanosecond2Millisecond(pool.startDateTime)).format("YYYY-MM-DD HH:mm")}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{dayjs(nanosecond2Millisecond(pool.endDateTime)).format("YYYY-MM-DD HH:mm")}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{soldTokenInfo?.symbol}</Typography>
      </TableCell>
      <TableCell>
        <Typography color="text.primary">{`${parseTokenAmount(
          pool.expectedSellQuantity,
          soldTokenInfo?.decimals
        ).toFormat()} ${soldTokenInfo?.symbol}`}</Typography>
      </TableCell>
      <TableCell>
        <Grid>
          <Typography color="text.primary" align="right">
            {raisedAmount.toFormat(4)} {depositTokenInfo?.symbol}
          </Typography>
        </Grid>
      </TableCell>
      <TableCell>
        <Typography>{participantsSize ? new BigNumber(String(participantsSize)).toFormat() : 0}</Typography>
      </TableCell>
      <TableCell>
        <Grid container alignItems="center">
          <Typography
            sx={{
              color: LAUNCHPAD_STATE_COLORS[status],
              fontWeight: 600,
            }}
          >
            {statusText}
          </Typography>
        </Grid>
      </TableCell>
      <TableCell>
        <Grid>
          <TextButton onClick={() => onDetailClick(pool)}>
            <Trans>Details</Trans>
          </TextButton>

          {status === "finished" && !hasBeenWithdrawn && hasBeenSettle ? (
            <Identity
              onSubmit={async (identity, loading: SubmitLoadingProps) => {
                await handleWithdraw(identity, pool, loading);
              }}
              fullScreenLoading
            >
              {({ submit }: CallbackProps) => (
                <TextButton onClick={submit}>
                  <Trans>Withdraw</Trans>
                </TextButton>
              )}
            </Identity>
          ) : null}

          {status === "finished" && !hasBeenSettle ? (
            <TextButton onClick={() => handleSettleClick(pool)}>
              <Trans>Settle</Trans>
            </TextButton>
          ) : null}
        </Grid>
      </TableCell>
    </TableRow>
  );
}

export default function YourPoolList() {
  const account = useAccount();

  const [reloadTrigger, setReloadTrigger] = useState(false);
  const [poolDetailShow, setPoolDetailShow] = useState(false);
  const [withdrawData, setWithdrawData] = useState<null | undefined | TokenSet>(null);
  const [poolDetail, setPoolDetail] = useState({});
  const [actionPool, setActionPool] = useState<null | Property>(null);
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });

  const [offset] = getQueryPagination(pagination.pageNum, pagination.pageSize);
  const { result, loading } = useUserLaunchpadPools(account, offset, pagination.pageSize, reloadTrigger);
  const { totalElements, content: list } = result ?? { totalElements: 0, content: [] as Property[] };

  const handleSettleSuccess = () => {
    setReloadTrigger(!reloadTrigger);
  };

  const handleWithdrawSuccess = (data: TokenSet | undefined, pool: Property | null) => {
    setWithdrawData(data);
    setReloadTrigger(!reloadTrigger);
    setActionPool(pool);
  };

  const handleDetailClick = (pool: Property) => {
    setPoolDetail(pool);
    setPoolDetailShow(true);
  };

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  return (
    <TableContainer className={loading ? "with-loading" : ""}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Trans>Launchpad Canister ID</Trans>
            </TableCell>
            <TableCell>
              <Trans>Name</Trans>
            </TableCell>
            <TableCell>
              <Trans>Start Time</Trans>
            </TableCell>
            <TableCell>
              <Trans>End Time</Trans>
            </TableCell>
            <TableCell>
              <Trans>Sale Token</Trans>
            </TableCell>
            <TableCell>
              <Trans>Sale Amount</Trans>
            </TableCell>
            <TableCell align="right">
              <Trans>Raised Amount</Trans>
            </TableCell>
            <TableCell>
              <Trans>Address Count</Trans>
            </TableCell>
            <TableCell>
              <Trans>Status</Trans>
            </TableCell>
            <TableCell>
              <Trans>Action</Trans>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((pool) => (
            <PoolItem
              key={`${pool.id}-${String(reloadTrigger)}`}
              pool={pool}
              onDetailClick={handleDetailClick}
              onSettleSuccess={handleSettleSuccess}
              onWithdrawSuccess={handleWithdrawSuccess}
            />
          ))}
        </TableBody>
      </Table>

      {list.length === 0 && !loading ? <NoData /> : null}
      <ListLoading loading={loading} />
      {poolDetailShow && !!poolDetail && (
        <PoolDetail open={poolDetailShow} onClose={() => setPoolDetailShow(false)} pool={poolDetail} />
      )}

      {!!withdrawData && !!actionPool ? (
        <WithdrawSucc
          open={!withdrawData}
          data={withdrawData}
          onClose={() => setWithdrawData(null)}
          onConfirm={() => setWithdrawData(null)}
          pool={actionPool}
        />
      ) : null}

      {Number(totalElements) > 0 ? (
        <Pagination
          count={Number(totalElements)}
          onPageChange={handlePageChange}
          defaultPageSize={pagination.pageSize}
        />
      ) : null}
    </TableContainer>
  );
}
