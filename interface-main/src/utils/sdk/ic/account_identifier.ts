// https://github.com/dfinity/ic-js/blob/main/packages/nns/src/account_identifier.ts

import { Principal } from "@dfinity/principal";
import { sha224 } from "js-sha256";
import { calculateCrc32, toHexString } from "./converter.utils";

export const asciiStringToByteArray = (text: string): Array<number> => {
  return Array.from(text).map((c) => c.charCodeAt(0));
};

export class AccountIdentifier {
  private constructor(private readonly bytes: Uint8Array) {}

  public static fromHex(hex: string): AccountIdentifier {
    return new AccountIdentifier(Uint8Array.from(Buffer.from(hex, "hex")));
  }

  public static fromPrincipal({
    principal,
    subAccount = SubAccount.ZERO,
  }: {
    principal: Principal;
    subAccount?: SubAccount;
  }): AccountIdentifier {
    // Hash (sha224) the principal, the subAccount and some padding
    const padding = asciiStringToByteArray("\x0Aaccount-id");

    const shaObj = sha224.create();
    shaObj.update([...padding, ...Array.from(principal.toUint8Array()), ...Array.from(subAccount.toUint8Array())]);
    const hash = new Uint8Array(shaObj.array());

    // Prepend the checksum of the hash and convert to a hex string
    const checksum = calculateCrc32(hash);
    const bytes = new Uint8Array([...Array.from(checksum), ...Array.from(hash)]);
    return new AccountIdentifier(bytes);
  }

  public toHex(): string {
    return toHexString(this.bytes);
  }

  public toUint8Array(): Uint8Array {
    return this.bytes;
  }

  public toNumbers(): number[] {
    return Array.from(this.bytes);
  }
}

export class SubAccount {
  private constructor(private readonly bytes: Uint8Array) {}

  public static fromBytes(bytes: Uint8Array): SubAccount | Error {
    if (bytes.length !== 32) {
      return Error("Subaccount length must be 32-bytes");
    }

    return new SubAccount(bytes);
  }

  public static fromPrincipal(principal: Principal): SubAccount {
    const bytes = new Uint8Array(32).fill(0);

    const principalBytes = principal.toUint8Array();
    bytes[0] = principalBytes.length;

    for (let i = 0; i < principalBytes.length; i++) {
      bytes[1 + i] = principalBytes[i];
    }

    return new SubAccount(bytes);
  }

  public static fromID(id: number): SubAccount {
    if (id < 0 || id > 255) {
      throw new Error("Subaccount ID must be >= 0 and <= 255");
    }

    const bytes: Uint8Array = new Uint8Array(32).fill(0);
    bytes[31] = id;
    return new SubAccount(bytes);
  }

  public static ZERO: SubAccount = SubAccount.fromID(0);

  public toUint8Array(): Uint8Array {
    return this.bytes;
  }
}

export function isErrorSubAccount(sub: SubAccount | Error | undefined): sub is SubAccount | undefined {
  if (sub && sub instanceof Error) return false;
  return true;
}
