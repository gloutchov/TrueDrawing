import { Image, RefreshCw } from "lucide-react";

import type { AppConfig } from "../../shared/config/appConfigSchema";

type InspectorPanelProps = {
  config: AppConfig;
};

export function InspectorPanel({ config }: InspectorPanelProps): JSX.Element {
  return (
    <section className="panel inspector-panel" aria-label="Realistic image inspector">
      <div className="panel-header">
        <span><Image size={16} /> Inspector</span>
        <button className="mini-button" title="Generate image" aria-label="Generate image">
          <RefreshCw size={15} />
        </button>
      </div>
      <div className="inspector-preview">
        <Image size={34} />
      </div>
      <dl className="inspector-meta">
        <div>
          <dt>Provider</dt>
          <dd>{config.imageGeneration.defaultProvider}</dd>
        </div>
        <div>
          <dt>Model</dt>
          <dd>{config.imageGeneration.defaultModel}</dd>
        </div>
      </dl>
    </section>
  );
}

