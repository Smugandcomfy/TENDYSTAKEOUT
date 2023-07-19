export enum LAUNCHPAD_STATE {
  ONGOING = "ongoing",
  UPCOMING = "upcoming",
  FINISHED = "finished",
}

export const LAUNCHPAD_STATE_COLORS = {
  [LAUNCHPAD_STATE.UPCOMING]: "#5669DC",
  [LAUNCHPAD_STATE.ONGOING]: "#54C081",
  [LAUNCHPAD_STATE.FINISHED]: "#8492C4",
};

export const EXCHANGE_RATIO_DECIMALS = 18;

export const TICKET_STORAGE_NAME = "LaunchpadTicket";
