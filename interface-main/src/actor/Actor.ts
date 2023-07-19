import { createBaseActor } from "./BaseActor";
import { HttpAgent, ActorSubclass } from "@dfinity/agent";
import { ActorIdentity } from "types/global";
import { IDL } from "@dfinity/candid";
import { ic_host } from "constants/index";

export type ActorConstructor = {
  canisterId: string;
  host?: string;
  idlFactory: IDL.InterfaceFactory;
  identity?: ActorIdentity;
  agent?: HttpAgent;
};

export enum Connector {
  ICPSwap = "ICPSwap",
  PLUG = "PLUG",
  STOIC = "STOIC",
  IC = "IC",
  NFID = "NFID",
  INFINITY = "INFINITY",
}

export function isICConnector(connector: Connector) {
  return connector === Connector.IC || connector === Connector.STOIC || connector === Connector.NFID;
}

export function isPlugConnector(connector: Connector) {
  return connector === Connector.PLUG || connector === Connector.INFINITY;
}

export type ActorError = { canisterId: string; message: string; method: string };
export type ActorErrorCallback = (error: ActorError) => void;

async function createInfinityActor<T>(canisterId: string, interfaceFactory: IDL.InterfaceFactory) {
  return await window.ic.infinityWallet.createActor<T>({ canisterId, interfaceFactory });
}

async function createPlugActor<T>(canisterId: string, interfaceFactory: IDL.InterfaceFactory) {
  return await window.ic.plug.createActor<T>({ canisterId, interfaceFactory });
}

export class Actor {
  private connector: Connector = Connector.ICPSwap;
  private agent: null | HttpAgent = null;
  private host: string = ic_host;
  private errorCallbacks: ActorErrorCallback[] = [];

  public setConnector(connector: Connector) {
    this.connector = connector;
  }

  public async create<T>({
    canisterId,
    host,
    idlFactory,
    identity,
    agent,
  }: ActorConstructor): Promise<ActorSubclass<T>> {
    if (!canisterId) throw Error(`No canister id`);

    const _host = host ?? this.host;

    if (!idlFactory) throw Error(`No idlFactory for ${canisterId}`);

    let _agent = this.AnonymousAgent(host);
    let isRejected = false;

    // catch plug type wallet reject error
    try {
      _agent = agent
        ? agent
        : !identity
        ? this.AnonymousAgent(host)
        : this.agent
        ? this.agent
        : await this.createAgent(canisterId, _host, identity);
    } catch (err) {
      isRejected = true;
      console.error(err);
    }

    const serviceClass = idlFactory({ IDL: IDL });

    let actor: ActorSubclass<T> | null = null;

    // catch create infinity actor rejected
    let createActorError: null | string = null;

    if (this.connector === Connector.INFINITY && !!identity) {
      try {
        actor = await createInfinityActor<T>(canisterId, idlFactory);
      } catch (error) {
        createActorError = String(error);
      }
    } else if (this.connector === Connector.PLUG && !!identity) {
      try {
        actor = await createPlugActor<T>(canisterId, idlFactory);
      } catch (error) {
        createActorError = String(error);
      }
    } else {
      actor = await createBaseActor<T>({
        canisterId: canisterId,
        idlFactory: idlFactory,
        agent: _agent,
        fetchRootKey: _host !== ic_host,
      });
    }

    const _actor: { [key: string]: any } = {};

    serviceClass._fields.forEach((ele) => {
      const key = ele[0];

      _actor[key] = async (...args: any) => {
        if (createActorError) return { err: createActorError };
        if (isRejected) return { err: "The agent creation was rejected" };

        try {
          if (!actor) return { err: "no actor" };
          // @ts-ignore
          const result = actor[key](...args) as Promise<any>;
          return await result;
        } catch (error) {
          const _error = String(error);

          let message = "";
          if (_error.includes("Reject text:")) {
            const _message = _error.split(`Reject text: `)[1]?.split(" at") ?? "";
            message = !!_message ? _message[0]?.trim() : _error;
          } else {
            const _message = _error.includes(`"Message"`) ? _error.split(`"Message": `)[1]?.split('"') : "";
            message = _error.includes(`"Message"`) && !!_message ? _message[1] : _error;
          }

          console.log("Error =====================>");
          console.log("canister: ", canisterId);
          console.log("method: ", key);
          console.log("rejected: ", message);
          console.log("Error =====================>");

          this.errorCallbacks.forEach((call) => {
            call({ canisterId: canisterId ?? "", method: key, message });
          });

          return { err: message };
        }
      };
    });

    return _actor as ActorSubclass<T>;
  }

  public AnonymousAgent(host?: string) {
    return new HttpAgent({
      host: host ?? this.host,
    });
  }

  public async createAgent(canisterId: string, host: string, identity?: ActorIdentity): Promise<HttpAgent> {
    if (identity === true) {
      if (this.connector === Connector.PLUG) {
        await window.ic.plug.createAgent({ whitelist: [canisterId], host });
        return window.ic.plug.agent;
      } else if (this.connector === Connector.INFINITY) {
        return new HttpAgent({
          host: host ?? this.host,
        });
      } else if (isICConnector(this.connector)) {
        return window.icConnector.httpAgent;
      }
    } else if (!!identity) {
      return new HttpAgent({
        host: host ?? this.host,
        identity,
      });
    }

    return new HttpAgent({
      host: host ?? this.host,
    });
  }

  public setAgent(agent: HttpAgent | null) {
    this.agent = agent;
  }

  public setHost(host: string) {
    this.host = host;
  }

  public onError(callback: ActorErrorCallback) {
    this.errorCallbacks.push(callback);
  }
}

export const actor = new Actor();
