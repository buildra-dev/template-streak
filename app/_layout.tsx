import "../components/ui/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from "@expo-google-fonts/bricolage-grotesque";
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from "@expo-google-fonts/dm-sans";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UIProvider } from "../components/ui";
import { StoreProvider } from "../src/store";
import { colors } from "../src/theme";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  if (!loaded && !error) return <View style={{ flex: 1, backgroundColor: colors.background }} />;

  // The starter's gesture root and UI provider stay outermost, so the kit in components/ui/ keeps
  // working for anything added later; Streak's own screens are styled by src/theme.ts.
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <UIProvider>
    <SafeAreaProvider>
      <StoreProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background }, animation: "default" }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" options={{ animation: "fade" }} />
          <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
          <Stack.Screen name="habit/[id]" />
          <Stack.Screen name="add" options={{ presentation: "modal" }} />
          <Stack.Screen name="cover" />
        </Stack>
      </StoreProvider>
    </SafeAreaProvider>
    </UIProvider>
    </GestureHandlerRootView>
  );
}
