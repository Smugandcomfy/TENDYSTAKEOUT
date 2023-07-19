import { AuthClient } from "@dfinity/auth-client";
import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent";
import type { Identity } from "@dfinity/agent";
import type { IConnector } from "./connectors";
import { IDL } from "@dfinity/candid";
import { Connector } from "actor/Actor";

export class InternetIdentityConnector implements IConnector {
  private config: {
    whitelist: Array<string>;
    host: string;
    providerUrl: string;
    dev: boolean;
  };
  private identity?: Identity;
  private principal?: string;
  private client?: AuthClient;
  private httpAgent?: HttpAgent;

  public get getPrincipal() {
    return this.principal;
  }

  public get getClient() {
    return this.client;
  }

  public async getHttpAgent() {
    return this.httpAgent;
  }

  constructor(userConfig = {}) {
    this.config = {
      whitelist: [],
      host: window.location.origin,
      providerUrl: "https://identity.ic0.app",
      dev: false,
      ...userConfig,
    };
  }

  async init() {
    this.client = await AuthClient.create();
    const isConnected = await this.isConnected();

    if (isConnected) {
      this.identity = this.client.getIdentity();
      this.principal = this.identity?.getPrincipal().toString();
      this.httpAgent = new HttpAgent({
        ...this.config,
        identity: this.identity,
      });
    }

    return true;
  }

  async isConnected(): Promise<boolean> {
    return !!(await this.client?.isAuthenticated());
  }

  async createActor<Service>(
    canisterId: string,
    idlFactory: IDL.InterfaceFactory
  ): Promise<ActorSubclass<Service> | undefined> {
    const agent = new HttpAgent({
      ...this.config,
      identity: this.identity,
    });

    if (this.config.dev) {
      // Fetch root key for certificate validation during development
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

  async connect() {
    await new Promise((resolve, reject) => {
      this.client?.login({
        identityProvider: this.config.providerUrl,
        onSuccess: () => resolve(true),
        onError: reject,
      });
    });
    const identity = this.client?.getIdentity();
    const principal = identity?.getPrincipal().toString();
    this.identity = identity;
    this.principal = principal;
    this.httpAgent = new HttpAgent({
      ...this.config,
      identity: this.identity,
    });
    return true;
  }

  async disconnect() {
    await this.client?.logout();
    return true;
  }
}

export const InternetIdentity = {
  connector: InternetIdentityConnector,
  id: "ii",
  type: Connector.IC,
};
