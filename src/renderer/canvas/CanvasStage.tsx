import type { AppConfig } from "../../shared/config/appConfigSchema";

type CanvasStageProps = {
  config: AppConfig;
};

export function CanvasStage({ config }: CanvasStageProps): JSX.Element {
  return (
    <section className="canvas-stage" aria-label="Drawing canvas">
      <div
        className="canvas-surface"
        style={{
          backgroundColor: config.canvas.backgroundColor,
          aspectRatio: `${config.canvas.defaultWidth} / ${config.canvas.defaultHeight}`
        }}
      />
    </section>
  );
}

