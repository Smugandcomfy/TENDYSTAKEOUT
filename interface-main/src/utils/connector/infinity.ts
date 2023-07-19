import { ActorSubclass, HttpAgent } from "@dfinity/agent";
import type { IConnector } from "./connectors";
import { IDL } from "@dfinity/candid";
import { getStoreWalletUnlocked } from "store/auth/hooks";
import { host } from "constants/server";
import { ALL_CANISTER_IDS } from "constants/canister";
import { LEDGER_CANISTER_ID } from "constants/index";
import { Connector } from "actor/Actor";

const WHITELIST_IDS = [...ALL_CANISTER_IDS, LEDGER_CANISTER_ID];

export class InfinityConnector implements IConnector {
  private config: {
    whitelist: Array<string>;
    providerUrl: string;
    host: string;
    dev: Boolean;
  };
  private identity?: any;
  private principal?: string;
  private httpAgent?: HttpAgent;

  public get getIdentity() {
    return this.identity;
  }

  public get getPrincipal() {
    return this.principal;
  }

  public async getHttpAgent() {
    return this.httpAgent;
  }

  constructor(userConfig = {}) {
    this.config = {
      whitelist: [],
      host: host,
      providerUrl: "",
      dev: false,
      ...userConfig,
    };
  }

  async init() {
    return true;
  }

  async createActor<Service>(
    canisterId: string,
    idlFactory: IDL.InterfaceFactory
  ): Promise<ActorSubclass<Service> | undefined> {
    return await window.ic.infinityWallet.createActor({ canisterId, interfaceFactory: idlFactory });
  }

  async isConnected() {
    const isUnLocked = getStoreWalletUnlocked();

    if (typeof isUnLocked === "boolean" && !isUnLocked) {
      return false;
    }

    if (window.ic.infinityWallet) {
      return await window.ic.infinityWallet.isConnected();
    }

    return false;
  }

  async connect() {
    if (await this.isConnected()) {
      this.principal = (await window.ic.infinityWallet.getPrincipal()).toString();
      this.httpAgent = new HttpAgent({
        ...this.config,
      });
    } else {
      // disconnect first
      await window.ic.infinityWallet.disconnect();

      await window.ic.infinityWallet.requestConnect({ whitelist: WHITELIST_IDS });

      this.principal = (await window.ic.infinityWallet.getPrincipal()).toString();
      this.httpAgent = new HttpAgent({
        ...this.config,
      });
    }

    return true;
  }

  async disconnect() {
    await window.ic.infinityWallet.disconnect();
    return true;
  }
}

export const InfinitySwapWallet = {
  connector: InfinityConnector,
  id: "infinity",
  type: Connector.INFINITY,
};
