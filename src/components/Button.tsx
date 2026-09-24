import { Pressable, StyleSheet } from "react-native";
import { colors, fonts, radius, space, type as t } from "../theme";
import { Text } from "./Text";

export function Button({
  label, onPress, variant = "primary", disabled = false, accessibilityHint,
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  accessibilityHint?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "danger" && styles.danger,
        disabled && styles.disabled,
        pressed && !disabled && { transform: [{ scale: 0.98 }], opacity: 0.92 },
      ]}
    >
      <Text
        variant="bodyLg"
        tone={variant === "primary" && !disabled ? "onPrimary" : variant === "danger" ? "danger" : "default"}
        style={styles.label}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 56, borderRadius: radius.control, alignItems: "center", justifyContent: "center", paddingHorizontal: space.xxl },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  danger: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.border },
  disabled: { backgroundColor: colors.surfaceRaised },
  label: { fontSize: t.bodyLg, fontFamily: fonts.bodyBold },
});
