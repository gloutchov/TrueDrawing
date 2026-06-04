import { useCallback, useState } from "react";

import {
  canRedo,
  canUndo,
  commitHistory,
  createHistory,
  redoHistory,
  replacePresent,
  undoHistory
} from "../../shared/history/historyModel";
import type { DrawingStroke } from "../../shared/drawing/strokeTypes";

export function useStrokeHistory(limit: number) {
  const [history, setHistory] = useState(() => createHistory<DrawingStroke[]>([], limit));

  const appendStroke = useCallback((stroke: DrawingStroke) => {
    setHistory((currentHistory) => commitHistory(currentHistory, [
      ...currentHistory.present,
      stroke
    ]));
  }, []);

  const updateStroke = useCallback((
    strokeId: string,
    updater: (stroke: DrawingStroke) => DrawingStroke
  ) => {
    setHistory((currentHistory) => replacePresent(currentHistory, currentHistory.present.map((stroke) => {
      if (stroke.id !== strokeId) {
        return stroke;
      }

      return updater(stroke);
    })));
  }, []);

  const undo = useCallback(() => {
    setHistory((currentHistory) => undoHistory(currentHistory));
  }, []);

  const redo = useCallback(() => {
    setHistory((currentHistory) => redoHistory(currentHistory));
  }, []);

  return {
    strokes: history.present,
    canUndo: canUndo(history),
    canRedo: canRedo(history),
    appendStroke,
    updateStroke,
    undo,
    redo
  };
}
