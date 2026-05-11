import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="history" options={{ title: "History" }} />
      <Stack.Screen name="reward-day" options={{ headerShown: false }} />
      <Stack.Screen
        name="completion-modal"
        options={{ presentation: "modal", title: "Log Completion" }}
      />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
    </Stack>
  );
}
