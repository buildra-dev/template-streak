import { useRef } from "react";
import { Animated, Platform, Pressable, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { Check } from "lucide-react-native";
import { colors, habitSwatches, motion, tint, type SwatchKey } from "../theme";
import { useReducedMotion } from "../lib/useReducedMotion";

export function CheckButton({
  checked, color, onToggle, label,
}: { checked: boolean; color: SwatchKey; onToggle: () => void; label: string }) {
  const scale = useRef(new Animated.Value(1)).current;
  const reduced = useReducedMotion();

  const press = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(checked ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium);
    if (!reduced) {
      scale.setValue(0.86);
      Animated.spring(scale, { toValue: 1, useNativeDriver: Platform.OS !== "web", speed: 30, bounciness: 10 }).start();
    }
    onToggle();
  };

  return (
    <Pressable
      onPress={press}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      hitSlop={4}
      style={({ pressed }) => [styles.hit, pressed && { opacity: 0.85 }]}
    >
      <Animated.View
        style={[
          styles.circle,
          { transform: [{ scale }] },
          checked
            ? { backgroundColor: habitSwatches[color], borderColor: habitSwatches[color] }
            : { backgroundColor: tint(color, 0.06), borderColor: tint(color, 0.7) },
        ]}
      >
        {checked ? <Check size={24} strokeWidth={3} color={colors.onPrimary} /> : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: { width: 52, height: 52, alignItems: "center", justifyContent: "center" },
  circle: { width: 48, height: 48, borderRadius: 24, borderWidth: 2.5, alignItems: "center", justifyContent: "center" },
});

export const checkDuration = motion.tap;
