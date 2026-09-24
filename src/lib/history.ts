import type { HabitSeed, Weekday } from "../data/habits";
import { addDays, keyOf, startOfDay, type DayKey } from "./dates";

export type History = Record<DayKey, true>;

const HISTORY_DAYS = 120;

/** Deterministic pseudo-random in [0, 1). */
function rand(seed: number, i: number) {
  const x = Math.sin(seed * 9301 + i * 49297) * 233280;
  return x - Math.floor(x);
}

/**
 * Builds mock history ending yesterday: the last `currentStreak` scheduled days are done,
 * the scheduled day before them is missed, and older days are done at roughly `rate`.
 */
export function sampleHistory(seed: HabitSeed, today = new Date()): History {
  const history: History = {};
  let scheduledSeen = 0;
  for (let i = 1; i <= HISTORY_DAYS; i++) {
    const day = addDays(today, -i);
    if (!seed.schedule.includes(day.getDay() as Weekday)) continue;
    scheduledSeen++;
    const inStreak = scheduledSeen <= seed.sample.currentStreak;
    const breaker = scheduledSeen === seed.sample.currentStreak + 1;
    if (inStreak || (!breaker && rand(seed.sample.seed, i) < seed.sample.rate)) history[keyOf(day)] = true;
  }
  return history;
}

export function isScheduled(schedule: Weekday[], d: Date) {
  return schedule.includes(d.getDay() as Weekday);
}

/** Consecutive scheduled days done, counting back from today (an unchecked today doesn't break it). */
export function currentStreak(history: History, schedule: Weekday[], today = new Date()) {
  let streak = 0;
  for (let i = 0; i <= HISTORY_DAYS; i++) {
    const d = addDays(today, -i);
    if (!isScheduled(schedule, d)) continue;
    if (history[keyOf(d)]) streak++;
    else if (i === 0) continue;
    else break;
  }
  return streak;
}

export function bestStreak(history: History, schedule: Weekday[], today = new Date()) {
  let best = 0;
  let run = 0;
  for (let i = HISTORY_DAYS; i >= 0; i--) {
    const d = addDays(today, -i);
    if (!isScheduled(schedule, d)) continue;
    if (history[keyOf(d)]) {
      run++;
      best = Math.max(best, run);
    } else if (i !== 0) run = 0;
  }
  return best;
}

/** Length of the run a done day belongs to, up to that day — drives heatmap intensity. */
export function runLengthAt(history: History, schedule: Weekday[], day: Date) {
  let run = 0;
  for (let i = 0; i <= HISTORY_DAYS; i++) {
    const d = addDays(day, -i);
    if (!isScheduled(schedule, d)) continue;
    if (history[keyOf(d)]) run++;
    else break;
  }
  return run;
}

/** Share of scheduled days done in the `days` days ending `endOffset` days before today. */
export function completionRate(
  habits: { history: History; schedule: Weekday[] }[],
  days = 30,
  endOffset = 0,
  today = new Date(),
) {
  let scheduled = 0;
  let done = 0;
  const base = startOfDay(today);
  for (let i = endOffset; i < endOffset + days; i++) {
    const d = addDays(base, -i);
    for (const h of habits) {
      if (!isScheduled(h.schedule, d)) continue;
      // Today only counts once it's checked, so an unfinished day doesn't drag the rate down.
      if (i === 0 && !h.history[keyOf(d)]) continue;
      scheduled++;
      if (h.history[keyOf(d)]) done++;
    }
  }
  return scheduled === 0 ? 0 : done / scheduled;
}
