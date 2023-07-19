import { useErrorTip } from "hooks/useTips";
import { actor, ActorError } from "../actor/Actor";
import { useEffect } from "react";

function isCyclesError(message: string) {
  // const reg = new RegExp("requested [0-9_]{0,} cycles but the available balance is [0-9_]{0,} cycles and the freezing");

  return (
    message.includes("Please top up the canister with cycles and try again") ||
    message.includes("is out of cycles") ||
    message.includes("could not perform remote call")
  );
}

export function useInitialActorError() {
  const [open] = useErrorTip();

  useEffect(() => {
    actor.onError((error: ActorError) => {
      if (isCyclesError(error.message)) open(error.message);
    });
  }, []);
}
