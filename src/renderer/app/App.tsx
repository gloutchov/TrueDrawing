import { AppShell } from "./AppShell";
import { useAppBootstrap } from "./useAppBootstrap";

export function App(): JSX.Element {
  const bootstrap = useAppBootstrap();

  if (bootstrap.status === "loading") {
    return <div className="boot-state" aria-live="polite" />;
  }

  if (bootstrap.status === "error") {
    return (
      <main className="boot-state boot-state--error">
        <h1>True Drawing</h1>
        <p>{bootstrap.message}</p>
      </main>
    );
  }

  return <AppShell config={bootstrap.config} runtime={bootstrap.runtime} />;
}

