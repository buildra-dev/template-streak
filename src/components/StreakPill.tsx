import { Flame } from "lucide-react-native";
import { View, StyleSheet } from "react-native";
import { colors, radius, space } from "../theme";
import { copy } from "../data/copy";
import { Text } from "./Text";

export function StreakPill({ count, lit }: { count: number; lit: boolean }) {
  return (
    <View
      style={[styles.pill, lit ? styles.lit : styles.unlit]}
      accessible
      accessibilityLabel={`${count} ${copy.detail.days(count)} streak`}
    >
      <Flame size={16} strokeWidth={2.25} color={lit ? colors.streak : colors.muted} fill={lit ? colors.streak : "transparent"} />
      <Text variant="label" tone={lit ? "streak" : "muted"} style={styles.count}>
        {count}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { flexDirection: "row", alignItems: "center", gap: space.xs, paddingStart: space.sm, paddingEnd: 10, height: 28, borderRadius: radius.pill },
  lit: { backgroundColor: colors.streakSoft },
  unlit: { backgroundColor: colors.surfaceRaised },
  count: { fontVariant: ["tabular-nums"], fontSize: 14 },
});
