import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { Check } from "lucide-react-native";
import { colors, habitSwatches, radius, space } from "../theme";
import { copy } from "../data/copy";
import { ONBOARDING_PICKS, suggestedHabits } from "../data/habits";
import { images } from "../data/images";
import { useStore } from "../store";
import { habitMeta } from "../lib/format";
import { Button } from "../components/Button";
import { HabitTile } from "../components/Icon";
import { Text } from "../components/Text";

const HERO_HEIGHT = 280;

export function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { onboard } = useStore();
  const [picked, setPicked] = useState<string[]>([]);
  const remaining = ONBOARDING_PICKS - picked.length;

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length < ONBOARDING_PICKS ? [...p, id] : p));

  const start = () => {
    onboard(picked);
    router.replace("/today");
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: space.xxxl }} showsVerticalScrollIndicator={false}>
        {/* Decorative backdrop: a deliberate cover crop that fades into the navy ground. */}
        <View style={styles.hero} accessible accessibilityRole="image" accessibilityLabel={images.onboarding.alt}>
          <Image source={{ uri: images.onboarding.uri }} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="top" transition={200} />
          <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
            <Defs>
              <LinearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={colors.background} stopOpacity="0.1" />
                <Stop offset="0.6" stopColor={colors.background} stopOpacity="0.45" />
                <Stop offset="1" stopColor={colors.background} stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#fade)" />
          </Svg>
        </View>

        <View style={[styles.intro, { marginTop: -96 }]}>
          <Text variant="label" tone="streak">
            {copy.onboarding.eyebrow.toUpperCase()}
          </Text>
          <Text variant="hero" accessibilityRole="header">
            {copy.onboarding.title}
          </Text>
          <Text variant="body" tone="muted" style={styles.body}>
            {copy.onboarding.body}
          </Text>
        </View>

        <View style={styles.list} accessibilityLabel={copy.onboarding.hint}>
          {suggestedHabits.map((h) => {
            const on = picked.includes(h.id);
            const locked = !on && remaining === 0;
            return (
              <Pressable
                key={h.id}
                onPress={() => toggle(h.id)}
                disabled={locked}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: on, disabled: locked }}
                accessibilityLabel={`${h.name}, ${habitMeta(h.schedule, h.reminder)}`}
                style={({ pressed }) => [styles.option, on && { borderColor: habitSwatches[h.color] }, locked && styles.locked, pressed && styles.pressed]}
              >
                <HabitTile name={h.icon} color={h.color} />
                <View style={styles.optionText}>
                  <Text variant="bodyLg" numberOfLines={1}>
                    {h.name}
                  </Text>
                  <Text variant="caption" tone="muted" numberOfLines={1}>
                    {habitMeta(h.schedule, h.reminder)}
                  </Text>
                </View>
                <View style={[styles.tick, on ? { backgroundColor: habitSwatches[h.color], borderColor: habitSwatches[h.color] } : null]}>
                  {on ? <Check size={18} strokeWidth={3} color={colors.onPrimary} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + space.md }]}>
        <View style={styles.dots} accessible accessibilityLabel={`${picked.length} of ${ONBOARDING_PICKS} picked`}>
          {Array.from({ length: ONBOARDING_PICKS }, (_, i) => (
            <View key={i} style={[styles.dot, i < picked.length && styles.dotOn]} />
          ))}
        </View>
        <Button label={copy.onboarding.remaining(remaining)} onPress={start} disabled={remaining !== 0} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  hero: { height: HERO_HEIGHT, backgroundColor: colors.surface },
  intro: { paddingHorizontal: space.xl, gap: space.sm },
  body: { maxWidth: 340 },
  list: { paddingHorizontal: space.xl, marginTop: space.xxl, gap: space.sm },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    minHeight: 72,
    paddingHorizontal: space.md,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: "transparent",
  },
  locked: { opacity: 0.5 },
  pressed: { opacity: 0.8 },
  optionText: { flex: 1, minWidth: 0, gap: 2 },
  tick: { width: 28, height: 28, borderRadius: radius.pill, borderWidth: 2, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  footer: { paddingHorizontal: space.xl, paddingTop: space.md, gap: space.md, backgroundColor: colors.background, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  dots: { flexDirection: "row", justifyContent: "center", gap: space.sm },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.surfaceRaised },
  dotOn: { backgroundColor: colors.streak, width: 24 },
});
