import { StyleSheet } from 'react-native';

import { useTheme } from '@theme/themeProvider';

export const useStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 16,
    },
    otpContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
    input: {
      height: 48,
      width: 48,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border.primary,
    //   textAlign: 'center',
      fontFamily: theme.fonts.inter.semiBold,
      fontSize: 18,
      color: theme.text.primary,
    },
    resend: {
      textAlign: 'center',
      marginTop: 20,
      color: theme.text.info,
    },
    submit: {
      height: 48,
      backgroundColor: theme.color.primary,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      width: '100%',
    },
    submitText: {
      color: theme.text.inverted,
      fontWeight: 'bold',
    },
  });
};
