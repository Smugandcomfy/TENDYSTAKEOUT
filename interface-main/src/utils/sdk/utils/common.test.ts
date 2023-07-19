import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;

import { Principal } from "@dfinity/principal";
import {
  parseTokenAmount,
  enumResultFormat,
  numberToString,
  getQueryPagination,
  isValidAddress,
  principalToAddress,
  valueofUser,
  shorten,
  moErrMessageFormat,
  arrayBufferFromHex,
  arrayBufferToHex
} from "./common";
import { SubAccount } from "../ic/account_identifier";

const array = [
  78,
  86,
  237,
  51,
  210,
  117,
  123,
  53,
  161,
  167,
  210,
  162,
  107,
  52,
  41,
  133,
  227,
  128,
  218,
  221,
  26,
  165,
  186,
  142,
  11,
  38,
  18,
  93,
  220,
  186,
  229,
  220
];

describe("#numbers", () => {
  describe("#formatDollarAmount", () => {
    it("succeeds", () => {
      expect(parseTokenAmount(1000000, 2).toNumber()).toEqual(10000);
    });
  });

  describe("#enumResultFormat", () => {
    it("success", () => {
      expect(enumResultFormat({ ok: 0 }).message).toEqual("");
      expect(enumResultFormat({ ok: 0 }).data).toEqual(0);
      expect(enumResultFormat({ ok: 0 }).status).toEqual("ok");

      expect(enumResultFormat({ Ok: 0 }).status).toEqual("ok");
      expect(enumResultFormat({ Ok: 0 }).data).toEqual(0);
    });

    it("error", () => {
      expect(enumResultFormat({ err: "Error message" }).message).toEqual("Error message");

      expect(enumResultFormat({ err: "Error message" }).status).toEqual("err");

      expect(enumResultFormat({ err: "Error message" }).data).toEqual(undefined);

      expect(enumResultFormat({ err: { Other: "1234" } }).message).toEqual("1234");

      expect(
        enumResultFormat({
          Err: {
            NoNewUtxos: {
              current_confirmations: [],
              required_confirmations: 12
            }
          }
        }).message
      ).toEqual("NoNewUtxos: {current_confirmations:[],required_confirmations:12}");

      expect(enumResultFormat({ err: { InternalError: { value: "illegal balance in pool" } } }).message).toEqual(
        "InternalError: {value:illegal balance in pool}"
      );

      expect(enumResultFormat({ Err: "Error message" }).status).toEqual("err");

      expect(enumResultFormat({ Err: "Error message" }).data).toEqual(undefined);

      expect(enumResultFormat({ Err: { Other: "1234" } }).message).toEqual("1234");

      expect(enumResultFormat({ Err: { InternalError: "illegal balance in pool" } }).message).toEqual(
        "InternalError: illegal balance in pool"
      );
    });

    it("message when error", () => {
      expect(enumResultFormat({ err: "This is my error message" }).message).toEqual("This is my error message");
    });

    it("message when success", () => {
      expect(enumResultFormat({ ok: "This is my message" }).message).toEqual("This is my message");
    });

    it(`0 or "" or BigInt(0)`, () => {
      expect(enumResultFormat(0).data).toEqual(0);

      expect(enumResultFormat("").data).toEqual("");

      expect(enumResultFormat(BigInt(0)).data).toEqual(BigInt(0));
    });
  });

  describe("numberToString", () => {
    it(`success`, () => {
      expect(numberToString(0)).toEqual("0");
    });
  });

  describe("getQueryPagination", () => {
    it(`success`, () => {
      expect(getQueryPagination(1, 10)[0]).toEqual(0);
      expect(getQueryPagination(1, 10)[1]).toEqual(10);

      expect(() => {
        getQueryPagination(0, 10);
      }).toThrow("Invalid pageNum");

      expect(() => {
        getQueryPagination(1, 0);
      }).toThrow("Invalid pageSize");
    });
  });

  describe("isValidAddress", () => {
    it(`success`, () => {
      expect(isValidAddress("90e587feb4296744990e0c1284e578bb199f807bc3a414e75d6ed505ecb52328")).toEqual(true);
      expect(isValidAddress("90e587feb4296744990e0c1284e578bb199f807bc3a414e75d6ed505ecb5232")).toEqual(false);
      // This address is invalid
      expect(isValidAddress("90e587feb4296744990e0c1284e578bb199f807bc3a414e75d6ed505ecb52325")).toEqual(true);
    });
  });

  describe("principalToAddress", () => {
    it(`success`, () => {
      expect(principalToAddress("lqxxe-qakab-u4jie-xmfo2-rfdrv-uzjnx-azs3q-ywj5m-jp3cm-sxyhw-4ae")).toEqual(
        "90e587feb4296744990e0c1284e578bb199f807bc3a414e75d6ed505ecb52328"
      );

      expect(
        principalToAddress(
          "3ejs3-eaaaa-aaaag-qbl2a-cai",
          SubAccount.fromPrincipal(
            Principal.fromText("4xlep-eco65-pylok-bfwji-udndj-qlpks-7ayzk-762xw-q76pj-ld4cb-lae")
          )
        )
      ).toEqual("2aa530ac02f02f89394d37e359ada16e8d7a7faf619c47fccb4a59f03223d097");

      expect(principalToAddress("vgfym-hzxkx-37cbk-owg3r-25zpz-zhtdn-odmq5-wfe7e-6mwmo-ip5im-iae")).toEqual(
        "5745aa5690df0a38d0c2780d33fc60f33befcb8d8427dca355637b378eaa6f12"
      );

      expect(() => {
        principalToAddress("lqxxe-qakab-u4jie-xmfo2-rfdrv-uzjnx-azs3q-ywj5m-jp3cm-sxyhw-");
      }).toThrowError();
    });
  });

  describe("valueofUser", () => {
    it(`success`, () => {
      expect(valueofUser({ address: "12345" })).toEqual("12345");

      expect(
        valueofUser({
          principal: Principal.fromText("lqxxe-qakab-u4jie-xmfo2-rfdrv-uzjnx-azs3q-ywj5m-jp3cm-sxyhw-4ae")
        }).toString()
      ).toEqual("lqxxe-qakab-u4jie-xmfo2-rfdrv-uzjnx-azs3q-ywj5m-jp3cm-sxyhw-4ae");
    });
  });

  describe("shorten", () => {
    it(`success`, () => {
      expect(shorten("lqxxe-qakab-u4jie-xmfo2-rfdrv-uzjnx-azs3q-ywj5m-jp3cm-sxyhw-4ae")).toEqual("lqxxe-...-4ae");

      expect(shorten("lqxxe")).toEqual("lqxxe...qxxe");
    });
  });

  describe("moErrMessageFormat", () => {
    it(`success`, () => {
      expect(moErrMessageFormat("Error: Reject text: Failed to transfer")).toEqual("Failed to transfer");
    });
  });

  describe("arrayBufferFromHex", () => {
    it(`success`, () => {
      expect([...arrayBufferFromHex("4e56ed33d2757b35a1a7d2a26b342985e380dadd1aa5ba8e0b26125ddcbae5dc")]).toEqual(
        array
      );
    });
  });

  describe("arrayBufferToHex", () => {
    it(`success`, () => {
      expect(arrayBufferToHex(Uint8Array.from(array))).toEqual(
        "4e56ed33d2757b35a1a7d2a26b342985e380dadd1aa5ba8e0b26125ddcbae5dc"
      );
    });
  });
});
