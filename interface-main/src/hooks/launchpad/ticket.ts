import { useMemo, useState, useEffect } from "react";
import { TICKET_STORAGE_NAME } from "constants/launchpad";
import storage from "redux-persist/lib/storage";
import { getLaunchpadTicket, generateLaunchpadTicket } from "hooks/launchpad/index";

export function useLaunchpadTicket(account: string, canisterId: string) {
  const [launchpadCanisterId, setLaunchpadCanisterId] = useState("");
  const [triedTimes, setTriedTimes] = useState(0);

  const getTicket = async () => {
    let storageTicket = await storage.getItem(TICKET_STORAGE_NAME);
    let ticket = !storageTicket ? {} : JSON.parse(storageTicket);
    return ticket;
  };

  const generateTicket = async (account: string, canisterId: string) => {
    if (account && canisterId) {
      const ticketStorageKey = `${canisterId}_${account}`;

      let ticket = await getTicket();

      if (!ticket[ticketStorageKey]) {
        const { status, data } = await generateLaunchpadTicket(canisterId, account);
        if (status === "ok") {
          ticket = {
            ...(await getTicket()),
            [ticketStorageKey]: data,
          };
          await storage.setItem(TICKET_STORAGE_NAME, JSON.stringify(ticket));
        }
      }
    }
  };

  const getLaunchpadCanisterId = async (account: string, canisterId: string) => {
    if (account && canisterId) {
      if (triedTimes > 15) return;

      const ticketStorageKey = `${canisterId}_${account}`;

      let ticket = await getTicket();

      const { status, data } = await getLaunchpadTicket(canisterId, account, ticket[ticketStorageKey]);

      setTriedTimes(triedTimes + 1);

      if (status === "ok" && !!data?.cid) {
        setLaunchpadCanisterId(data.cid);
      } else {
        ticket = {
          ...(await getTicket()),
          [ticketStorageKey]: undefined,
        };
        await storage.setItem(TICKET_STORAGE_NAME, JSON.stringify(ticket));

        await generateTicket(account, canisterId);
        await getLaunchpadCanisterId(account, canisterId);
      }
    }
  };

  useEffect(() => {
    (async () => {
      await generateTicket(account, canisterId);
      await getLaunchpadCanisterId(account, canisterId);
    })();
  }, [account, canisterId]);

  return useMemo(() => launchpadCanisterId, [launchpadCanisterId]);
}
