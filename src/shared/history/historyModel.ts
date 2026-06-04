export type HistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
  limit: number;
};

export function createHistory<T>(present: T, limit: number): HistoryState<T> {
  return {
    past: [],
    present,
    future: [],
    limit
  };
}

export function commitHistory<T>(state: HistoryState<T>, present: T): HistoryState<T> {
  if (Object.is(state.present, present)) {
    return state;
  }

  return {
    ...state,
    past: [...state.past, state.present].slice(-state.limit),
    present,
    future: []
  };
}

export function replacePresent<T>(state: HistoryState<T>, present: T): HistoryState<T> {
  return {
    ...state,
    present
  };
}

export function undoHistory<T>(state: HistoryState<T>): HistoryState<T> {
  const previous = state.past.at(-1);

  if (previous === undefined) {
    return state;
  }

  return {
    ...state,
    past: state.past.slice(0, -1),
    present: previous,
    future: [state.present, ...state.future]
  };
}

export function redoHistory<T>(state: HistoryState<T>): HistoryState<T> {
  const next = state.future[0];

  if (next === undefined) {
    return state;
  }

  return {
    ...state,
    past: [...state.past, state.present].slice(-state.limit),
    present: next,
    future: state.future.slice(1)
  };
}

export function canUndo<T>(state: HistoryState<T>): boolean {
  return state.past.length > 0;
}

export function canRedo<T>(state: HistoryState<T>): boolean {
  return state.future.length > 0;
}
