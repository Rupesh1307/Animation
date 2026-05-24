import React, {
  createContext,
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import { useColorScheme } from 'react-native';
import lightTheme from './light';
import darkTheme from './dark';
import Theme from './type';
import { setItem, getItem, removeItem } from '@utils/storage/mmkv-storage';

const THEME_KEY = 'app_theme';

interface ThemeContextProps {
  theme: Theme;
  isDarkMode: boolean;
  isSystemTheme: boolean;
  toggleTheme: () => void;
  resetToSystemTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: lightTheme,
  isDarkMode: false,
  isSystemTheme: true,
  toggleTheme: () => {},
  resetToSystemTheme: () => {},
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

function ThemeProvider({ children }: ThemeProviderProps) {
  const colorScheme = useColorScheme();

  // ✅ MMKV is synchronous — lazy initializer reads storage during
  // first render itself, zero extra renders, zero theme flash
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const stored = getItem(THEME_KEY,lightTheme.name);
      return stored ? stored === 'dark' : colorScheme === 'dark';
    } catch {
      return colorScheme === 'dark';
    }
  });

  const [isSystemTheme, setIsSystemTheme] = useState<boolean>(() => {
    try {
      // no stored value means we are following system
      return getItem(THEME_KEY,null) === null;
    } catch {
      return true;
    }
  });

  // ✅ prevents save effect from firing on first render
  const isMounted = useRef(false);

  // ✅ follow system theme changes only when user has no saved preference
  useEffect(() => {
    if (isSystemTheme) {
      setIsDark(colorScheme === 'dark');
    }
  }, [colorScheme, isSystemTheme]);

  // ✅ persist to MMKV whenever isDark changes, skipping mount
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    try {
      setItem(THEME_KEY, isDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }, [isDark]);

  // ✅ toggle and mark as explicit user preference
  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
    setIsSystemTheme(false);
  }, []);

  // ✅ revert to system preference and wipe saved value
  const resetToSystemTheme = useCallback(() => {
    setIsSystemTheme(true);
    setIsDark(colorScheme === 'dark');
    try {
      removeItem(THEME_KEY);
    } catch (error) {
      console.error('Failed to reset theme:', error);
    }
  }, [colorScheme]);

  // ✅ memoized to prevent unnecessary consumer re-renders
  const value = useMemo<ThemeContextProps>(
    () => ({
      theme: isDark ? darkTheme : lightTheme,
      isDarkMode: isDark,
      isSystemTheme,
      toggleTheme,
      resetToSystemTheme,
    }),
    [isDark, isSystemTheme, toggleTheme, resetToSystemTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme(): ThemeContextProps {
  const context = useContext<ThemeContextProps>(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

export { useTheme };
export default ThemeProvider;