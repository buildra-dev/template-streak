import { StyleSheet, View } from "react-native";
import { colors, radius, space } from "../theme";
import { copy } from "../data/copy";
import { Text } from "./Text";

export interface DayBar {
  weekday: number; // 0 = Sunday
  done: number;
  scheduled: number;
  isToday: boolean;
  future: boolean;
}

const BAR_HEIGHT = 148;

export function WeekBars({ days }: { days: DayBar[] }) {
  return (
    <View style={styles.chart}>
      {days.map((d, i) => {
        const ratio = d.scheduled === 0 ? 0 : d.done / d.scheduled;
        const label = d.future ? "–" : `${d.done}/${d.scheduled}`;
        return (
          <View
            key={i}
            style={styles.col}
            accessible
            accessibilityLabel={`${copy.weekdaysMedium[d.weekday]}: ${d.future ? "upcoming" : `${d.done} of ${d.scheduled} done`}`}
          >
            <Text variant="label" tone={d.isToday ? "default" : "muted"} style={styles.value}>
              {label}
            </Text>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  { height: `${Math.max(ratio * 100, d.done > 0 ? 8 : 0)}%` },
                  { backgroundColor: ratio === 1 ? colors.primary : colors.primarySoft },
                ]}
              />
            </View>
            <Text variant="label" tone={d.isToday ? "primary" : "muted"}>
              {copy.weekdaysShort[d.weekday]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: { flexDirection: "row", justifyContent: "space-between", gap: space.sm },
  col: { flex: 1, alignItems: "center", gap: space.sm },
  value: { fontVariant: ["tabular-nums"] },
  track: { width: 28, height: BAR_HEIGHT, borderRadius: radius.sm, backgroundColor: colors.track, justifyContent: "flex-end", overflow: "hidden" },
  fill: { width: "100%", borderRadius: radius.sm },
});
