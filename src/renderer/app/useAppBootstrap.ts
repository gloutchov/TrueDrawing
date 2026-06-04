import { useEffect, useState } from "react";

import type { AppConfig } from "../../shared/config/appConfigSchema";
import type { RuntimeInfo } from "../../shared/runtime/runtimeInfo";

type BootstrapState =
  | { status: "loading" }
  | { status: "ready"; config: AppConfig; runtime: RuntimeInfo }
  | { status: "error"; message: string };

export function useAppBootstrap(): BootstrapState {
  const [state, setState] = useState<BootstrapState>({ status: "loading" });

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      window.trueDrawing.getAppConfig(),
      window.trueDrawing.getRuntimeInfo()
    ]).then(([config, runtime]) => {
      if (isMounted) {
        setState({ status: "ready", config, runtime });
      }
    }).catch((error: unknown) => {
      if (isMounted) {
        setState({
          status: "error",
          message: error instanceof Error ? error.message : "Unable to load app configuration."
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}

