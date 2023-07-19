import { useState, useMemo, useEffect, useRef } from "react";
import { ApiResult, getQueryPagination, PaginationResult } from "utils/sdk/index";
import { useCallKeysIndexManager, useUpdateCallResult, useCallResult, getCallIndex } from "store/call/hooks";
import { CallResult } from "types/global";

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type Call<T> = () => Promise<ApiResult<T>>;

export function useCallsData<T>(
  fn: Call<T>,
  valid?: undefined | boolean,
  reload?: number | string | boolean
): CallResult<T> {
  const [result, setResult] = useState<ApiResult<T>>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fn && valid !== false) {
      setLoading(true);
      fn().then((result) => {
        setResult(result);
        setLoading(false);
      });
    }
  }, [fn, valid, reload]);

  return useMemo(
    () => ({
      result,
      loading,
    }),
    [result, loading]
  );
}

let stateCallIndex = 0;

export function useStateCallsData<T>(fn: Call<T>, key: string, valid: boolean, reload?: boolean, useOldData?: boolean) {
  const callResults = useCallResult(key) ?? {};

  const updateCallResult = useUpdateCallResult();

  const [loading, setLoading] = useState(false);
  const [callKeyIndex, updateCallKeyIndex] = useCallKeysIndexManager(key);

  useEffect(() => {
    if (fn && valid !== false) {
      setLoading(true);

      stateCallIndex++;
      const index = stateCallIndex;

      updateCallKeyIndex({ callIndex: index });

      fn().then((result) => {
        const stateIndex = getCallIndex(key);

        if (stateIndex === index) {
          updateCallResult(key, { ...callResults, [index]: result });
          setLoading(false);
        }
      });
    }
  }, [fn, valid, reload]);

  return useMemo(() => {
    const result = (
      callResults[callKeyIndex] ? callResults[callKeyIndex] : useOldData ? callResults[callKeyIndex - 1] : undefined
    ) as T | undefined;

    return {
      result,
      loading,
    };
  }, [callResults, loading, callKeyIndex]);
}

export function useLatestDataCall<T>(fn: Call<T>, valid?: undefined | boolean, reload?: number | string | boolean) {
  const [loading, setLoading] = useState(false);

  const indexRef = useRef<number>(0);
  const resultsRef = useRef<{ [key: string]: T | undefined }>({});

  useEffect(() => {
    if (fn && valid !== false) {
      setLoading(true);

      indexRef.current = indexRef.current + 1;
      let index = indexRef.current;

      fn().then((result) => {
        resultsRef.current = {
          ...resultsRef.current,
          [String(index)]: result as T,
        };

        setLoading(false);
      });
    }
  }, [fn, valid, reload]);

  return useMemo(() => {
    return {
      result: resultsRef.current[indexRef.current] as T | undefined,
      loading,
    };
  }, [resultsRef.current, indexRef.current, loading]);
}

export function usePaginationAllData<T>(
  callback: (offset: number, limit: number) => Promise<PaginationResult<T> | undefined>,
  limit: number,
  reload: boolean = false
) {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<T[]>([]);

  const fetch = async (offset: number, limit: number) => {
    return await callback(offset, limit).then((result) => {
      if (result) {
        const content = result.content;
        if (content && content.length > 0) {
          return content;
        }
        return [];
      }
      return [];
    });
  };

  const fetchDone = async (_list: { [k: string]: T[] }) => {
    let data: T[] = [];
    Object.keys(_list).forEach((key) => {
      data = data.concat(_list[key]);
    });
    setList(data);
  };

  useEffect(() => {
    async function getTotalElements() {
      if (callback) {
        const result = await callback(0, 1);
        if (result) {
          return result.totalElements;
        } else {
          return BigInt(0);
        }
      }

      return BigInt(0);
    }

    async function call() {
      const totalElements = await getTotalElements();

      if (Number(totalElements) !== 0) {
        const num = Number(totalElements) % limit;
        const totalPage =
          num === 0 ? Number(totalElements) / limit : parseInt(String(Number(totalElements) / limit)) + 1;

        setLoading(true);

        let _list: { [k: string]: T[] } = {};

        for (let i = 0; i < totalPage; i++) {
          const [offset] = getQueryPagination(i + 1, limit);

          if (totalPage % 80 === 0) {
            await sleep(2000);
          }

          const _fetch = () => {
            fetch(offset, limit)
              .then(async (content) => {
                if (content && content.length > 0) {
                  _list[`${i + 1}`] = content;
                  if (Object.keys(_list).length === totalPage) {
                    await fetchDone(_list);
                    setLoading(false);
                  }
                }
              })
              .catch((error) => {
                console.log(error);
                _fetch();
              });
          };

          _fetch();
        }
      } else {
        setList([]);
        setLoading(false);
      }
    }

    call();
  }, [reload, callback]);

  return useMemo(
    () => ({
      result: list,
      loading,
    }),
    [list, loading]
  );
}
