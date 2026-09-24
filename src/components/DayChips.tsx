import { Pressable, StyleSheet, View } from "react-native";
import { colors, radius } from "../theme";
import { copy } from "../data/copy";
import type { Weekday } from "../data/habits";
import { WEEK_ORDER } from "../lib/format";
import { Text } from "./Text";

/** Seven day toggles (Mon–Sun). Read-only when onToggle is omitted. */
export function DayChips({ value, onToggle }: { value: Weekday[]; onToggle?: (d: Weekday) => void }) {
  return (
    <View style={styles.row}>
      {WEEK_ORDER.map((d) => {
        const on = value.includes(d);
        const chip = (
          <View style={[styles.chip, on ? styles.on : styles.off]}>
            <Text variant="label" tone={on ? "onPrimary" : "muted"}>
              {copy.weekdaysShort[d]}
            </Text>
          </View>
        );
        return onToggle ? (
          <Pressable
            key={d}
            onPress={() => onToggle(d)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: on }}
            accessibilityLabel={copy.weekdaysMedium[d]}
            style={styles.hit}
          >
            {chip}
          </Pressable>
        ) : (
          <View key={d} style={styles.hit} accessible accessibilityLabel={`${copy.weekdaysMedium[d]}: ${on ? "on" : "off"}`}>
            {chip}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between" },
  hit: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  chip: { width: 40, height: 40, borderRadius: radius.pill, alignItems: "center", justifyContent: "center" },
  on: { backgroundColor: colors.primary },
  off: { backgroundColor: colors.surfaceRaised },
});
