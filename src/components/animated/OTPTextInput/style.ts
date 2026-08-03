import { StyleSheet } from 'react-native';

import { useTheme } from '@theme/themeProvider';

export const useStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    wrapper: {
      position: 'relative',
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
    },
    hiddenInput: {
      ...StyleSheet.absoluteFillObject,
      color: 'transparent',
      zIndex: 1,
    },
    digitText: {
      fontSize: 22,
      fontFamily: theme.fonts.inter.semiBold,
      zIndex: 0,
    },
  });
};
