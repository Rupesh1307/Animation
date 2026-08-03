import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TextInputProps, Pressable } from 'react-native';
import { useStyles } from './style';
import { useTheme } from '@theme/themeProvider';
import OTPBox from '@components/animated/OTPTextInput';
import { withSpring, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import useOTPAnimation from '@components/animated/OTPTextInput/OTPAnimations';

const OTP_LENGTH = 4;
const OTP_TIMEOUT = 30;

function OTPScreen() {
  const { theme } = useTheme();
  const styles = useStyles();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState<number>(OTP_TIMEOUT);
  const inputRef = useRef<(TextInput | null)[]>([]);

  const { translateYValues, opacityValues } = useOTPAnimation(OTP_LENGTH);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const animateIn = (index: number) => {
    'worklet';
    translateYValues[index].value = 40;
    opacityValues[index].value = 0;

    translateYValues[index].value = withSpring(0, {
      damping: 14,
      stiffness: 180,
      mass: 0.6,
    });
    opacityValues[index].value = withTiming(1, { duration: 150 });
  };

  const animateOut = (index: number, callback?: () => void) => {
    'worklet';
    // translateYValues[index].value = withTiming(-40, { duration: 150 });
    opacityValues[index].value = withTiming(0, { duration: 10 }, finished => {
      if (finished && callback) scheduleOnRN(callback);
    });
  };

  const handleChange = (text: string, index: number) => {
    if (text) {
      setOtp(prev => {
        const updated = [...prev];
        updated[index] = text;
        return updated;
      });
      animateIn(index);

      if (index < OTP_LENGTH - 1) {
        inputRef.current[index + 1]?.focus();
      }
    } else {
      animateOut(index, () => {
        setOtp(prev => {
          const updated = [...prev];
          updated[index] = '';
          return updated;
        });
      });
    }
  };

  const handleKeyPress = (
    e: Parameters<NonNullable<TextInputProps['onKeyPress']>>[0],
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      animateOut(index - 1, () => {
        setOtp(prev => {
          const updated = [...prev];
          updated[index - 1] = '';
          return updated;
        });
      });
      inputRef.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (timer > 0) return;

    otp.forEach((digit, i) => {
      if (digit) setTimeout(() => animateOut(i), i * 50);
    });

    setTimeout(() => {
      setOtp(Array(OTP_LENGTH).fill(''));
      setTimer(OTP_TIMEOUT);
      inputRef.current[0]?.focus();
    }, OTP_LENGTH * 50 + 150);

    console.log('OTP Resent');
  };

  return (
    <View style={styles.container}>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <OTPBox
            key={index}
            digit={digit}
            translateY={translateYValues[index]}
            opacity={opacityValues[index]}
            inputRef={ref => {
              inputRef.current[index] = ref;
            }}
            boxStyle={styles.input}
            textColor={theme.text.primary}
            cursorColor={theme.color.primary}
            onChangeText={text => handleChange(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            caretHidden={true}
          />
        ))}
      </View>

      <Pressable onPress={handleResend}>
        <Text style={styles.resend}>
          {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
        </Text>
      </Pressable>

      <Pressable
        style={styles.submit}
        onPress={() => console.log('OTP Submitted:', otp.join(''))}
      >
        <Text style={styles.submitText}>Submit</Text>
      </Pressable>
    </View>
  );
}

export default OTPScreen;
