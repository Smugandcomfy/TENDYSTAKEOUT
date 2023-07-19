import Decimal from "decimal.js";
import { BigNumber } from "utils/sdk/index";

// @ts-ignore  hijack bigint
BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const NO_GROUP_SEPARATOR_FORMATTER = {
  groupSeparator: "",
};

export const toString = (x: number, dp = 18) => Decimal.mul(x, Decimal.pow(10, dp)).toFixed(0);
export const toDecimal = (x: number, dp = 18) => Decimal.div(x, Decimal.pow(10, dp));

export function isDarkTheme(theme: any): boolean {
  return theme.customization.theme === "dark";
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

export function getExplorerPrincipalLink(principalId: string): string {
  if ((principalId ?? "").length > 27) {
    return `https://icscan.io/principal/${principalId}`;
  } else {
    return `https://icscan.io/canister/${principalId}`;
  }
}

export function getExplorerAccountLink(account: string): string {
  return `https://icscan.io/account/${account}`;
}

export function openBase64ImageInNewWindow(base64String: string) {
  var image = new Image();
  image.src = base64String;

  var win = window.open("");
  win?.document.write(image.outerHTML);
}

export type CountingTime = {
  hour: string | number;
  min: string | number;
  sec: string | number;
};

export function toDoubleNumber(string: number | string) {
  const newString = String(string);

  if (newString.length < 2) {
    return `0${newString}`;
  }

  return string;
}

export function counter(time: string | number | Date): CountingTime {
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
    hour: toDoubleNumber(hour),
    min: toDoubleNumber(min),
    sec: toDoubleNumber(sec),
  };
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function toFormat(value: string | number | BigNumber | undefined) {
  if (value === undefined) return "";
  return new BigNumber(value).toFormat();
}

export * from "./numbers";
export * from "./type";

export { principalToAddress } from "utils/sdk/index";
