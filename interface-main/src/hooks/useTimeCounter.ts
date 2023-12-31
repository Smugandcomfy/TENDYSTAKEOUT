import { useMemo, useEffect, useState } from "react";
import { BigNumber } from "utils/sdk/index";
import { counter, CountingTime } from "utils/index";

export function useCounter(time: string | number | undefined | bigint) {
  const [count, setCount] = useState<CountingTime | null>(null);

  useEffect(() => {
    if (!time || new BigNumber(String(time)).isLessThan(0)) return;

    let timer: number | undefined = undefined;

    timer = window.setInterval(() => {
      setCount(counter(Number(time)));
    }, 1000);

    return () => {
      clearInterval(timer);
      timer = undefined;
    };
  }, [time]);

  return useMemo(() => count, [count]);
}
