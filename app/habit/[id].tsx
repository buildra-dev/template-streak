import { useLocalSearchParams } from "expo-router";
import { HabitDetailScreen } from "../../src/screens/HabitDetailScreen";

export default function HabitRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <HabitDetailScreen id={String(id)} />;
}
