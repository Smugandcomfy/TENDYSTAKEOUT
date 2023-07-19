import BigNumber from "bignumber.js";
import { nanosecond2Millisecond } from "utils/sdk/index";
import { LAUNCHPAD_STATE, EXCHANGE_RATIO_DECIMALS } from "constants/launchpad";
import { t } from "@lingui/macro";
import { Property } from "types/launchpad";

export function getLaunchpadState(pool: Property): {
  statusText: string;
  claimable: boolean;
  statusClassName: string;
  status: LAUNCHPAD_STATE;
} {
  let statusText = "";
  let statusClassName = "";
  let status = LAUNCHPAD_STATE.ONGOING;

  const now = new Date().getTime();

  if (new BigNumber(String(pool.startDateTime)).dividedBy(1000000).isGreaterThan(now)) {
    statusText = t`Upcoming`;
    statusClassName = "upcoming";
    status = LAUNCHPAD_STATE.UPCOMING;
  } else {
    if (new BigNumber(String(pool.endDateTime)).dividedBy(1000000).isLessThan(now)) {
      statusText = t`Finished`;
      statusClassName = "finished";
      status = LAUNCHPAD_STATE.FINISHED;
    } else {
      statusText = t`Live`;
      statusClassName = "ongoing";
      status = LAUNCHPAD_STATE.ONGOING;
    }
  }

  const claimable = new BigNumber(nanosecond2Millisecond(pool.endDateTime)).isLessThan(now);

  return {
    statusText,
    status,
    statusClassName,
    claimable,
  };
}

export function formatExchangeRatio(value: string | number | BigInt) {
  return new BigNumber(10 ** EXCHANGE_RATIO_DECIMALS).multipliedBy(String(value));
}

export function parseExchangeRatio(value: string | number | BigInt) {
  return new BigNumber(String(value)).div(10 ** EXCHANGE_RATIO_DECIMALS);
}

export function timeParser(time: any): Date {
  const date = new Date(time);
  const seconds = date.getSeconds();
  return new Date(date.getTime() - seconds * 1000);
}
