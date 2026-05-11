import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAppStore } from "../store/useAppStore";

// Phase 1 debug surface — replaced entirely in Phase 3
export default function HomeScreen() {
  const initWeek = useAppStore((s) => s.initWeek);
  const addCompletion = useAppStore((s) => s.addCompletion);
  const count = useAppStore((s) => s.currentWeek.completions.length);
  const weekStart = useAppStore((s) => s.currentWeek.weekStartDate);

  useEffect(() => {
    initWeek();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white gap-6">
      <Text className="text-2xl font-bold">Let Me Hit</Text>
      <Text className="text-gray-500">Week of {weekStart}</Text>
      <Text className="text-4xl font-bold">{count}</Text>
      <Text className="text-gray-400 text-sm">completions this week</Text>
      <TouchableOpacity
        onPress={() => addCompletion()}
        className="bg-black px-8 py-4 rounded-full"
        activeOpacity={0.8}
      >
        <Text className="text-white font-semibold text-lg">+ test tap</Text>
      </TouchableOpacity>
    </View>
  );
}
