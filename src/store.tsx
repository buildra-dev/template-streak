import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import { suggestedHabits, type HabitSeed, type IconName, type Weekday } from "./data/habits";
import type { SwatchKey } from "./theme";
import { keyOf } from "./lib/dates";
import { sampleHistory, type History } from "./lib/history";

// Local mock state only — nothing is persisted or sent anywhere.

export interface Habit {
  id: string;
  name: string;
  icon: IconName;
  color: SwatchKey;
  schedule: Weekday[];
  reminder: string | null;
  history: History;
}

export interface NewHabit {
  name: string;
  icon: IconName;
  color: SwatchKey;
  schedule: Weekday[];
  reminder: string | null;
}

interface State {
  onboarded: boolean;
  habits: Habit[];
}

type Action =
  | { type: "onboard"; ids: string[] }
  | { type: "toggleToday"; id: string }
  | { type: "add"; habit: NewHabit }
  | { type: "setReminder"; id: string; reminder: string | null }
  | { type: "delete"; id: string };

export function habitFromSeed(seed: HabitSeed): Habit {
  const { sample: _sample, ...rest } = seed;
  return { ...rest, history: sampleHistory(seed) };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "onboard": {
      const picked = suggestedHabits.filter((s) => action.ids.includes(s.id)).map(habitFromSeed);
      return { onboarded: true, habits: picked };
    }
    case "toggleToday": {
      const today = keyOf(new Date());
      return {
        ...state,
        habits: state.habits.map((h) => {
          if (h.id !== action.id) return h;
          const history = { ...h.history };
          if (history[today]) delete history[today];
          else history[today] = true;
          return { ...h, history };
        }),
      };
    }
    case "add": {
      const id = `${action.habit.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`;
      return { ...state, habits: [...state.habits, { ...action.habit, id, history: {} }] };
    }
    case "setReminder":
      return { ...state, habits: state.habits.map((h) => (h.id === action.id ? { ...h, reminder: action.reminder } : h)) };
    case "delete":
      return { ...state, habits: state.habits.filter((h) => h.id !== action.id) };
  }
}

interface Store extends State {
  onboard: (ids: string[]) => void;
  toggleToday: (id: string) => void;
  addHabit: (habit: NewHabit) => void;
  setReminder: (id: string, reminder: string | null) => void;
  deleteHabit: (id: string) => void;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children, initial }: { children: ReactNode; initial?: State }) {
  const [state, dispatch] = useReducer(reducer, initial ?? { onboarded: false, habits: [] });
  const store = useMemo<Store>(
    () => ({
      ...state,
      onboard: (ids) => dispatch({ type: "onboard", ids }),
      toggleToday: (id) => dispatch({ type: "toggleToday", id }),
      addHabit: (habit) => dispatch({ type: "add", habit }),
      setReminder: (id, reminder) => dispatch({ type: "setReminder", id, reminder }),
      deleteHabit: (id) => dispatch({ type: "delete", id }),
    }),
    [state],
  );
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore must be used inside <StoreProvider>");
  return store;
}
