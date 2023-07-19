import { ActorSubclass } from "@dfinity/agent";
import { IDL } from "@dfinity/candid";

export interface IConnector {
  init: () => Promise<boolean>;
  isConnected: () => Promise<boolean>;
  createActor: <Service>(
    canisterId: string,
    interfaceFactory: IDL.InterfaceFactory
  ) => Promise<ActorSubclass<Service> | undefined>;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  getPrincipal: string | undefined;
}

export interface WalletAccount {
  name: string;
  address: string;
}
