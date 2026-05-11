import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SIZE = 220;
const STROKE = 14;
const CENTER = SIZE / 2;

type Props = {
  completions: number;
  target: number;
};

export function ProgressRing({ completions, target }: Props) {
  const progress = target > 0 ? Math.min(completions / target, 1) : 0;
  const offset = useSharedValue(CIRCUMFERENCE);

  useEffect(() => {
    offset.value = withSpring(CIRCUMFERENCE * (1 - progress), {
      damping: 18,
      stiffness: 80,
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: offset.value,
  }));

  return (
    <View style={styles.wrapper}>
      <Svg width={SIZE} height={SIZE}>
        {/* Background track */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke="#F3F4F6"
          strokeWidth={STROKE}
          fill="none"
        />
        {/* Animated progress arc */}
        <AnimatedCircle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke="#000"
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          origin={`${CENTER}, ${CENTER}`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={styles.count}>{completions}</Text>
        <Text style={styles.of}>of {target}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    position: "absolute",
    alignItems: "center",
  },
  count: {
    fontSize: 56,
    fontWeight: "700",
    color: "#000",
    lineHeight: 60,
  },
  of: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 2,
  },
});
