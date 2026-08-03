import type { ViewProps } from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

export interface ColorBoxProps extends ViewProps {
  color: string;
}

export default codegenNativeComponent<ColorBoxProps>('ColorBox');
