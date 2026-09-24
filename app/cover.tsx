import { useMemo, type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { coverCheckedToday, coverDetailId, coverHabitIds, suggestedHabits } from "../src/data/habits";
import { habitFromSeed, StoreProvider } from "../src/store";
import { keyOf } from "../src/lib/dates";
import { colors, radius } from "../src/theme";
import { TabBarView } from "../src/components/TabBar";
import { TodayScreen } from "../src/screens/TodayScreen";
import { HabitDetailScreen } from "../src/screens/HabitDetailScreen";
import { StatsScreen } from "../src/screens/StatsScreen";

// Gallery cover: renders exactly 1600×1000 — Today, Habit detail and Stats side by side.
// Re-shoot with `npm run cover` after changing the app (see README).

const SCREEN = { width: 390, height: 844 };
const INSETS = { top: 47, bottom: 34, left: 0, right: 0 };
const noop = () => {};

function Phone({ children }: { children: ReactNode }) {
  return (
    <SafeAreaInsetsContext.Provider value={INSETS}>
      <View style={styles.phone}>{children}</View>
    </SafeAreaInsetsContext.Provider>
  );
}

export default function Cover() {
  const initial = useMemo(() => {
    const today = keyOf(new Date());
    const habits = suggestedHabits
      .filter((s) => coverHabitIds.includes(s.id))
      .map(habitFromSeed)
      .map((h) => (coverCheckedToday.includes(h.id) ? { ...h, history: { ...h.history, [today]: true as const } } : h));
    return { onboarded: true, habits };
  }, []);

  return (
    <StoreProvider initial={initial}>
      <View style={styles.canvas}>
        <Phone>
          <View style={styles.flex}>
            <TodayScreen />
          </View>
          <TabBarView active="today" bottomInset={INSETS.bottom} onNavigate={noop} onAdd={noop} />
        </Phone>
        <Phone>
          <HabitDetailScreen id={coverDetailId} />
        </Phone>
        <Phone>
          <View style={styles.flex}>
            <StatsScreen />
          </View>
          <TabBarView active="stats" bottomInset={INSETS.bottom} onNavigate={noop} onAdd={noop} />
        </Phone>
      </View>
    </StoreProvider>
  );
}

const styles = StyleSheet.create({
  canvas: {
    width: 1600,
    height: 1000,
    backgroundColor: colors.surfaceRaised,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 56,
    overflow: "hidden",
  },
  phone: { ...SCREEN, borderRadius: radius.sheet * 1.5, overflow: "hidden", backgroundColor: colors.background },
  flex: { flex: 1 },
});
