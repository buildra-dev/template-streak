import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Check, Flame, Plus } from "lucide-react-native";
import { colors, radius, space } from "../theme";
import { copy } from "../data/copy";
import { useStore } from "../store";
import { addDays, keyOf, startOfDay, startOfWeek } from "../lib/dates";
import { currentStreak, isScheduled } from "../lib/history";
import { Card } from "../components/Card";
import { HabitRow } from "../components/HabitRow";
import { ProgressRing } from "../components/ProgressRing";
import { Text } from "../components/Text";

export function TodayScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { habits, toggleToday } = useStore();
  const now = new Date();
  const today = startOfDay(now);
  const todayKey = keyOf(today);

  const scheduled = habits.filter((h) => isScheduled(h.schedule, today));
  const off = habits.filter((h) => !isScheduled(h.schedule, today));
  const done = scheduled.filter((h) => h.history[todayKey]).length;
  const left = scheduled.length - done;
  const longest = habits.reduce((m, h) => Math.max(m, currentStreak(h.history, h.schedule)), 0);

  const monday = startOfWeek(today);
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(monday, i);
    const due = habits.filter((h) => isScheduled(h.schedule, d));
    const complete = due.filter((h) => h.history[keyOf(d)]).length;
    return { d, due: due.length, complete, isToday: i === (today.getDay() + 6) % 7, future: d > today };
  });

  const dateLine = `${copy.weekdaysMedium[today.getDay()]}, ${today.getDate()} ${copy.months[today.getMonth()]}`;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + space.lg }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text variant="bodyMedium" tone="muted">
          {dateLine}
        </Text>
        <Text variant="h1" accessibilityRole="header">
          {copy.today.greeting(now.getHours())}, {copy.today.user}
        </Text>
      </View>

      <Card style={styles.ringCard}>
        <ProgressRing done={done} total={scheduled.length} label={copy.today.ringLabel} />
        <View style={styles.ringSide}>
          <View style={styles.flameRow}>
            <Flame size={22} strokeWidth={2.25} color={colors.streak} fill={colors.streak} />
            <Text variant="numeral" tone="streak" style={styles.flameNum}>
              {longest}
            </Text>
          </View>
          <Text variant="caption" tone="muted">
            {copy.stats.longest}
          </Text>
          <Text variant="bodyMedium" style={styles.status}>
            {scheduled.length === 0 ? copy.today.nothingToday : left === 0 ? copy.today.allDone : copy.today.remaining(left)}
          </Text>
        </View>
      </Card>

      <View style={styles.section}>
        <Text variant="title" accessibilityRole="header">
          {copy.today.week}
        </Text>
        <View style={styles.week}>
          {week.map(({ d, due, complete, isToday, future }) => {
            const full = due > 0 && complete === due;
            const partial = complete > 0 && !full;
            return (
              <View
                key={d.getTime()}
                style={styles.weekCell}
                accessible
                accessibilityLabel={`${copy.weekdaysMedium[d.getDay()]}: ${future ? "upcoming" : `${complete} of ${due} done`}`}
              >
                <Text variant="label" tone={isToday ? "primary" : "muted"}>
                  {copy.weekdaysShort[d.getDay()]}
                </Text>
                <View
                  style={[
                    styles.weekDot,
                    full && { backgroundColor: colors.primary },
                    partial && { borderWidth: 2, borderColor: colors.primary },
                    !full && !partial && { backgroundColor: future ? "transparent" : colors.surface, borderWidth: future ? 1 : 0, borderColor: colors.border },
                    isToday && !full && styles.weekToday,
                  ]}
                >
                  {full ? (
                    <Check size={18} strokeWidth={3} color={colors.onPrimary} />
                  ) : (
                    <Text variant="label" tone={future ? "muted" : "default"}>
                      {d.getDate()}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="title" accessibilityRole="header">
          {copy.today.habits}
        </Text>
        {habits.length === 0 ? (
          <Text variant="body" tone="muted">
            {copy.today.empty}
          </Text>
        ) : null}
        {scheduled.map((h) => (
          <HabitRow
            key={h.id}
            habit={h}
            streak={currentStreak(h.history, h.schedule)}
            checked={!!h.history[todayKey]}
            onOpen={() => router.push(`/habit/${h.id}`)}
            onToggle={() => toggleToday(h.id)}
          />
        ))}
        <Pressable
          onPress={() => router.push("/add")}
          accessibilityRole="button"
          accessibilityLabel={copy.today.add}
          style={({ pressed }) => [styles.addRow, pressed && { backgroundColor: colors.surface }]}
        >
          <Plus size={20} strokeWidth={2.25} color={colors.primary} />
          <Text variant="bodyMedium" tone="primary">
            {copy.today.add}
          </Text>
        </Pressable>
      </View>

      {off.length > 0 ? (
        <View style={styles.section}>
          <Text variant="label" tone="muted">
            {copy.today.notToday.toUpperCase()}
          </Text>
          {off.map((h) => (
            <HabitRow
              key={h.id}
              habit={h}
              scheduled={false}
              streak={currentStreak(h.history, h.schedule)}
              checked={false}
              onOpen={() => router.push(`/habit/${h.id}`)}
            />
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: space.xl, paddingBottom: space.xxxl, gap: space.xxl },
  header: { gap: space.xs },
  ringCard: { flexDirection: "row", alignItems: "center", gap: space.xl },
  ringSide: { flex: 1, minWidth: 0, gap: 2 },
  flameRow: { flexDirection: "row", alignItems: "center", gap: space.sm },
  flameNum: { fontSize: 30, lineHeight: 34 },
  status: { marginTop: space.md },
  section: { gap: space.md },
  week: { flexDirection: "row", justifyContent: "space-between" },
  weekCell: { alignItems: "center", gap: space.sm, minWidth: 40 },
  weekDot: { width: 40, height: 40, borderRadius: radius.pill, alignItems: "center", justifyContent: "center" },
  weekToday: { borderWidth: 2, borderColor: colors.primary },
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    minHeight: 56,
    borderRadius: radius.card,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.border,
  },
});
