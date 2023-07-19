import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent";
import type { IConnector } from "./connectors";
import { IDL } from "@dfinity/candid";
import { Connector } from "actor/Actor";
import { getStoreWalletUnlocked } from "store/auth/hooks";
import { host } from "constants/server";
import { PLUG_AUTH_IDS } from "constants/plug";

export class PlugConnector implements IConnector {
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
    await window.ic.plug.createAgent({ host: "", whitelist: [] });

    const agent = window.ic.plug.agent;

    return Actor.createActor(idlFactory, {
      agent,
      canisterId,
    });
  }

  async isConnected() {
    const isUnLocked = getStoreWalletUnlocked();

    if (typeof isUnLocked === "boolean" && !isUnLocked) {
      return false;
    }

    if (window.ic.plug) {
      return await window.ic.plug.isConnected();
    }

    return false;
  }

  async connect() {
    if (await this.isConnected()) {
      this.principal = window.ic.plug.principalId;
      this.httpAgent = new HttpAgent({
        ...this.config,
      });
    } else {
      await window.ic.plug.requestConnect({ whitelist: [...PLUG_AUTH_IDS] });
      this.principal = window.ic.plug.principalId;
      this.httpAgent = new HttpAgent({
        ...this.config,
      });
    }

    return true;
  }

  async disconnect() {
    await window.ic.plug.disconnect();
    return true;
  }
}

export const PlugWallet = {
  connector: PlugConnector,
  id: "plug",
  type: Connector.PLUG,
};
