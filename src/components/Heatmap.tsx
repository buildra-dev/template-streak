import { StyleSheet, View } from "react-native";
import { colors, fonts, habitSwatches, radius, space, tint, type SwatchKey } from "../theme";
import { copy } from "../data/copy";
import type { Weekday } from "../data/habits";
import { daysInMonth, keyOf, startOfDay } from "../lib/dates";
import { isScheduled, runLengthAt, type History } from "../lib/history";
import { WEEK_ORDER } from "../lib/format";
import { Text } from "./Text";

/** Heat intensity grows with the length of the run a done day belongs to (caps at 14). */
function intensity(run: number) {
  return 0.4 + (Math.min(run, 14) / 14) * 0.6;
}

export function Heatmap({
  year, month, history, schedule, color,
}: { year: number; month: number; history: History; schedule: Weekday[]; color: SwatchKey }) {
  const today = startOfDay(new Date());
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7; // Monday-first
  const total = daysInMonth(year, month);
  const cells: (Date | null)[] = [...Array(lead).fill(null), ...Array.from({ length: total }, (_, i) => new Date(year, month, i + 1))];
  while (cells.length % 7) cells.push(null);

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {WEEK_ORDER.map((d, i) => (
          <View key={i} style={styles.cellBox}>
            <Text variant="label" tone="muted" style={styles.center}>
              {copy.weekdaysShort[d]}
            </Text>
          </View>
        ))}
      </View>
      {Array.from({ length: cells.length / 7 }, (_, w) => (
        <View key={w} style={styles.row}>
          {cells.slice(w * 7, w * 7 + 7).map((d, i) => {
            if (!d) return <View key={i} style={styles.cellBox} />;
            const isToday = d.getTime() === today.getTime();
            const future = d > today;
            const scheduled = isScheduled(schedule, d);
            const done = !!history[keyOf(d)];
            const alpha = done ? intensity(runLengthAt(history, schedule, d)) : 0;
            const state = future ? "upcoming" : done ? "done" : scheduled ? (isToday ? "not done yet" : "missed") : "not scheduled";
            return (
              <View key={i} style={styles.cellBox} accessible accessibilityLabel={`${d.getDate()} ${copy.months[month]}: ${state}`}>
                <View
                  style={[
                    styles.cell,
                    done && { backgroundColor: tint(color, alpha) },
                    !done && scheduled && !future && !isToday && { backgroundColor: colors.surfaceRaised },
                    isToday && styles.today,
                  ]}
                >
                  <Text
                    variant="caption"
                    style={[
                      styles.center,
                      styles.num,
                      { color: done ? (alpha > 0.6 ? colors.onPrimary : colors.foreground) : future || !scheduled ? colors.muted : colors.foreground },
                    ]}
                  >
                    {d.getDate()}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      ))}
      <View style={styles.legend}>
        <LegendDot color={colors.surfaceRaised} label={copy.detail.legendMissed} />
        <LegendDot color={tint(color, 0.45)} label={copy.detail.legendDone} />
        <LegendDot color={habitSwatches[color]} label={copy.detail.legendRun} />
      </View>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendSwatch, { backgroundColor: color }]} />
      <Text variant="caption" tone="muted">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xs },
  row: { flexDirection: "row" },
  cellBox: { flex: 1, aspectRatio: 1, padding: 3 },
  cell: { flex: 1, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" },
  today: { borderWidth: 2, borderColor: colors.foreground },
  center: { textAlign: "center" },
  num: { fontVariant: ["tabular-nums"], fontFamily: fonts.bodyMedium },
  legend: { flexDirection: "row", flexWrap: "wrap", gap: space.lg, marginTop: space.sm },
  legendItem: { flexDirection: "row", alignItems: "center", gap: space.sm },
  legendSwatch: { width: 14, height: 14, borderRadius: 4 },
});
