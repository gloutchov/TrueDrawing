import { ChevronDown, ChevronUp, Eye, EyeOff, Layers, Plus, Trash2 } from "lucide-react";

import type { EffectiveLocale } from "../app/uiPreferences";
import { t } from "../i18n/appI18n";
import type { AppConfig } from "../../shared/config/appConfigSchema";
import type { DrawingDocument, DrawingLayer } from "../../shared/document/documentTypes";

type LayerPanelProps = {
  config: AppConfig;
  locale: EffectiveLocale;
  document: DrawingDocument;
  onAddLayer: () => void;
  onRenameLayer: (layerId: string, name: string) => void;
  onDeleteLayer: (layerId: string) => void;
  onSelectLayer: (layerId: string) => void;
  onSetLayerVisibility: (layerId: string, visible: boolean) => void;
  onSetLayerOpacity: (layerId: string, opacity: number) => void;
  onMoveLayer: (layerId: string, direction: "up" | "down") => void;
};

export function LayerPanel({
  config,
  locale,
  document,
  onAddLayer,
  onRenameLayer,
  onDeleteLayer,
  onSelectLayer,
  onSetLayerVisibility,
  onSetLayerOpacity,
  onMoveLayer
}: LayerPanelProps): JSX.Element {
  const activeLayer = document.layers.find((layer) => layer.id === document.activeLayerId);
  const canDeleteLayer = document.layers.length > 1 && activeLayer !== undefined;
  const canAddLayer = document.layers.length < config.layers.maxLayers;
  const layerRows = [...document.layers].reverse();

  return (
    <section className="panel" aria-label={t(locale, "layers")}>
      <div className="panel-header">
        <span><Layers size={16} /> {t(locale, "layers")}</span>
        <div className="panel-actions">
          <button
            className="mini-button"
            title={t(locale, "addLayer")}
            aria-label={t(locale, "addLayer")}
            disabled={!canAddLayer}
            onClick={onAddLayer}
          >
            <Plus size={15} />
          </button>
          <button
            className="mini-button"
            title={t(locale, "deleteActiveLayer")}
            aria-label={t(locale, "deleteActiveLayer")}
            disabled={!canDeleteLayer}
            onClick={() => activeLayer && onDeleteLayer(activeLayer.id)}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      <div className="layer-list">
        {layerRows.map((layer) => {
          const sourceIndex = document.layers.findIndex((documentLayer) => documentLayer.id === layer.id);
          const isActive = layer.id === document.activeLayerId;

          return (
            <LayerRow
              key={layer.id}
              config={config}
              locale={locale}
              layer={layer}
              isActive={isActive}
              canMoveUp={sourceIndex < document.layers.length - 1}
              canMoveDown={sourceIndex > 0}
              onRenameLayer={onRenameLayer}
              onSelectLayer={onSelectLayer}
              onSetLayerVisibility={onSetLayerVisibility}
              onSetLayerOpacity={onSetLayerOpacity}
              onMoveLayer={onMoveLayer}
            />
          );
        })}
      </div>
    </section>
  );
}

type LayerRowProps = {
  config: AppConfig;
  locale: EffectiveLocale;
  layer: DrawingLayer;
  isActive: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onRenameLayer: (layerId: string, name: string) => void;
  onSelectLayer: (layerId: string) => void;
  onSetLayerVisibility: (layerId: string, visible: boolean) => void;
  onSetLayerOpacity: (layerId: string, opacity: number) => void;
  onMoveLayer: (layerId: string, direction: "up" | "down") => void;
};

function LayerRow({
  config,
  locale,
  layer,
  isActive,
  canMoveUp,
  canMoveDown,
  onRenameLayer,
  onSelectLayer,
  onSetLayerVisibility,
  onSetLayerOpacity,
  onMoveLayer
}: LayerRowProps): JSX.Element {
  return (
    <div
      className={`layer-row${isActive ? " is-active" : ""}`}
      onClick={() => onSelectLayer(layer.id)}
    >
      <button
        className="mini-button"
        title={layer.visible ? "Hide layer" : "Show layer"}
        aria-label={layer.visible ? "Hide layer" : "Show layer"}
        aria-pressed={layer.visible}
        onClick={(event) => {
          event.stopPropagation();
          onSetLayerVisibility(layer.id, !layer.visible);
        }}
      >
        {layer.visible ? <Eye size={15} /> : <EyeOff size={15} />}
      </button>
      <input
        className="layer-name-input"
        aria-label={t(locale, "layerName")}
        value={layer.name}
        onClick={(event) => event.stopPropagation()}
        onFocus={() => onSelectLayer(layer.id)}
        onChange={(event) => onRenameLayer(layer.id, event.currentTarget.value)}
      />
      <input
        className="layer-opacity-input"
        aria-label={t(locale, "layerOpacity")}
        type="range"
        min={config.layers.opacityRange.min}
        max={config.layers.opacityRange.max}
        step={config.layers.opacityRange.step}
        value={layer.opacity}
        onClick={(event) => event.stopPropagation()}
        onFocus={() => onSelectLayer(layer.id)}
        onChange={(event) => onSetLayerOpacity(layer.id, event.currentTarget.valueAsNumber)}
      />
      <small>{Math.round(layer.opacity * 100)}%</small>
      <div className="layer-order-controls">
        <button
          className="mini-button"
          title="Move layer up"
          aria-label="Move layer up"
          disabled={!canMoveUp}
          onClick={(event) => {
            event.stopPropagation();
            onMoveLayer(layer.id, "up");
          }}
        >
          <ChevronUp size={14} />
        </button>
        <button
          className="mini-button"
          title="Move layer down"
          aria-label="Move layer down"
          disabled={!canMoveDown}
          onClick={(event) => {
            event.stopPropagation();
            onMoveLayer(layer.id, "down");
          }}
        >
          <ChevronDown size={14} />
        </button>
      </div>
    </div>
  );
}

