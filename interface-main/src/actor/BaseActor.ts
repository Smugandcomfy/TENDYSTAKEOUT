import { Actor, HttpAgent } from "@dfinity/agent";
import { IDL } from "@dfinity/candid";

export interface CreateBaseActorProps {
  canisterId: string;
  idlFactory: IDL.InterfaceFactory;
  actorOptions?: any;
  agent: HttpAgent;
  fetchRootKey?: boolean;
}

export async function createBaseActor<T>({
  canisterId,
  idlFactory,
  actorOptions,
  agent,
  fetchRootKey = false,
}: CreateBaseActorProps) {
  // Fetch root key for certificate validation during development
  if (fetchRootKey) {
    await agent?.fetchRootKey().catch((err) => {
      console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
      console.error(err);
    });
  }

  return Actor.createActor<T>(idlFactory, {
    agent: agent,
    canisterId,
    ...(actorOptions ?? {}),
  });
}
