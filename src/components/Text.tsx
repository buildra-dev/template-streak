import { Text as RNText, StyleSheet, type TextProps } from "react-native";
import { colors, fonts, type } from "../theme";

type Variant = "hero" | "h1" | "h2" | "title" | "bodyLg" | "body" | "bodyMedium" | "label" | "caption" | "numeral";
type Tone = "default" | "muted" | "primary" | "streak" | "danger" | "onPrimary";

const toneColor: Record<Tone, string> = {
  default: colors.foreground,
  muted: colors.muted,
  primary: colors.primary,
  streak: colors.streak,
  danger: colors.danger,
  onPrimary: colors.onPrimary,
};

export function Text({ variant = "body", tone = "default", style, ...rest }: TextProps & { variant?: Variant; tone?: Tone }) {
  return <RNText {...rest} style={[styles[variant], { color: toneColor[tone] }, style]} />;
}

const styles = StyleSheet.create({
  hero: { fontFamily: fonts.displayHeavy, fontSize: type.hero, lineHeight: type.hero * 1.05, letterSpacing: -1 },
  h1: { fontFamily: fonts.display, fontSize: type.h1, lineHeight: type.h1 * 1.15, letterSpacing: -0.6 },
  h2: { fontFamily: fonts.display, fontSize: type.h2, lineHeight: type.h2 * 1.2, letterSpacing: -0.3 },
  title: { fontFamily: fonts.displaySemi, fontSize: type.title, lineHeight: type.title * 1.25 },
  bodyLg: { fontFamily: fonts.bodyMedium, fontSize: type.bodyLg, lineHeight: type.bodyLg * 1.4 },
  body: { fontFamily: fonts.body, fontSize: type.body, lineHeight: type.body * 1.5 },
  bodyMedium: { fontFamily: fonts.bodyMedium, fontSize: type.body, lineHeight: type.body * 1.45 },
  label: { fontFamily: fonts.bodyBold, fontSize: type.caption, lineHeight: type.caption * 1.4, letterSpacing: 0.4 },
  caption: { fontFamily: fonts.body, fontSize: type.caption, lineHeight: type.caption * 1.45 },
  numeral: { fontFamily: fonts.displayHeavy, fontSize: type.h1, lineHeight: type.h1 * 1.05, fontVariant: ["tabular-nums"] },
});
