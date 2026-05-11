import { Redirect } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useAppStore } from "../store/useAppStore";

// Phase 1/2 debug surface — replaced entirely in Phase 3
export default function HomeScreen() {
  const hasHydrated = useAppStore((s) => s._hasHydrated);
  const onboardingComplete = useAppStore((s) => s.settings.onboardingComplete);
  const addCompletion = useAppStore((s) => s.addCompletion);
  const devReset = useAppStore((s) => s._devReset);
  const count = useAppStore((s) => s.currentWeek.completions.length);
  const weekStart = useAppStore((s) => s.currentWeek.weekStartDate);

  if (!hasHydrated) return null;
  if (!onboardingComplete) return <Redirect href="/onboarding" />;

  return (
    <View className="flex-1 items-center justify-center bg-white gap-6">
      <Text className="text-2xl font-bold text-black">Let Me Hit</Text>
      <Text className="text-gray-500">Week of {weekStart}</Text>
      <Text className="text-4xl font-bold text-black">{count}</Text>
      <Text className="text-gray-400 text-sm">completions this week</Text>
      <TouchableOpacity
        onPress={() => addCompletion()}
        className="bg-black px-8 py-4 rounded-full"
        activeOpacity={0.8}
      >
        <Text className="text-white font-semibold text-lg">+ test tap</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={devReset} className="py-2">
        <Text className="text-gray-300 text-xs">Reset (dev only)</Text>
      </TouchableOpacity>
    </View>
  );
}
