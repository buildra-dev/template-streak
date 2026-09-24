import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Flame } from "lucide-react-native";
import { colors, habitSwatches, radius, space } from "../theme";
import { copy } from "../data/copy";
import { useStore } from "../store";
import { addDays, keyOf, startOfDay, startOfWeek } from "../lib/dates";
import { completionRate, currentStreak, isScheduled } from "../lib/history";
import { Card } from "../components/Card";
import { HabitTile } from "../components/Icon";
import { Text } from "../components/Text";
import { WeekBars, type DayBar } from "../components/WeekBars";

export function StatsScreen() {
  const insets = useSafeAreaInsets();
  const { habits } = useStore();
  const today = startOfDay(new Date());
  const monday = startOfWeek(today);

  const days: DayBar[] = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(monday, i);
    const due = habits.filter((h) => isScheduled(h.schedule, d));
    return {
      weekday: d.getDay(),
      scheduled: due.length,
      done: due.filter((h) => h.history[keyOf(d)]).length,
      isToday: d.getTime() === today.getTime(),
      future: d > today,
    };
  });

  const rate = Math.round(completionRate(habits, 30) * 100);
  const prev = Math.round(completionRate(habits, 30, 30) * 100);
  const longest = habits.reduce((m, h) => Math.max(m, currentStreak(h.history, h.schedule)), 0);
  const range = `${monday.getDate()} ${copy.months[monday.getMonth()].slice(0, 3)} – ${addDays(monday, 6).getDate()} ${copy.months[addDays(monday, 6).getMonth()].slice(0, 3)}`;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + space.lg }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text variant="bodyMedium" tone="muted">
          {range}
        </Text>
        <Text variant="h1" accessibilityRole="header">
          {copy.stats.title}
        </Text>
      </View>

      <Card>
        <View style={styles.cardHead}>
          <Text variant="title">{copy.stats.week}</Text>
          <Text variant="caption" tone="muted">
            {copy.stats.weekHint}
          </Text>
        </View>
        <WeekBars days={days} />
      </Card>

      <View style={styles.tiles}>
        <Card style={styles.tile}>
          <Text variant="caption" tone="muted">
            {copy.stats.rate}
          </Text>
          <Text variant="numeral" style={styles.big} accessibilityLabel={`${rate} percent`}>
            {rate}%
          </Text>
          <Text variant="caption" tone={rate >= prev ? "primary" : "muted"}>
            {copy.stats.delta(rate - prev)}
          </Text>
        </Card>
        <Card style={styles.tile}>
          <Text variant="caption" tone="muted">
            {copy.stats.longest}
          </Text>
          <View style={styles.flameRow}>
            <Flame size={26} strokeWidth={2.25} color={colors.streak} fill={colors.streak} />
            <Text variant="numeral" tone="streak" style={styles.big}>
              {longest}
            </Text>
          </View>
          <Text variant="caption" tone="muted">
            {copy.detail.days(longest)}
          </Text>
        </Card>
      </View>

      <Card>
        <View style={styles.cardHead}>
          <Text variant="title">{copy.stats.perHabit}</Text>
          <Text variant="caption" tone="muted">
            {copy.stats.rateHint}
          </Text>
        </View>
        {habits.map((h) => {
          const r = Math.round(completionRate([h], 30) * 100);
          return (
            <View key={h.id} style={styles.habit} accessible accessibilityLabel={`${h.name}: ${r} percent`}>
              <HabitTile name={h.icon} color={h.color} size={40} />
              <View style={styles.habitBody}>
                <View style={styles.habitTop}>
                  <Text variant="bodyMedium" numberOfLines={1} style={styles.habitName}>
                    {h.name}
                  </Text>
                  <Text variant="label" style={styles.pct}>
                    {r}%
                  </Text>
                </View>
                <View style={styles.bar}>
                  <View style={[styles.barFill, { width: `${r}%`, backgroundColor: habitSwatches[h.color] }]} />
                </View>
              </View>
            </View>
          );
        })}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: space.xl, paddingBottom: space.xxxl, gap: space.lg },
  header: { gap: space.xs, marginBottom: space.sm },
  cardHead: { gap: 2 },
  tiles: { flexDirection: "row", gap: space.md },
  tile: { flex: 1, minWidth: 0, gap: space.xs, padding: space.lg },
  big: { fontSize: 40, lineHeight: 44 },
  flameRow: { flexDirection: "row", alignItems: "center", gap: space.sm },
  habit: { flexDirection: "row", alignItems: "center", gap: space.md },
  habitBody: { flex: 1, minWidth: 0, gap: space.sm },
  habitTop: { flexDirection: "row", alignItems: "center", gap: space.sm },
  habitName: { flex: 1, minWidth: 0 },
  pct: { fontVariant: ["tabular-nums"] },
  bar: { height: 8, borderRadius: radius.pill, backgroundColor: colors.track, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: radius.pill },
});
