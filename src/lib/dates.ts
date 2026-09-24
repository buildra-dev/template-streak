export type DayKey = string; // "YYYY-MM-DD" in local time

export function keyOf(d: Date): DayKey {
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function addDays(d: Date, n: number) {
  const r = startOfDay(d);
  r.setDate(r.getDate() + n);
  return r;
}

/** Monday of the week containing d. */
export function startOfWeek(d: Date) {
  const offset = (d.getDay() + 6) % 7;
  return addDays(d, -offset);
}

export function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

/** "21:30" → "9:30 PM" */
export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${`${m}`.padStart(2, "0")} ${suffix}`;
}

export function shiftTime(hhmm: string, minutes: number) {
  const [h, m] = hhmm.split(":").map(Number);
  const total = (((h * 60 + m + minutes) % 1440) + 1440) % 1440;
  return `${`${Math.floor(total / 60)}`.padStart(2, "0")}:${`${total % 60}`.padStart(2, "0")}`;
}
