import { useEffect, useState } from "react";
import { Ruler, X } from "lucide-react";

import type { EffectiveLocale } from "../app/uiPreferences";
import { t } from "../i18n/appI18n";
import type { AppConfig } from "../../shared/config/appConfigSchema";
import {
  cmToPixels,
  pixelsToCm,
  validateCanvasDimensions,
  type CanvasDimensions
} from "../../shared/document/canvasDimensions";

type Props = {
  config: AppConfig;
  locale: EffectiveLocale;
  canvas: CanvasDimensions;
  onApply: (canvas: CanvasDimensions) => void;
  onClose?: () => void;
};

type Unit = "px" | "cm";

export function CanvasDimensionsEditor({ config, locale, canvas, onApply, onClose }: Props): JSX.Element {
  const [unit, setUnit] = useState<Unit>("px");
  const [width, setWidth] = useState(String(canvas.width));
  const [height, setHeight] = useState(String(canvas.height));
  const [dpi, setDpi] = useState(String(canvas.dpi));
  const limits = config.canvas.dimensions;

  useEffect(() => {
    setWidth(formatLength(canvas.width, unit, canvas.dpi));
    setHeight(formatLength(canvas.height, unit, canvas.dpi));
    setDpi(String(canvas.dpi));
  }, [canvas.width, canvas.height, canvas.dpi]);

  const parsedDpi = Number(dpi);
  const parsedWidth = Number(width);
  const parsedHeight = Number(height);
  const hasValues = width.trim() !== "" && height.trim() !== "" && dpi.trim() !== "";
  const nextCanvas = hasValues && Number.isFinite(parsedWidth) && Number.isFinite(parsedHeight)
    && Number.isFinite(parsedDpi)
    ? {
      width: unit === "cm" ? cmToPixels(parsedWidth, parsedDpi) : parsedWidth,
      height: unit === "cm" ? cmToPixels(parsedHeight, parsedDpi) : parsedHeight,
      dpi: parsedDpi
    }
    : null;
  let error: string | null = null;
  if (nextCanvas) {
    try {
      validateCanvasDimensions(nextCanvas, limits);
    } catch {
      error = t(locale, "canvasSizeInvalid");
    }
  } else {
    error = t(locale, "canvasSizeInvalid");
  }
  const isUnchanged = nextCanvas?.width === canvas.width
    && nextCanvas?.height === canvas.height && nextCanvas?.dpi === canvas.dpi;

  const changeUnit = (nextUnit: Unit) => {
    const source = nextCanvas && !error ? nextCanvas : canvas;
    setUnit(nextUnit);
    setWidth(formatLength(source.width, nextUnit, source.dpi));
    setHeight(formatLength(source.height, nextUnit, source.dpi));
  };

  const fields = (
    <>
      <div className="canvas-size-fields">
        <label className="field">
          <span>{t(locale, "canvasUnit")}</span>
          <select value={unit} onChange={(event) => changeUnit(event.currentTarget.value as Unit)}>
            <option value="px">px</option>
            <option value="cm">cm</option>
          </select>
        </label>
        <label className="field">
          <span>{t(locale, "canvasDpi")}</span>
          <input type="number" min={limits.minDpi} max={limits.maxDpi} step="1"
            value={dpi} onChange={(event) => setDpi(event.currentTarget.value)} />
        </label>
        <label className="field">
          <span>{t(locale, "canvasWidth")}</span>
          <input type="number" min="0" step={unit === "px" ? "1" : "0.001"}
            value={width} onChange={(event) => setWidth(event.currentTarget.value)} />
        </label>
        <label className="field">
          <span>{t(locale, "canvasHeight")}</span>
          <input type="number" min="0" step={unit === "px" ? "1" : "0.001"}
            value={height} onChange={(event) => setHeight(event.currentTarget.value)} />
        </label>
      </div>
      <p className="canvas-size-readout">
        {nextCanvas && !error
          ? `${nextCanvas.width} × ${nextCanvas.height} px · ${pixelsToCm(nextCanvas.width, nextCanvas.dpi).toFixed(2)} × ${pixelsToCm(nextCanvas.height, nextCanvas.dpi).toFixed(2)} cm`
          : t(locale, "canvasSizeInvalid")}
      </p>
      <p className="canvas-size-help">{t(locale, "canvasSizeHelp")}</p>
    </>
  );

  const apply = () => {
    if (nextCanvas && !error && !isUnchanged) {
      onApply(nextCanvas);
    }
  };

  if (onClose) {
    return (
      <div className="modal-backdrop" role="presentation">
        <section className="modal" role="dialog" aria-modal="true" aria-label={t(locale, "canvasSize")}>
          <div className="modal-header">
            <span><Ruler size={17} /> {t(locale, "canvasSize")}</span>
            <button className="mini-button" type="button" aria-label={t(locale, "close")} onClick={onClose}><X size={16} /></button>
          </div>
          <div className="modal-body">{fields}</div>
          <div className="modal-actions">
            <button className="text-button" type="button" onClick={onClose}>{t(locale, "cancel")}</button>
            <button className="text-button text-button--primary" type="button" disabled={Boolean(error) || isUnchanged} onClick={apply}>
              {t(locale, "apply")}
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <section className="panel canvas-size-panel" aria-label={t(locale, "canvasSize")}>
      <div className="panel-header"><span><Ruler size={16} /> {t(locale, "canvasSize")}</span></div>
      <div className="canvas-size-body">
        {fields}
        <button className="text-button text-button--primary" type="button" disabled={Boolean(error) || isUnchanged} onClick={apply}>
          {t(locale, "apply")}
        </button>
      </div>
    </section>
  );
}

function formatLength(pixels: number, unit: Unit, dpi: number): string {
  return unit === "px" ? String(pixels) : pixelsToCm(pixels, dpi).toFixed(3);
}
