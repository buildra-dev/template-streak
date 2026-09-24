import { Pressable, StyleSheet, View } from "react-native";
import { colors, radius, space } from "../theme";
import type { Habit } from "../store";
import { habitMeta } from "../lib/format";
import { HabitTile } from "./Icon";
import { StreakPill } from "./StreakPill";
import { CheckButton } from "./CheckButton";
import { Text } from "./Text";

export function HabitRow({
  habit, streak, checked, scheduled = true, onOpen, onToggle,
}: {
  habit: Pick<Habit, "name" | "icon" | "color" | "schedule" | "reminder">;
  streak: number;
  checked: boolean;
  scheduled?: boolean;
  onOpen?: () => void;
  onToggle?: () => void;
}) {
  return (
    <View style={[styles.row, !scheduled && styles.dim]}>
      <Pressable
        onPress={onOpen}
        disabled={!onOpen}
        accessibilityRole="button"
        accessibilityLabel={`${habit.name}, ${streak} day streak. Open details`}
        style={({ pressed }) => [styles.main, pressed && styles.pressed]}
      >
        <HabitTile name={habit.icon} color={habit.color} />
        <View style={styles.text}>
          <Text variant="bodyLg" numberOfLines={1}>
            {habit.name}
          </Text>
          <Text variant="caption" tone="muted" numberOfLines={1}>
            {habitMeta(habit.schedule, habit.reminder)}
          </Text>
        </View>
        <StreakPill count={streak} lit={streak > 0 && (checked || scheduled)} />
      </Pressable>
      {scheduled && onToggle ? (
        <CheckButton checked={checked} color={habit.color} onToggle={onToggle} label={`Mark ${habit.name} done today`} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    paddingStart: space.md,
    paddingEnd: space.sm,
    paddingVertical: space.md,
    minHeight: 76,
  },
  dim: { opacity: 0.72 },
  main: { flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", gap: space.md, minHeight: 48 },
  pressed: { opacity: 0.7 },
  text: { flex: 1, minWidth: 0, gap: 2 },
});
