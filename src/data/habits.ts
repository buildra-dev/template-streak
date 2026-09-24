import type { SwatchKey } from "../theme";

export type IconName =
  | "droplet" | "book-open" | "footprints" | "dumbbell" | "moon" | "wind"
  | "pen-line" | "salad" | "languages" | "music" | "bike" | "leaf";

/** 0 = Sunday … 6 = Saturday */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface HabitSeed {
  id: string;
  name: string;
  icon: IconName;
  color: SwatchKey;
  schedule: Weekday[];
  /** "HH:MM", 24h, or null for no reminder */
  reminder: string | null;
  /** Sample history is generated from these three numbers (see src/lib/history.ts). */
  sample: { currentStreak: number; rate: number; seed: number };
}

export const EVERY_DAY: Weekday[] = [0, 1, 2, 3, 4, 5, 6];
export const WEEKDAYS: Weekday[] = [1, 2, 3, 4, 5];

// Habits offered on onboarding. Sample history is mock data so the app looks lived-in.
export const suggestedHabits: HabitSeed[] = [
  { id: "read", name: "Read 20 pages", icon: "book-open", color: "periwinkle", schedule: EVERY_DAY, reminder: "21:30", sample: { currentStreak: 23, rate: 0.8, seed: 7 } },
  { id: "breathe", name: "Breathe for 5 minutes", icon: "wind", color: "mint", schedule: EVERY_DAY, reminder: "08:00", sample: { currentStreak: 17, rate: 0.78, seed: 3 } },
  { id: "water", name: "Drink 2 litres of water", icon: "droplet", color: "sky", schedule: EVERY_DAY, reminder: "10:00", sample: { currentStreak: 12, rate: 0.84, seed: 11 } },
  { id: "strength", name: "Strength session", icon: "dumbbell", color: "coral", schedule: [1, 3, 5], reminder: "07:00", sample: { currentStreak: 9, rate: 0.75, seed: 5 } },
  { id: "walk", name: "Walk 8,000 steps", icon: "footprints", color: "mint", schedule: EVERY_DAY, reminder: "18:00", sample: { currentStreak: 6, rate: 0.7, seed: 13 } },
  { id: "spanish", name: "Spanish lesson", icon: "languages", color: "sky", schedule: WEEKDAYS, reminder: "12:30", sample: { currentStreak: 31, rate: 0.9, seed: 2 } },
  { id: "sleep", name: "Lights out by 23:00", icon: "moon", color: "periwinkle", schedule: EVERY_DAY, reminder: "22:30", sample: { currentStreak: 4, rate: 0.6, seed: 17 } },
  { id: "journal", name: "Journal three lines", icon: "pen-line", color: "rose", schedule: EVERY_DAY, reminder: "21:45", sample: { currentStreak: 2, rate: 0.55, seed: 19 } },
];

/** How many habits onboarding asks for. */
export const ONBOARDING_PICKS = 3;

/** Habits used by the /cover route so the gallery cover is reproducible. */
export const coverHabitIds = ["read", "breathe", "water"];
/** Of those, which are already checked today on the cover. */
export const coverCheckedToday = ["breathe", "water"];
/** Habit shown in detail on the cover. */
export const coverDetailId = "read";

/** Icons offered in the Add habit sheet. */
export const habitIcons: IconName[] = [
  "droplet", "book-open", "footprints", "dumbbell", "moon", "wind",
  "pen-line", "salad", "languages", "music", "bike", "leaf",
];

/** Reminder step for the time stepper, in minutes. */
export const REMINDER_STEP = 15;
