import { Tabs, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabBarView, type TabName } from "../../src/components/TabBar";
import { colors } from "../../src/theme";

export default function TabsLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.background } }}
      tabBar={({ state, navigation }) => (
        <TabBarView
          active={state.routes[state.index].name as TabName}
          bottomInset={insets.bottom}
          onNavigate={(tab) => navigation.navigate(tab)}
          onAdd={() => router.push("/add")}
        />
      )}
    >
      <Tabs.Screen name="today" />
      <Tabs.Screen name="stats" />
    </Tabs>
  );
}
