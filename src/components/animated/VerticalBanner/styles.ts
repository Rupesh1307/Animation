import { StyleSheet } from 'react-native';
import { useTheme } from '@theme/themeProvider';
import { useResponsive } from '@theme/matrix';

export const useStyles = () => {
  const { theme } = useTheme();
  const { verticalScale } = useResponsive();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.background.primary,
      height: verticalScale(60),
    },
    banner: {
      height: verticalScale(60),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background.primary,
    },
    contentConatinerStyle: {
      height: verticalScale(60),
      backgroundColor: theme.background.success,
    },
    bannerText: {
      color: theme.text.primary,
      fontFamily: theme.fonts.inter.semiBold,
    },
  });
  return { styles };
};
