import {
  Bike, BookOpen, Droplet, Dumbbell, Footprints, Languages, Leaf, Moon, Music, PenLine, Salad, Wind,
  type LucideIcon,
} from "lucide-react-native";
import { View, StyleSheet } from "react-native";
import type { IconName } from "../data/habits";
import { radius, tint, habitSwatches, type SwatchKey } from "../theme";

// One icon family (Lucide, 2px stroke) across the whole app.
export const habitIconMap: Record<IconName, LucideIcon> = {
  droplet: Droplet,
  "book-open": BookOpen,
  footprints: Footprints,
  dumbbell: Dumbbell,
  moon: Moon,
  wind: Wind,
  "pen-line": PenLine,
  salad: Salad,
  languages: Languages,
  music: Music,
  bike: Bike,
  leaf: Leaf,
};

export function HabitIcon({ name, color, size = 22 }: { name: IconName; color: string; size?: number }) {
  const Glyph = habitIconMap[name];
  return <Glyph color={color} size={size} strokeWidth={2} />;
}

/** Rounded tile holding a habit icon on a tint of its colour. */
export function HabitTile({ name, color, size = 44 }: { name: IconName; color: SwatchKey; size?: number }) {
  return (
    <View style={[styles.tile, { width: size, height: size, backgroundColor: tint(color, 0.16) }]}>
      <HabitIcon name={name} color={habitSwatches[color]} size={Math.round(size * 0.5)} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { borderRadius: radius.control, alignItems: "center", justifyContent: "center" },
});
