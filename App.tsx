import React from 'react';
import OTPScreen from './src/screens/Otp';
import ThemeProvider from './src/theme/themeProvider';
import VerticalBanner from './src/components/animated/VerticalBanner/reanimatedVersion';
import ColorBox from './src/components/ui/ColorBox';
import WheelPickerComponent from './src/components/ui/WheelPicker';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        {/* <VerticalBanner /> */}
        {/* <ColorBox color="red" width={150} height={150} /> */}
        <WheelPickerComponent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
