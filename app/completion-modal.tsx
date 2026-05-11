import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { useAppStore } from "../store/useAppStore";

export default function CompletionModal() {
  const addCompletion = useAppStore((s) => s.addCompletion);
  const [note, setNote] = useState("");

  const scale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handleConfirm() {
    // Spring press animation
    scale.value = withSequence(
      withSpring(0.94, { damping: 10, stiffness: 400 }),
      withSpring(1, { damping: 12, stiffness: 300 })
    );
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Let the animation settle before dismissing
    setTimeout(() => {
      addCompletion(note.trim() || undefined);
      router.back();
    }, 200);
  }

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Drag handle */}
          <View style={styles.handle} />

          <View style={styles.body}>
            <Text style={styles.title}>Nice work.</Text>

            <View style={styles.noteSection}>
              <Text style={styles.noteLabel}>Add a note? (optional)</Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="What did you accomplish?"
                placeholderTextColor="#D1D5DB"
                style={styles.input}
                returnKeyType="done"
                onSubmitEditing={handleConfirm}
                maxLength={120}
              />
            </View>
          </View>

          <View style={styles.actions}>
            <Animated.View style={buttonStyle}>
              <TouchableOpacity
                onPress={handleConfirm}
                style={styles.confirmButton}
                activeOpacity={1}
              >
                <Text style={styles.confirmLabel}>Log it</Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
              <Text style={styles.cancelLabel}>Never mind</Text>
            </TouchableOpacity>
          </View>
        </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  flex: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 32, paddingTop: 16 },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
    marginBottom: 40,
  },
  body: { flex: 1, gap: 40 },
  title: { fontSize: 34, fontWeight: "700", color: "#000" },
  noteSection: { gap: 10 },
  noteLabel: { fontSize: 13, color: "#9CA3AF" },
  input: {
    fontSize: 18,
    color: "#000",
    borderBottomWidth: 1.5,
    borderBottomColor: "#F3F4F6",
    paddingVertical: 12,
  },
  actions: { paddingBottom: 24, gap: 16 },
  confirmButton: {
    backgroundColor: "#000",
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
  },
  confirmLabel: { fontSize: 17, fontWeight: "600", color: "#fff" },
  cancelLabel: { fontSize: 15, color: "#9CA3AF", textAlign: "center" },
});
