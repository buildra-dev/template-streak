import { useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Switch, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Bell, ChevronLeft, ChevronRight, Flame, Minus, Plus, Trophy } from "lucide-react-native";
import { colors, space } from "../theme";
import { copy } from "../data/copy";
import { REMINDER_STEP } from "../data/habits";
import { useStore } from "../store";
import { formatTime, shiftTime } from "../lib/dates";
import { bestStreak, completionRate, currentStreak } from "../lib/history";
import { habitMeta } from "../lib/format";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { DayChips } from "../components/DayChips";
import { Heatmap } from "../components/Heatmap";
import { HabitTile } from "../components/Icon";
import { IconButton } from "../components/IconButton";
import { Text } from "../components/Text";

const DEFAULT_REMINDER = "09:00";

export function HabitDetailScreen({ id }: { id: string }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { habits, setReminder, deleteHabit } = useStore();
  const habit = habits.find((h) => h.id === id);
  const now = new Date();
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() });

  const back = () => (router.canGoBack() ? router.back() : router.replace("/today"));

  if (!habit) {
    return (
      <View style={[styles.screen, styles.missing, { paddingTop: insets.top + space.lg }]}>
        <Text variant="bodyLg">{copy.detail.notFound}</Text>
        <Button label={copy.detail.back} variant="secondary" onPress={back} />
      </View>
    );
  }

  const streak = currentStreak(habit.history, habit.schedule);
  const best = bestStreak(habit.history, habit.schedule);
  const rate = Math.round(completionRate([habit], 30) * 100);
  const atCurrentMonth = cursor.year === now.getFullYear() && cursor.month === now.getMonth();
  const earliest = new Date(now.getFullYear(), now.getMonth() - 3, 1);
  const atEarliest = new Date(cursor.year, cursor.month, 1) <= earliest;

  const shiftMonth = (delta: number) =>
    setCursor(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  const confirmDelete = () => {
    const remove = () => {
      deleteHabit(habit.id);
      back();
    };
    if (Platform.OS === "web") {
      if (globalThis.confirm?.(`${copy.detail.deleteTitle}\n${copy.detail.deleteBody}`)) remove();
      return;
    }
    Alert.alert(copy.detail.deleteTitle, copy.detail.deleteBody, [
      { text: copy.detail.cancel, style: "cancel" },
      { text: copy.detail.confirm, style: "destructive", onPress: remove },
    ]);
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.topBar, { paddingTop: insets.top + space.sm }]}>
        <IconButton icon={ChevronLeft} label={copy.detail.back} onPress={back} flipInRTL />
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + space.xxxl }]} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <HabitTile name={habit.icon} color={habit.color} size={56} />
          <View style={styles.heroText}>
            <Text variant="h2" accessibilityRole="header" numberOfLines={2}>
              {habit.name}
            </Text>
            <Text variant="caption" tone="muted">
              {habitMeta(habit.schedule, habit.reminder)}
            </Text>
          </View>
        </View>

        <View style={styles.stats}>
          <Card style={styles.stat}>
            <Flame size={20} strokeWidth={2.25} color={colors.streak} fill={colors.streak} />
            <Text variant="numeral" tone="streak" style={styles.statNum}>
              {streak}
            </Text>
            <Text variant="caption" tone="muted">
              {copy.detail.current}
            </Text>
          </Card>
          <Card style={styles.stat}>
            <Trophy size={20} strokeWidth={2} color={colors.primary} />
            <Text variant="numeral" style={styles.statNum}>
              {best}
            </Text>
            <Text variant="caption" tone="muted">
              {copy.detail.best}
            </Text>
          </Card>
          <Card style={styles.stat}>
            <Text variant="label" tone="primary" style={styles.pctIcon}>
              %
            </Text>
            <Text variant="numeral" style={styles.statNum}>
              {rate}
            </Text>
            <Text variant="caption" tone="muted">
              {copy.detail.rate}
            </Text>
          </Card>
        </View>

        <Card>
          <View style={styles.monthHead}>
            <IconButton icon={ChevronLeft} label="Previous month" onPress={() => shiftMonth(-1)} disabled={atEarliest} filled={false} flipInRTL />
            <Text variant="title" style={styles.monthTitle} accessibilityRole="header">
              {copy.months[cursor.month]} {cursor.year}
            </Text>
            <IconButton icon={ChevronRight} label="Next month" onPress={() => shiftMonth(1)} disabled={atCurrentMonth} filled={false} flipInRTL />
          </View>
          <Heatmap year={cursor.year} month={cursor.month} history={habit.history} schedule={habit.schedule} color={habit.color} />
        </Card>

        <Card>
          <View style={styles.reminderRow}>
            <Bell size={22} strokeWidth={2} color={colors.primary} />
            <View style={styles.reminderText}>
              <Text variant="bodyLg">{copy.detail.reminder}</Text>
              <Text variant="caption" tone="muted">
                {habit.reminder ? formatTime(habit.reminder) : copy.detail.reminderOff}
              </Text>
            </View>
            <Switch
              value={!!habit.reminder}
              onValueChange={(on) => setReminder(habit.id, on ? DEFAULT_REMINDER : null)}
              accessibilityLabel={copy.detail.reminder}
              trackColor={{ false: colors.surfaceRaised, true: colors.primary }}
              thumbColor={colors.foreground}
              ios_backgroundColor={colors.surfaceRaised}
            />
          </View>
          {habit.reminder ? (
            <View style={styles.stepper}>
              <IconButton icon={Minus} label={copy.detail.earlier} onPress={() => setReminder(habit.id, shiftTime(habit.reminder!, -REMINDER_STEP))} />
              <Text variant="h2" style={styles.time}>
                {formatTime(habit.reminder)}
              </Text>
              <IconButton icon={Plus} label={copy.detail.later} onPress={() => setReminder(habit.id, shiftTime(habit.reminder!, REMINDER_STEP))} />
            </View>
          ) : null}
        </Card>

        <Card>
          <Text variant="title">{copy.detail.schedule}</Text>
          <DayChips value={habit.schedule} />
        </Card>

        <Button label={copy.detail.delete} variant="danger" onPress={confirmDelete} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  missing: { paddingHorizontal: space.xl, gap: space.lg },
  topBar: { paddingHorizontal: space.lg, paddingBottom: space.sm, flexDirection: "row" },
  content: { paddingHorizontal: space.xl, gap: space.lg },
  hero: { flexDirection: "row", alignItems: "center", gap: space.lg, marginBottom: space.xs },
  heroText: { flex: 1, minWidth: 0, gap: 2 },
  stats: { flexDirection: "row", gap: space.md },
  stat: { flex: 1, minWidth: 0, padding: space.lg, gap: space.xs },
  statNum: { fontSize: 30, lineHeight: 34, marginTop: space.xs },
  pctIcon: { fontSize: 18, lineHeight: 20 },
  monthHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: -space.sm },
  monthTitle: { flex: 1, textAlign: "center" },
  reminderRow: { flexDirection: "row", alignItems: "center", gap: space.md, minHeight: 44 },
  reminderText: { flex: 1, minWidth: 0 },
  stepper: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  time: { fontVariant: ["tabular-nums"] },
});
