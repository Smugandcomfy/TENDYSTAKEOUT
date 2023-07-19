import { t } from "@lingui/macro";

export type Route = {
  name: string;
  path?: string;
  link?: string;
  subMenus?: SubMenu[];
  key: string;
  icon?: () => JSX.Element;
};

export type SubMenu = Route;

export const MAX_NUMBER = 4;

export const routes: Route[] = [
  {
    key: "launchpad",
    name: t`Launchpad`,
    path: "/launchpad",
  },
  {
    key: "wallet",
    name: t`Wallet`,
    path: `/wallet/token`,
  },
  {
    key: "console",
    name: t`Console`,
    path: `/console`,
  },
];
