import { Pressable, StyleSheet, View } from "react-native";
import { ChartColumn, CircleCheckBig, Plus, type LucideIcon } from "lucide-react-native";
import { colors, radius, space } from "../theme";
import { copy } from "../data/copy";
import { Text } from "./Text";

export type TabName = "today" | "stats";

function Tab({ icon: Glyph, label, active, onPress }: { icon: LucideIcon; label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      style={styles.tab}
    >
      <Glyph size={24} strokeWidth={2} color={active ? colors.primary : colors.muted} />
      <Text variant="label" tone={active ? "primary" : "muted"}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Bottom tab bar: Today · Add · Stats. Presentational so the cover route can render it too. */
export function TabBarView({
  active, bottomInset, onNavigate, onAdd,
}: { active: TabName; bottomInset: number; onNavigate: (tab: TabName) => void; onAdd: () => void }) {
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(bottomInset, space.sm) }]} accessibilityRole="tablist">
      <Tab icon={CircleCheckBig} label={copy.tabs.today} active={active === "today"} onPress={() => onNavigate("today")} />
      <Pressable onPress={onAdd} accessibilityRole="button" accessibilityLabel={copy.tabs.add} style={styles.addHit}>
        {({ pressed }) => (
          <View style={[styles.add, pressed && { transform: [{ scale: 0.94 }] }]}>
            <Plus size={28} strokeWidth={2.5} color={colors.onPrimary} />
          </View>
        )}
      </Pressable>
      <Tab icon={ChartColumn} label={copy.tabs.stats} active={active === "stats"} onPress={() => onNavigate("stats")} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: space.sm,
    paddingHorizontal: space.xxl,
  },
  tab: { minWidth: 88, minHeight: 52, alignItems: "center", justifyContent: "center", gap: 2 },
  addHit: { width: 64, height: 64, alignItems: "center", justifyContent: "center" },
  add: { width: 56, height: 56, borderRadius: radius.card, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
});
