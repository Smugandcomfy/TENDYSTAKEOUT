import { createContext } from "react";

export default createContext<{
  refreshTotalBalance?: boolean;
  setRefreshTotalBalance?: (refreshTotalBalance: boolean) => void;
  refreshBalance: number;
  setRefreshBalance: (refreshBalance: number) => void;
}>({
  refreshTotalBalance: false,
  setRefreshTotalBalance: (refreshTotalBalance: boolean) => {},
  refreshBalance: 0,
  setRefreshBalance: (refreshBalance: number) => {},
});
