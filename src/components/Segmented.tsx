import { Pressable, StyleSheet, View } from "react-native";
import { colors, radius, space } from "../theme";
import { Text } from "./Text";

export function Segmented<T extends string>({
  options, value, onChange, label,
}: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <View style={styles.track} accessibilityRole="radiogroup" accessibilityLabel={label}>
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            accessibilityLabel={o.label}
            style={[styles.seg, selected && styles.selected]}
          >
            <Text variant="bodyMedium" tone={selected ? "onPrimary" : "muted"} numberOfLines={1}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: "row", backgroundColor: colors.surface, borderRadius: radius.control, padding: space.xs, gap: space.xs },
  seg: { flex: 1, minHeight: 44, borderRadius: radius.sm, alignItems: "center", justifyContent: "center", paddingHorizontal: space.sm },
  selected: { backgroundColor: colors.primary },
});
