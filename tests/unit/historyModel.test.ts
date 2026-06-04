import { describe, expect, it } from "vitest";

import {
  canRedo,
  canUndo,
  commitHistory,
  createHistory,
  redoHistory,
  replacePresent,
  undoHistory
} from "../../src/shared/history/historyModel";

describe("history model", () => {
  it("commits present states and supports undo and redo", () => {
    const initialHistory = createHistory<string[]>([], 10);
    const firstCommit = commitHistory(initialHistory, ["stroke-1"]);
    const secondCommit = commitHistory(firstCommit, ["stroke-1", "stroke-2"]);

    expect(canUndo(secondCommit)).toBe(true);

    const undone = undoHistory(secondCommit);
    expect(undone.present).toEqual(["stroke-1"]);
    expect(canRedo(undone)).toBe(true);

    const redone = redoHistory(undone);
    expect(redone.present).toEqual(["stroke-1", "stroke-2"]);
  });

  it("limits past states to the configured history limit", () => {
    const history = [1, 2, 3].reduce(
      (currentHistory, value) => commitHistory(currentHistory, value),
      createHistory(0, 2)
    );

    expect(history.past).toEqual([1, 2]);
  });

  it("replaces the present state without adding an undo step", () => {
    const history = commitHistory(createHistory(["stroke-1"], 10), ["stroke-1", "stroke-2"]);
    const replaced = replacePresent(history, ["stroke-1", "stroke-2-updated"]);

    expect(replaced.past).toEqual([["stroke-1"]]);
    expect(replaced.present).toEqual(["stroke-1", "stroke-2-updated"]);
  });
});
