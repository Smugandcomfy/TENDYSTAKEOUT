import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import isObject from "lodash/isObject";
import invariant from "tiny-invariant";
import { ResultStatus, StatusResult, NumberType } from "../types/index";
import { Principal } from "@dfinity/principal";
import { AccountIdentifier, SubAccount } from "../ic/account_identifier";

export const ICP_ADDRESS_LENGTH = 64;

BigNumber.config({
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
});

export { BigNumber };

export const NO_GROUP_SEPARATOR_FORMATTER = {
  groupSeparator: "",
};

export function formatTokenAmount(amount: NumberType | null | undefined, decimals: number | bigint = 8): BigNumber {
  let _amount = amount;
  let _decimals = decimals;

  if (_amount !== 0 && !_amount) return new BigNumber(0);
  if (typeof _amount === "bigint") _amount = Number(_amount);
  if (typeof decimals === "bigint") _decimals = Number(_decimals);
  if (Number.isNaN(Number(amount))) return new BigNumber(_amount);
  return new BigNumber(_amount).multipliedBy(10 ** Number(_decimals));
}

export function parseTokenAmount(amount: NumberType | null | undefined, decimals: number | bigint = 8): BigNumber {
  if (amount !== 0 && !amount) return new BigNumber(0);
  if (typeof amount === "bigint") amount = Number(amount);
  if (typeof decimals === "bigint") decimals = Number(decimals);
  if (Number.isNaN(Number(amount))) return new BigNumber(String(amount));
  return new BigNumber(String(amount)).dividedBy(10 ** Number(decimals));
}

/**
 * Only Integer number
 */
export function numberToString(num: number | BigNumber | bigint): string {
  if (num === 0 || num === BigInt(0)) return "0";
  if (num) return new BigNumber(typeof num === "bigint" ? String(num) : num).toFormat(NO_GROUP_SEPARATOR_FORMATTER);
  return "";
}

export function timestampFormat(timestamp: bigint | string | number, format: string = "YYYY-MM-DD HH:mm:ss"): string {
  if (!timestamp) return "";
  let newTimestamp = new BigNumber(String(timestamp).substr(0, 13)).toNumber();
  return dayjs(newTimestamp).format(format);
}

export function cyclesBalanceFormat(value: NumberType, noUnit?: boolean): string {
  if (value === 0 || !value) return noUnit ? `0` : `0 T`;
  return `${new BigNumber(parseTokenAmount(value, 12).toFixed(4)).toFormat()}${noUnit ? "" : " T"}`;
}

function swap<T>(items: T[], leftIndex: number, rightIndex: number): void {
  var temp = items[leftIndex];
  items[leftIndex] = items[rightIndex];
  items[rightIndex] = temp;
}

function quickInnerSort<T>(
  arr: T[],
  partition: (arr: T[], left: number, right: number) => number,
  left?: number,
  right?: number
) {
  let partitionIndex: number | null = null;

  left = typeof left !== "number" ? 0 : left;
  right = typeof right !== "number" ? arr.length - 1 : right;

  if (left < right) {
    partitionIndex = partition(arr, left, right);
    quickInnerSort(arr, partition, left, partitionIndex - 1);
    quickInnerSort(arr, partition, partitionIndex + 1, right);
  }

  return arr;
}

export function quickSort<T>(_arr: T[], key?: string, valueFormat?: (value: any) => any) {
  let arr = [..._arr];

  const getArrIndexValue = (arr: T[], index: number) => {
    if (key) {
      // @ts-ignore
      let value: any = arr[index][key];
      return valueFormat ? valueFormat(value) : value;
    }
    return valueFormat ? valueFormat(arr[index]) : arr[index];
  };

  const partition = (arr: T[], left: number, right: number): number => {
    const pivot = left;
    let index = pivot + 1;
    for (let i = index; i <= right; i++) {
      if (new BigNumber(getArrIndexValue(arr, i)).isLessThan(getArrIndexValue(arr, pivot))) {
        swap(arr, i, index);
        index++;
      }
    }
    swap(arr, pivot, index - 1);
    return index - 1;
  };

  return quickInnerSort(arr, partition);
}

export function getQueryPagination(pageNum: number, pageSize: number): [number, number] {
  invariant(pageNum > 0, "Invalid pageNum");
  invariant(pageSize > 0, "Invalid pageSize");

  const pageStart = (pageNum - 1) * pageSize;
  const pageEnd = pageStart + pageSize;
  return [pageStart, pageEnd];
}

export function transactionsTypeFormat(type: any): string {
  if (typeof type === "string") return type;
  if (typeof type === "object") {
    if (type) {
      return Object.keys(type)[0];
    }
  }
  return type;
}

export function moErrMessageFormat(errMessage: string): string {
  return errMessage.split(`Reject text: `)[1]?.split(" at")[0] ?? errMessage;
}

export function isPrincipal(principal: any): principal is Principal {
  return !!principal && principal._isPrincipal;
}

export function isValidPrincipal(principal: string): boolean {
  try {
    return principal === Principal.fromText(principal).toText();
  } catch (e) {
    return false;
  }
}

export type User = { principal: Principal } | { address: string };

export function isPrincipalUser(user: User): user is { principal: Principal } {
  if (user.hasOwnProperty("principal")) return true;
  return false;
}

export function isAddressUser(user: User): user is { address: string } {
  if (user.hasOwnProperty("address")) return true;
  return false;
}

export function valueofUser(user: User) {
  if (isPrincipalUser(user)) {
    return user.principal;
  } else {
    return user.address;
  }
}

export function isValidAddress(address: string): boolean {
  return /^[0-9a-fA-F]+$/.test(address) && ICP_ADDRESS_LENGTH === address.length;
}

export function principalToAddress(principal: string, subAccount?: SubAccount): string {
  if (!principal) return principal;
  return AccountIdentifier.fromPrincipal({ principal: Principal.fromText(principal), subAccount }).toHex();
}

export function enumTypeFormat(type: string | object): string {
  if (typeof type === "string") return type;
  if (typeof type === "object") {
    if (type) {
      return Object.keys(type)[0];
    }
  }
  return type;
}

export function isResultKey(key: string) {
  return isResultErrKey(key) || isResultOkKey(key);
}

export function isResultErrKey(key: string) {
  return key === ResultStatus.ERROR || key === "Err";
}

export function isResultOkKey(key: string) {
  return key === ResultStatus.OK || key === "Ok";
}

export function enumResultFormat<T>(result: any): StatusResult<T> {
  if (result === null || result === undefined) {
    return {
      status: ResultStatus.ERROR,
      message: "",
      data: undefined,
    };
  }

  const key = Object.keys(result);

  if (result && isObject(result as object) && key && key[0] && isResultKey(key[0])) {
    let message = "";

    if (isResultErrKey(key[0]) && isObject(result[key[0]])) {
      const messageKey = Object.keys(result[key[0]])[0];
      const value = result[key[0]][messageKey];

      // TODO: for token
      if (messageKey === "Other") {
        message = value;
      } else {
        if (typeof value === "object") {
          message = `${messageKey}: ${JSON.stringify(value).replace(/"/g, "")}`;
        } else {
          message = `${messageKey}: ${value}`;
        }
      }
    } else if (typeof result[key[0]] === "string") {
      message = result[key[0]];
    }

    return {
      status: isResultErrKey(key[0]) ? ResultStatus.ERROR : ResultStatus.OK,
      data: isResultOkKey(key[0]) ? (result[key[0]] as T) : undefined,
      message,
    };
  }

  return {
    status: ResultStatus.OK,
    data: result as T,
    message: "",
  };
}

export function isValidQueryPagination(offset: number, limit: number): boolean {
  return (!!offset || offset === 0) && !!limit;
}

export function openInNewWindow(url: string, id: string): void {
  let a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("target", "_blank");
  a.setAttribute("id", id);
  if (!document.getElementById(id)) {
    document.body.appendChild(a);
  }
  a.click();
}

export function nanosecond2Millisecond(time: string | number | bigint) {
  return new BigNumber(String(time)).dividedBy(1000000).toNumber();
}

export function millisecond2Nanosecond(time: string | number | bigint) {
  return new BigNumber(new Date(Number(time)).getTime()).multipliedBy(1000000).toNumber();
}

export function nullParamsFormat<T>(value: T | null | undefined): [T] | [] {
  return value ? [value] : [];
}

export function openBase64ImageInNewWindow(base64String: string) {
  var image = new Image();
  image.src = base64String;

  var win = window.open("");
  win?.document.write(image.outerHTML);
}

export function stringToArrayBuffer(string: string): Uint8Array {
  return new TextEncoder().encode(string);
}

export function arrayBufferToString(arrayBuffer: Uint8Array): string {
  return new TextDecoder("utf-8").decode(arrayBuffer);
}

export function shortenAddress(str = "", length = 4) {
  return `${str.slice(0, length)}...${str.slice(str.length - length)}`;
}

export function shorten(str: string, key?: any): string {
  if (!str) return str;
  let limit;
  if (typeof key === "number") limit = key;
  if (key === "symbol") limit = 6;
  if (key === "name") limit = 64;
  if (key === "choice") limit = 12;
  if (limit) return str.length > limit ? `${str.slice(0, limit).trim()}...` : str;

  return shortenAddress(str);
}

export function arrayBufferToHex(arrayBuffer: Uint8Array) {
  return Array.from([...arrayBuffer], function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}

export function arrayBufferFromHex(hex: string) {
  if (hex.substr(0, 2) === "0x") hex = hex.substr(2);
  for (var bytes: number[] = [], c = 0; c < hex.length; c += 2) bytes.push(parseInt(hex.substr(c, 2), 16));
  return Uint8Array.from(bytes);
}
