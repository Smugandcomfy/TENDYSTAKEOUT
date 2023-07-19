// @ts-ignore no types
import { StoicIdentity } from "ic-stoic-identity";
import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent";
import type { IConnector } from "./connectors";
import { IDL } from "@dfinity/candid";
import { Connector } from "actor/Actor";

export class StoicConnector implements IConnector {
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
      host: window.location.origin,
      providerUrl: "https://www.stoicwallet.com",
      dev: false,
      ...userConfig,
    };
  }

  async init() {
    const identity = await StoicIdentity.load(this.config.providerUrl);

    if (identity) {
      this.identity = identity;
      this.principal = identity.getPrincipal().toText();
      this.httpAgent = new HttpAgent({
        ...this.config,
        identity,
      });
    }

    return true;
  }

  async createActor<Service>(
    canisterId: string,
    idlFactory: IDL.InterfaceFactory
  ): Promise<ActorSubclass<Service> | undefined> {
    const agent = new HttpAgent({
      ...this.config,
      identity: this.identity,
    });

    // Fetch root key for certificate validation during development
    if (this.config.dev) {
      agent.fetchRootKey().catch((err) => {
        console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
        console.error(err);
      });
    }

    return Actor.createActor(idlFactory, {
      agent,
      canisterId,
    });
  }

  async isConnected() {
    const identity = await StoicIdentity.load();
    return !!identity;
  }

  async connect() {
    this.identity = await StoicIdentity.connect();
    this.principal = this.identity.getPrincipal().toText();

    this.httpAgent = new HttpAgent({
      ...this.config,
      identity: this.identity,
    });

    return true;
  }

  async disconnect() {
    await StoicIdentity.disconnect();
    return true;
  }
}

export const StoicWallet = {
  connector: StoicConnector,
  id: "stoic",
  type: Connector.STOIC,
};
