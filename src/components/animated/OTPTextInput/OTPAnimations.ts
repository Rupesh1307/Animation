import { useRef, useEffect } from 'react';
import { makeMutable, cancelAnimation } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

export interface OTPAnims {
  translateYValues: SharedValue<number>[];
  opacityValues: SharedValue<number>[];
}

function useOTPAnimation(length: number): OTPAnims {
  const translateYValues = useRef<SharedValue<number>[]>(
    Array.from({ length }, () => makeMutable(0)),
  ).current;

  const opacityValues = useRef<SharedValue<number>[]>(
    Array.from({ length }, () => makeMutable(0)),
  ).current;

  // Cleanup on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      translateYValues.forEach(v => cancelAnimation(v));
      opacityValues.forEach(v => cancelAnimation(v));
    };
  }, []);

  return { translateYValues, opacityValues };
}

export default useOTPAnimation;