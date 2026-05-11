import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppStore } from "../../store/useAppStore";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function OnboardingScreen() {
  const updateSettings = useAppStore((s) => s.updateSettings);

  const [step, setStep] = useState(1);
  const [rewardDay, setRewardDay] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6>(6);
  const [reward, setReward] = useState("");
  const [target, setTarget] = useState(10);

  const canContinue = step !== 2 || reward.trim().length > 0;

  function handleContinue() {
    if (step < 3) {
      setStep((s) => s + 1);
      return;
    }
    updateSettings({
      rewardDay,
      reward: reward.trim(),
      weeklyTarget: target,
      onboardingComplete: true,
    });
    router.replace("/");
  }

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          {/* Progress */}
          <Text style={styles.stepLabel}>Step {step} of 3</Text>

          {/* Step content — flex-1 pushes buttons to bottom */}
          <View style={styles.flex}>
            {step === 1 && (
              <StepRewardDay value={rewardDay} onChange={setRewardDay} />
            )}
            {step === 2 && (
              <StepReward value={reward} onChange={setReward} />
            )}
            {step === 3 && (
              <StepTarget value={target} onChange={setTarget} />
            )}
          </View>

          {/* Buttons pinned to bottom */}
          <View style={styles.buttonArea}>
            <TouchableOpacity
              onPress={handleContinue}
              disabled={!canContinue}
              style={[
                styles.primaryButton,
                { backgroundColor: canContinue ? "#000" : "#E5E7EB" },
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.primaryButtonLabel,
                  { color: canContinue ? "#fff" : "#9CA3AF" },
                ]}
              >
                {step === 3 ? "Let's go" : "Continue"}
              </Text>
            </TouchableOpacity>

            {step > 1 && (
              <TouchableOpacity
                onPress={() => setStep((s) => s - 1)}
                style={styles.backButton}
              >
                <Text style={styles.backLabel}>Back</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function StepRewardDay({
  value,
  onChange,
}: {
  value: number;
  onChange: (day: 0 | 1 | 2 | 3 | 4 | 5 | 6) => void;
}) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.headline}>Which day is your{"\n"}reward day?</Text>
      <View style={styles.pillRow}>
        {DAY_LABELS.map((label, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => onChange(idx as 0 | 1 | 2 | 3 | 4 | 5 | 6)}
            style={[
              styles.dayPill,
              { backgroundColor: value === idx ? "#000" : "#fff" },
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.dayPillLabel,
                { color: value === idx ? "#fff" : "#6B7280" },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function StepReward({
  value,
  onChange,
}: {
  value: string;
  onChange: (text: string) => void;
}) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.headline}>What's your{"\n"}reward?</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="e.g. A nice dinner out"
        placeholderTextColor="#9CA3AF"
        style={styles.textInput}
        autoFocus
        returnKeyType="done"
        maxLength={80}
      />
      <Text style={styles.hint}>Make it something worth earning.</Text>
    </View>
  );
}

function StepTarget({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.headline}>How many wins to{"\n"}earn it?</Text>
      <View style={styles.stepper}>
        <TouchableOpacity
          onPress={() => onChange(Math.max(1, value - 1))}
          style={styles.stepperButton}
          activeOpacity={0.7}
        >
          <Text style={styles.stepperOp}>−</Text>
        </TouchableOpacity>
        <Text style={styles.stepperValue}>{value}</Text>
        <TouchableOpacity
          onPress={() => onChange(Math.min(99, value + 1))}
          style={styles.stepperButton}
          activeOpacity={0.7}
        >
          <Text style={styles.stepperOp}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.hint, { textAlign: "center" }]}>
        Your weekly target.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  flex: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 32, paddingTop: 48 },
  stepLabel: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#9CA3AF",
    marginBottom: 48,
  },
  stepContent: { flex: 1, gap: 32 },
  headline: { fontSize: 30, fontWeight: "700", color: "#000", lineHeight: 38 },
  hint: { fontSize: 13, color: "#9CA3AF" },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  dayPill: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  dayPillLabel: { fontWeight: "600", fontSize: 14 },
  textInput: {
    fontSize: 22,
    borderBottomWidth: 2,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 12,
    color: "#000",
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  stepperButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  stepperOp: { fontSize: 28, color: "#6B7280" },
  stepperValue: { fontSize: 72, fontWeight: "700", color: "#000", width: 96, textAlign: "center" },
  buttonArea: { paddingBottom: 32, gap: 8 },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  primaryButtonLabel: { fontSize: 17, fontWeight: "600" },
  backButton: { paddingVertical: 12, alignItems: "center" },
  backLabel: { fontSize: 15, color: "#9CA3AF" },
});
