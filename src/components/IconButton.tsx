import { I18nManager, Pressable, StyleSheet } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { colors, radius, touch } from "../theme";

export function IconButton({
  icon: Glyph, label, onPress, flipInRTL = false, filled = true, disabled = false,
}: { icon: LucideIcon; label: string; onPress: () => void; flipInRTL?: boolean; filled?: boolean; disabled?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.btn,
        filled && { backgroundColor: colors.surface },
        pressed && { backgroundColor: colors.surfaceRaised },
        disabled && { opacity: 0.4 },
      ]}
    >
      <Glyph
        size={22}
        strokeWidth={2}
        color={colors.foreground}
        style={flipInRTL && I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { width: touch, height: touch, borderRadius: radius.control, alignItems: "center", justifyContent: "center" },
});
