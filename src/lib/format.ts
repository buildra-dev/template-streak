import { copy } from "../data/copy";
import { EVERY_DAY, WEEKDAYS, type Weekday } from "../data/habits";
import { formatTime } from "./dates";

const same = (a: Weekday[], b: Weekday[]) => a.length === b.length && b.every((d) => a.includes(d));

export function scheduleLabel(schedule: Weekday[]) {
  if (same(schedule, EVERY_DAY)) return copy.add.everyDay;
  if (same(schedule, WEEKDAYS)) return copy.add.weekdays;
  const order: Weekday[] = [1, 2, 3, 4, 5, 6, 0];
  return order.filter((d) => schedule.includes(d)).map((d) => copy.weekdaysMedium[d]).join(", ");
}

export function habitMeta(schedule: Weekday[], reminder: string | null) {
  return reminder ? `${scheduleLabel(schedule)} · ${formatTime(reminder)}` : scheduleLabel(schedule);
}

/** Monday-first order used by every week and calendar view. */
export const WEEK_ORDER: Weekday[] = [1, 2, 3, 4, 5, 6, 0];
