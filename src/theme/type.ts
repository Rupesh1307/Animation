import { fonts, typography } from './font';
type Fonts = typeof fonts;
type Typography = typeof typography;

type ColorValue = string;

interface RampScale {
  50: ColorValue;
  100: ColorValue;
  200: ColorValue;
  400: ColorValue;
  600: ColorValue;
  800: ColorValue;
  900: ColorValue;
}

interface SemanticColors {
  primary: ColorValue;
  secondary: ColorValue;
  tertiary: ColorValue;
  info: ColorValue;
  success: ColorValue;
  warning: ColorValue;
  danger: ColorValue;
  inverted: ColorValue;
  black: ColorValue;
  white: ColorValue;
}

interface Ramps {
  purple: RampScale;
  teal: RampScale;
  blue: RampScale;
  coral: RampScale;
  amber: RampScale;
  green: RampScale;
  red: RampScale;
  pink: RampScale;
  gray: RampScale;
}

interface Theme {
  name: string;
  color: SemanticColors;
  background: SemanticColors;
  text: SemanticColors;
  border: SemanticColors;
  ramps: Ramps;
  fonts: Fonts;
  typography: Typography;
}

export type { Theme, SemanticColors, Ramps, RampScale };

export default Theme;
