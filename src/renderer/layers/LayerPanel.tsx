import { Eye, Layers, Plus, Trash2 } from "lucide-react";

import type { AppConfig } from "../../shared/config/appConfigSchema";

type LayerPanelProps = {
  config: AppConfig;
};

export function LayerPanel({ config }: LayerPanelProps): JSX.Element {
  return (
    <section className="panel" aria-label="Layers">
      <div className="panel-header">
        <span><Layers size={16} /> Layers</span>
        <div className="panel-actions">
          <button className="mini-button" title="Add layer" aria-label="Add layer">
            <Plus size={15} />
          </button>
          <button className="mini-button" title="Delete layer" aria-label="Delete layer">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      <div className="layer-row is-active">
        <Eye size={15} />
        <span>{config.layers.defaultLayerName}</span>
        <small>{Math.round(config.layers.defaultOpacity * 100)}%</small>
      </div>
    </section>
  );
}

