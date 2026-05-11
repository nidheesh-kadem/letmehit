import * as Haptics from "expo-haptics";
import { Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native";

const WIDTH = Dimensions.get("window").width - 64;

type Props = {
  onPress: () => void;
};

export function CompletionButton({ onPress }: Props) {
  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.button}
      activeOpacity={0.85}
    >
      <Text style={styles.plus}>+</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: WIDTH,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  plus: {
    fontSize: 42,
    color: "#fff",
    fontWeight: "300",
    lineHeight: 48,
  },
});
