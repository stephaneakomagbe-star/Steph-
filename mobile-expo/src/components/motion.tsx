import { ReactNode, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Pressable, PressableProps, StyleProp, View, ViewStyle } from 'react-native';

const ease = Easing.out(Easing.cubic);

function useReduceMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (active) setReduce(value);
    }).catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduce);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);
  return reduce;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SoftPress({ style, disabled, children, onPressIn, onPressOut, ...props }: PressableProps) {
  const reduce = useReduceMotion();
  const scale = useRef(new Animated.Value(1)).current;

  function move(to: number, duration: number) {
    if (reduce || disabled) {
      scale.setValue(1);
      return;
    }
    Animated.timing(scale, { toValue: to, duration, easing: ease, useNativeDriver: true }).start();
  }

  return (
    <AnimatedPressable
      {...props}
      disabled={disabled}
      onPressIn={(event) => {
        move(0.98, 180);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        move(1, 240);
        onPressOut?.(event);
      }}
      style={[style as object, { transform: [{ scale }] }] as PressableProps['style']}
    >
      {children}
    </AnimatedPressable>
  );
}

export function Reveal({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: StyleProp<ViewStyle> }) {
  const reduce = useReduceMotion();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    if (reduce) {
      opacity.setValue(1);
      translateY.setValue(0);
      return;
    }
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 380, delay, easing: ease, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 380, delay, easing: ease, useNativeDriver: true }),
    ]).start();
  }, [delay, opacity, reduce, translateY]);

  return <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>{children}</Animated.View>;
}

export function ProgressBar({ progress, color, track, flex = false }: { progress: number; color: string; track: string; flex?: boolean }) {
  const reduce = useReduceMotion();
  const width = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const next = Math.max(0, Math.min(1, progress));
    if (reduce) {
      width.setValue(next);
      return;
    }
    Animated.timing(width, { toValue: next, duration: 420, easing: ease, useNativeDriver: false }).start();
  }, [progress, reduce, width]);

  const animatedWidth = width.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  return (
    <View style={{ width: flex ? undefined : '100%', flex: flex ? 1 : undefined, height: 6, borderRadius: 6, backgroundColor: track, overflow: 'hidden' }}>
      <Animated.View style={{ width: animatedWidth, height: '100%', borderRadius: 6, backgroundColor: color }} />
    </View>
  );
}

export function Skeleton({ width, height = 14, color }: { width: number | `${number}%`; height?: number; color: string }) {
  const reduce = useReduceMotion();
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    if (reduce) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, easing: ease, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.45, duration: 700, easing: ease, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity, reduce]);

  return <Animated.View style={{ width, height, borderRadius: 8, opacity, backgroundColor: color }} />;
}

export function SuccessPop({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const reduce = useReduceMotion();
  const scale = useRef(new Animated.Value(reduce ? 1 : 0.86)).current;
  const opacity = useRef(new Animated.Value(reduce ? 1 : 0)).current;

  useEffect(() => {
    if (reduce) return;
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 280, easing: ease, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 460, easing: Easing.out(Easing.back(1.4)), useNativeDriver: true }),
    ]).start();
  }, [opacity, reduce, scale]);

  return <Animated.View style={[style, { opacity, transform: [{ scale }] }]}>{children}</Animated.View>;
}
