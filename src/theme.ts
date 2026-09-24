// Streak theme — the single place to change colours, type, spacing, radii and motion.
// Every component reads from here; no component hard-codes a hex value.

export const colors = {
  background: "#0B1026", // deep navy ground
  surface: "#141B3A", // cards, rows
  surfaceRaised: "#1C2550", // pressed / raised controls, missed days
  border: "#2A3466",
  track: "#232C5C", // empty ring and bar tracks
  foreground: "#EEF0FF", // 16.6:1 on background
  muted: "#A3ABD6", // 8.1:1 on background, 7.1:1 on surface
  primary: "#8F9CFF", // periwinkle accent, 7.4:1 on background
  onPrimary: "#0B1026",
  streak: "#FFC94D", // warm yellow, reserved for streaks and flames
  onStreak: "#241A00",
  streakSoft: "rgba(255, 201, 77, 0.14)", // streak pill ground
  primarySoft: "rgba(143, 156, 255, 0.55)", // partial-day bars
  danger: "#FF8A8A",
  overlay: "rgba(5, 8, 22, 0.72)",
} as const;

// User-selectable habit colours (the "colour" field in Add habit).
export const habitSwatches = {
  periwinkle: "#8F9CFF",
  mint: "#6FDCBF",
  sky: "#7CC4FF",
  coral: "#FF9C85",
  rose: "#F39BC9",
} as const;
export type SwatchKey = keyof typeof habitSwatches;

/** Swatch colour at a given alpha (0–1), for icon tiles and heatmap intensity. */
export function tint(key: SwatchKey, alpha: number) {
  const hex = habitSwatches[key].replace("#", "");
  const n = parseInt(hex, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

export const fonts = {
  displaySemi: "BricolageGrotesque_600SemiBold",
  display: "BricolageGrotesque_700Bold",
  displayHeavy: "BricolageGrotesque_800ExtraBold",
  body: "DMSans_400Regular",
  bodyMedium: "DMSans_500Medium",
  bodyBold: "DMSans_700Bold",
} as const;

export const type = {
  caption: 13,
  body: 15,
  bodyLg: 17,
  title: 20,
  h2: 24,
  h1: 32,
  hero: 44,
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 40 } as const;

export const radius = { sm: 10, control: 14, card: 20, sheet: 28, pill: 999 } as const;

export const motion = { tap: 180, ring: 300, enter: 320, exit: 220 } as const;

/** Minimum touch target on every interactive element. */
export const touch = 44;

export const theme = { colors, habitSwatches, fonts, type, space, radius, motion, touch };
export default theme;
