import React from 'react';
import OTPScreen from './src/screens/Otp';
import ThemeProvider from './src/theme/themeProvider';
import VerticalBanner from './src/components/animated/VerticalBanner/reanimatedVersion';
import ColorBox from './src/components/ui/ColorBox';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        {/* <VerticalBanner /> */}
        <ColorBox color="red" width={150} height={150} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
