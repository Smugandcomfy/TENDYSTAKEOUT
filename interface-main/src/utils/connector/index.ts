import { InternetIdentityConnector } from "./internet-identity";
import { StoicConnector } from "./stoic";
import { NF_IDConnector } from "./NF_ID";
import type { IConnector } from "./connectors";
import { principalToAddress } from "utils/sdk/index";
import { IDL } from "@dfinity/candid";
import { ActorSubclass } from "@dfinity/agent";
import { Connector } from "actor/Actor";
import { host as defaultHost, network, NETWORK } from "constants/server";
import { PlugConnector } from "./plug";
import { updateAuth } from "store/auth/hooks";
import { InfinityConnector } from "./infinity";

type ConnectorClass = { new (...args: any[]): IConnector };

export type ProviderOptions = {
  connector: ConnectorClass;
  id: string;
  name: string;
};

export type Provider = {
  connector: IConnector;
  id: string;
  name: string;
};

export type ConnectConfig = {
  whitelist: Array<string>;
  host: string;
  providerUrl: string;
  dev: boolean;
};

export class WalletConnector {
  public connector: IConnector | null = null;
  public walletType: Connector = Connector.ICPSwap;

  public async init(connector: Connector) {
    await this.create(connector);
    this.walletType = connector;
    await this.connector?.init();

    if (!(await this.isConnected())) {
      await this.connect();
    }

    // @ts-ignore
    window.icConnector = this.connector;
  }

  public async create(connector: Connector, config?: { [key: string]: any }) {
    this.walletType = connector;

    const _config = {
      host: defaultHost,
      dev: network !== NETWORK.IC,
      ...(config ?? {}),
    };

    switch (connector) {
      case Connector.IC:
        this.connector = new InternetIdentityConnector(_config);
        break;
      case Connector.STOIC:
        this.connector = new StoicConnector(_config);
        break;
      case Connector.NFID:
        this.connector = new NF_IDConnector(_config);
        break;
      case Connector.PLUG:
        this.connector = new PlugConnector(_config);
        break;
      case Connector.INFINITY:
        this.connector = new InfinityConnector(_config);
        break;
      default:
        throw new Error("Not support this connect for now");
    }
  }

  public async connect() {
    await this.connector?.init();
    const isConnectedSuccessfully = await this.connector?.connect();
    // @ts-ignore
    window.icConnector = this.connector;

    updateAuth({ walletType: this.walletType });

    return isConnectedSuccessfully;
  }

  public async isConnected() {
    return this.connector?.isConnected();
  }

  public async createActor<Service>(
    canisterId: string,
    idlFactory: IDL.InterfaceFactory
  ): Promise<ActorSubclass<Service> | undefined> {
    return await this.connector?.createActor(canisterId, idlFactory);
  }
}

export async function getConnectorIsConnected(): Promise<boolean> {
  return window.icConnector.isConnected();
}

export async function getConnectorPrincipal(): Promise<string> {
  return window.icConnector.getPrincipal;
}

export async function getConnectorAccountId(): Promise<string> {
  return principalToAddress(await getConnectorPrincipal());
}

export async function createC2ICActor<Service>(canisterId: string, idlFactory: IDL.InterfaceFactory) {
  return window.icConnector.createActor<Service>(canisterId, idlFactory);
}

export async function initialConnector(wallet: Connector, config?: { [key: string]: any }) {
  const connector = new WalletConnector();
  await connector.init(wallet);
}

export async function getHttpAgent() {
  return await window.icConnector.getHttpAgent();
}

export * from "./internet-identity";
export * from "./stoic";
