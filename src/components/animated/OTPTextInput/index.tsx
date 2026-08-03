import React from 'react';
import { View, TextInput, TextInputProps } from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useStyles } from './style';

interface OTPBoxProps {
  digit: string;
  translateY: ReturnType<typeof useSharedValue<number>>;
  opacity: ReturnType<typeof useSharedValue<number>>;
  inputRef: (ref: TextInput | null) => void;
  boxStyle: object;
  textColor: string;
  cursorColor: string;
  onChangeText: (text: string) => void;
  caretHidden?: boolean;
  onKeyPress: (
    e: Parameters<NonNullable<TextInputProps['onKeyPress']>>[0],
  ) => void;
}

function OTPBox({
  digit,
  translateY,
  opacity,
  inputRef,
  boxStyle,
  textColor,
  cursorColor,
  onChangeText,
  onKeyPress,
  caretHidden = false,
  ...rest
}: OTPBoxProps) {
  const styles = useStyles();
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={[boxStyle, styles.wrapper]}>
      <TextInput
        ref={inputRef}
        value={digit}
        maxLength={1}
        keyboardType="number-pad"
        textAlign="center"
        cursorColor={cursorColor}
        onChangeText={onChangeText}
        onKeyPress={onKeyPress}
        style={styles.hiddenInput}
        caretHidden={caretHidden}
        {...rest}
      />
      <Animated.Text
        pointerEvents="none"
        style={[styles.digitText, { color: textColor }, animStyle]}
      >
        {digit}
      </Animated.Text>
    </View>
  );
}

export default OTPBox;
