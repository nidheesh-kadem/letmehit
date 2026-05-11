import { Redirect, router } from "expo-router";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CompletionButton } from "../components/CompletionButton";
import { ProgressRing } from "../components/ProgressRing";
import { daysUntil } from "../lib/dates";
import { useAppStore } from "../store/useAppStore";

const DAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday",
];

function countdownText(rewardDay: number): string {
  const days = daysUntil(rewardDay as 0 | 1 | 2 | 3 | 4 | 5 | 6);
  if (days === 0) return "Today is your reward day";
  if (days === 1) return `1 day until ${DAY_NAMES[rewardDay]}`;
  return `${days} days until ${DAY_NAMES[rewardDay]}`;
}

export default function HomeScreen() {
  const hasHydrated = useAppStore((s) => s._hasHydrated);
  const onboardingComplete = useAppStore((s) => s.settings.onboardingComplete);
  const reward = useAppStore((s) => s.settings.reward);
  const rewardDay = useAppStore((s) => s.settings.rewardDay);
  const weeklyTarget = useAppStore((s) => s.settings.weeklyTarget);
  const count = useAppStore((s) => s.currentWeek.completions.length);
  const devReset = useAppStore((s) => s._devReset);

  if (!hasHydrated) return null;
  if (!onboardingComplete) return <Redirect href="/onboarding" />;

  return (
    <SafeAreaView style={styles.root}>
      {/* App name — subtle top label */}
      <View style={styles.header}>
        <Text style={styles.appName}>LET ME HIT</Text>
      </View>

      {/* Main content — centered */}
      <View style={styles.content}>
        <Text style={styles.countdown}>{countdownText(rewardDay)}</Text>

        <ProgressRing completions={count} target={weeklyTarget} />

        <Text style={styles.reward} numberOfLines={2}>
          {reward}
        </Text>
      </View>

      {/* Bottom action area */}
      <View style={styles.footer}>
        <CompletionButton onPress={() => router.push("/completion-modal")} />
        <TouchableOpacity onPress={devReset} hitSlop={12}>
          <Text style={styles.devReset}>Reset (dev only)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingTop: 8,
    alignItems: "center",
  },
  appName: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
    color: "#D1D5DB",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
    paddingHorizontal: 32,
  },
  countdown: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  reward: {
    fontSize: 16,
    color: "#9CA3AF",
    fontStyle: "italic",
    textAlign: "center",
    maxWidth: 260,
  },
  footer: {
    paddingBottom: 40,
    alignItems: "center",
    gap: 16,
  },
  devReset: {
    fontSize: 11,
    color: "#E5E7EB",
  },
});
