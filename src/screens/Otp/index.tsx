import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TextInputProps, Pressable } from 'react-native';
import { useStyles } from './style';
import { useTheme } from '@theme/themeProvider';

const OTP_LENGTH = 6;
const OTP_TIMEOUT = 30; // 30 seconds

function OTPScreen() {
  const { theme } = useTheme();
  const styles = useStyles();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState<number>(OTP_TIMEOUT);
  const inputRef = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-advance to next input
    if (text && index < OTP_LENGTH - 1) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: Parameters<NonNullable<TextInputProps['onKeyPress']>>[0],
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (timer > 0) return;

    setTimer(OTP_TIMEOUT);
    setOtp(Array(OTP_LENGTH).fill(''));
    inputRef.current[0]?.focus();

    console.log('OTP Resent');
  };

  return (
    <View style={styles.container}>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => {
              inputRef.current[index] = ref;
            }}
            value={digit}
            style={styles.input}
            maxLength={1}
            keyboardType="number-pad"
            textAlign="center"
            onChangeText={text => handleChange(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            cursorColor={theme.color.primary}
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
