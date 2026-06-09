import { useCallback, useMemo, useState } from "react";

import type { AppConfig } from "../../shared/config/appConfigSchema";
import {
  addLayer,
  appendStrokeToActiveLayer,
  createInitialDrawingDocument,
  deleteLayer,
  moveLayer,
  renameLayer,
  selectLayer,
  setLayerOpacity,
  setLayerVisibility,
  setRealisticImage,
  updateStrokeInDocument
} from "../../shared/document/layerModel";
import type { DrawingDocument } from "../../shared/document/documentTypes";
import type { DrawingStroke } from "../../shared/drawing/strokeTypes";
import type { StoredRealisticImage } from "../../shared/image-generation/imageGenerationTypes";
import {
  canRedo,
  canUndo,
  commitHistory,
  createHistory,
  redoHistory,
  replacePresent,
  undoHistory
} from "../../shared/history/historyModel";

export function useDrawingDocumentHistory(config: AppConfig) {
  const [history, setHistory] = useState(() => createHistory<DrawingDocument>(
    createInitialDrawingDocument({
      id: crypto.randomUUID(),
      name: config.layers.defaultLayerName,
      opacity: config.layers.defaultOpacity
    }),
    config.app.historyLimit
  ));

  const document = history.present;
  const activeLayer = useMemo(() => (
    document.layers.find((layer) => layer.id === document.activeLayerId)
  ), [document]);

  const appendStroke = useCallback((stroke: DrawingStroke) => {
    setHistory((currentHistory) => commitHistory(
      currentHistory,
      appendStrokeToActiveLayer(currentHistory.present, stroke)
    ));
  }, []);

  const updateStroke = useCallback((
    strokeId: string,
    updater: (stroke: DrawingStroke) => DrawingStroke
  ) => {
    setHistory((currentHistory) => replacePresent(
      currentHistory,
      updateStrokeInDocument(currentHistory.present, strokeId, updater)
    ));
  }, []);

  const addDocumentLayer = useCallback(() => {
    setHistory((currentHistory) => {
      const nextLayerNumber = currentHistory.present.layers.length + 1;

      return commitHistory(currentHistory, addLayer(
        currentHistory.present,
        {
          id: crypto.randomUUID(),
          name: `${config.layers.newLayerNamePrefix} ${nextLayerNumber}`,
          opacity: config.layers.defaultOpacity
        },
        config.layers.maxLayers
      ));
    });
  }, [
    config.layers.defaultOpacity,
    config.layers.maxLayers,
    config.layers.newLayerNamePrefix
  ]);

  const renameDocumentLayer = useCallback((layerId: string, name: string) => {
    setHistory((currentHistory) => commitHistory(
      currentHistory,
      renameLayer(currentHistory.present, layerId, name)
    ));
  }, []);

  const deleteDocumentLayer = useCallback((layerId: string) => {
    setHistory((currentHistory) => commitHistory(
      currentHistory,
      deleteLayer(currentHistory.present, layerId)
    ));
  }, []);

  const selectDocumentLayer = useCallback((layerId: string) => {
    setHistory((currentHistory) => replacePresent(
      currentHistory,
      selectLayer(currentHistory.present, layerId)
    ));
  }, []);

  const setDocumentLayerVisibility = useCallback((layerId: string, visible: boolean) => {
    setHistory((currentHistory) => commitHistory(
      currentHistory,
      setLayerVisibility(currentHistory.present, layerId, visible)
    ));
  }, []);

  const setDocumentLayerOpacity = useCallback((layerId: string, opacity: number) => {
    setHistory((currentHistory) => commitHistory(
      currentHistory,
      setLayerOpacity(currentHistory.present, layerId, opacity)
    ));
  }, []);

  const moveDocumentLayer = useCallback((layerId: string, direction: "up" | "down") => {
    setHistory((currentHistory) => commitHistory(
      currentHistory,
      moveLayer(currentHistory.present, layerId, direction)
    ));
  }, []);

  const setDocumentRealisticImage = useCallback((realisticImage: StoredRealisticImage) => {
    setHistory((currentHistory) => commitHistory(
      currentHistory,
      setRealisticImage(currentHistory.present, realisticImage)
    ));
  }, []);

  const replaceDocument = useCallback((nextDocument: DrawingDocument) => {
    setHistory(createHistory(nextDocument, config.app.historyLimit));
  }, [config.app.historyLimit]);

  const undo = useCallback(() => {
    setHistory((currentHistory) => undoHistory(currentHistory));
  }, []);

  const redo = useCallback(() => {
    setHistory((currentHistory) => redoHistory(currentHistory));
  }, []);

  return {
    document,
    activeLayer,
    canUndo: canUndo(history),
    canRedo: canRedo(history),
    appendStroke,
    updateStroke,
    addLayer: addDocumentLayer,
    renameLayer: renameDocumentLayer,
    deleteLayer: deleteDocumentLayer,
    selectLayer: selectDocumentLayer,
    setLayerVisibility: setDocumentLayerVisibility,
    setLayerOpacity: setDocumentLayerOpacity,
    moveLayer: moveDocumentLayer,
    setRealisticImage: setDocumentRealisticImage,
    replaceDocument,
    undo,
    redo
  };
}
