import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Check, Minus, Plus, X } from "lucide-react-native";
import { colors, fonts, habitSwatches, radius, space, tint, type as t, type SwatchKey } from "../theme";
import { copy } from "../data/copy";
import { EVERY_DAY, habitIcons, REMINDER_STEP, WEEKDAYS, type IconName, type Weekday } from "../data/habits";
import { useStore } from "../store";
import { formatTime, shiftTime } from "../lib/dates";
import { Button } from "../components/Button";
import { DayChips } from "../components/DayChips";
import { HabitRow } from "../components/HabitRow";
import { HabitIcon } from "../components/Icon";
import { IconButton } from "../components/IconButton";
import { Segmented } from "../components/Segmented";
import { Text } from "../components/Text";

type Preset = "every" | "weekdays" | "custom";

export function AddHabitSheet() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addHabit } = useStore();

  const [name, setName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [icon, setIcon] = useState<IconName>("leaf");
  const [color, setColor] = useState<SwatchKey>("periwinkle");
  const [preset, setPreset] = useState<Preset>("every");
  const [days, setDays] = useState<Weekday[]>(EVERY_DAY);
  const [reminderOn, setReminderOn] = useState(true);
  const [time, setTime] = useState("08:30");
  const [submitted, setSubmitted] = useState(false);

  const nameError = (nameTouched || submitted) && name.trim().length === 0;
  const daysError = submitted && days.length === 0;

  const pickPreset = (p: Preset) => {
    setPreset(p);
    if (p === "every") setDays(EVERY_DAY);
    if (p === "weekdays") setDays(WEEKDAYS);
  };
  const toggleDay = (d: Weekday) => {
    setPreset("custom");
    setDays((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]));
  };

  const close = () => (router.canGoBack() ? router.back() : router.replace("/today"));

  const save = () => {
    setSubmitted(true);
    if (!name.trim() || days.length === 0) return;
    addHabit({ name: name.trim(), icon, color, schedule: days, reminder: reminderOn ? time : null });
    close();
  };

  const draft = { name: name.trim() || copy.add.namePlaceholder.replace("e.g. ", ""), icon, color, schedule: days.length ? days : EVERY_DAY, reminder: reminderOn ? time : null };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.grabber} accessible={false} />
      <View style={styles.header}>
        <Text variant="h2" accessibilityRole="header">
          {copy.add.title}
        </Text>
        <IconButton icon={X} label={copy.add.close} onPress={close} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.field}>
          <Text variant="label" tone="muted">
            {copy.add.preview.toUpperCase()}
          </Text>
          <HabitRow habit={draft} streak={0} checked={false} />
        </View>

        <View style={styles.field}>
          <Text variant="bodyMedium" nativeID="habit-name-label">
            {copy.add.name}
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            onBlur={() => setNameTouched(true)}
            placeholder={copy.add.namePlaceholder}
            placeholderTextColor={colors.muted}
            accessibilityLabel={copy.add.name}
            accessibilityLabelledBy="habit-name-label"
            returnKeyType="done"
            maxLength={40}
            style={[styles.input, nameError && styles.inputError]}
          />
          {nameError ? (
            <Text variant="caption" tone="danger" accessibilityRole="alert">
              {copy.add.nameError}
            </Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text variant="bodyMedium">{copy.add.icon}</Text>
          <View style={styles.iconGrid} accessibilityRole="radiogroup" accessibilityLabel={copy.add.icon}>
            {habitIcons.map((i) => {
              const on = i === icon;
              return (
                <Pressable
                  key={i}
                  onPress={() => setIcon(i)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: on }}
                  accessibilityLabel={i.replace("-", " ")}
                  style={[styles.iconCell, on && { backgroundColor: tint(color, 0.18), borderColor: habitSwatches[color] }]}
                >
                  <HabitIcon name={i} color={on ? habitSwatches[color] : colors.muted} size={22} />
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.field}>
          <Text variant="bodyMedium">{copy.add.colour}</Text>
          <View style={styles.swatches} accessibilityRole="radiogroup" accessibilityLabel={copy.add.colour}>
            {(Object.keys(habitSwatches) as SwatchKey[]).map((k) => {
              const on = k === color;
              return (
                <Pressable
                  key={k}
                  onPress={() => setColor(k)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: on }}
                  accessibilityLabel={k}
                  style={[styles.swatchHit, on && { borderColor: habitSwatches[k] }]}
                >
                  <View style={[styles.swatch, { backgroundColor: habitSwatches[k] }]}>
                    {on ? <Check size={18} strokeWidth={3} color={colors.onPrimary} /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.field}>
          <Text variant="bodyMedium">{copy.add.schedule}</Text>
          <Segmented
            label={copy.add.schedule}
            value={preset}
            onChange={pickPreset}
            options={[
              { value: "every", label: copy.add.everyDay },
              { value: "weekdays", label: copy.add.weekdays },
              { value: "custom", label: copy.add.custom },
            ]}
          />
          <DayChips value={days} onToggle={toggleDay} />
          {daysError ? (
            <Text variant="caption" tone="danger" accessibilityRole="alert">
              {copy.add.scheduleError}
            </Text>
          ) : null}
        </View>

        <View style={[styles.field, styles.reminderCard]}>
          <View style={styles.reminderRow}>
            <View style={styles.flex}>
              <Text variant="bodyMedium">{copy.add.reminder}</Text>
              <Text variant="caption" tone="muted">
                {copy.add.reminderHint}
              </Text>
            </View>
            <Switch
              value={reminderOn}
              onValueChange={setReminderOn}
              accessibilityLabel={copy.add.reminder}
              trackColor={{ false: colors.surfaceRaised, true: colors.primary }}
              thumbColor={colors.foreground}
              ios_backgroundColor={colors.surfaceRaised}
            />
          </View>
          {reminderOn ? (
            <View style={styles.stepper}>
              <IconButton icon={Minus} label={copy.detail.earlier} onPress={() => setTime((v) => shiftTime(v, -REMINDER_STEP))} />
              <Text variant="h2" style={styles.time} accessibilityLiveRegion="polite">
                {formatTime(time)}
              </Text>
              <IconButton icon={Plus} label={copy.detail.later} onPress={() => setTime((v) => shiftTime(v, REMINDER_STEP))} />
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space.lg) }]}>
        <Button label={copy.add.save} onPress={save} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  grabber: { alignSelf: "center", width: 40, height: 5, borderRadius: 3, backgroundColor: colors.border, marginTop: space.sm },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: space.xl, paddingTop: space.md, paddingBottom: space.sm },
  content: { paddingHorizontal: space.xl, paddingBottom: space.xxl, gap: space.xxl },
  field: { gap: space.sm },
  flex: { flex: 1, minWidth: 0 },
  input: {
    minHeight: 52,
    borderRadius: radius.control,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: space.lg,
    color: colors.foreground,
    fontFamily: fonts.bodyMedium,
    fontSize: t.bodyLg,
  },
  inputError: { borderColor: colors.danger },
  iconGrid: { flexDirection: "row", flexWrap: "wrap", gap: space.sm },
  iconCell: {
    width: 48,
    height: 48,
    borderRadius: radius.control,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  swatches: { flexDirection: "row", gap: space.md },
  swatchHit: { width: 52, height: 52, borderRadius: radius.pill, borderWidth: 2, borderColor: "transparent", alignItems: "center", justifyContent: "center" },
  swatch: { width: 40, height: 40, borderRadius: radius.pill, alignItems: "center", justifyContent: "center" },
  reminderCard: { backgroundColor: colors.surface, borderRadius: radius.card, padding: space.lg, gap: space.md },
  reminderRow: { flexDirection: "row", alignItems: "center", gap: space.md },
  stepper: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  time: { fontVariant: ["tabular-nums"] },
  footer: { paddingHorizontal: space.xl, paddingTop: space.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, backgroundColor: colors.background },
});
