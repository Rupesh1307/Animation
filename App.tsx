import React from 'react';
import OTPScreen from './src/screens/Otp';
import ThemeProvider from './src/theme/themeProvider';

function App() {
  return (
    <ThemeProvider>
      <OTPScreen />
    </ThemeProvider>
  );
}

export default App;
