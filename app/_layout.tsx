import { Stack } from "expo-router";
import { useEffect } from "react";
import "../global.css";
import { useAppStore } from "../store/useAppStore";

export default function RootLayout() {
  const hasHydrated = useAppStore((s) => s._hasHydrated);
  const initWeek = useAppStore((s) => s.initWeek);

  // Run once after AsyncStorage finishes loading so initWeek sees real data
  useEffect(() => {
    if (hasHydrated) initWeek();
  }, [hasHydrated]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="history" options={{ title: "History" }} />
      <Stack.Screen name="reward-day" options={{ headerShown: false }} />
      <Stack.Screen
        name="completion-modal"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
    </Stack>
  );
}
