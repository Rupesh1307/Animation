import { StyleSheet } from 'react-native';
import { useTheme } from '@theme/themeProvider';
import { useResponsive } from './matrix';

const useGlobalStyles = () => {
  const { theme } = useTheme();
  const { insets } = useResponsive();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background.primary,
      paddingTop: insets.top,
    },
  });

  return { styles };
};

export default useGlobalStyles;
