import { codegenNativeComponent } from 'react-native';
import type { ViewProps, ColorValue } from 'react-native';
import type {
  DirectEventHandler,
  Int32,
  Float,
} from 'react-native/Libraries/Types/CodegenTypes';

export interface WheelPickerChangeEvent {
  index: Int32;
  value: string;
}

export interface NativeProps extends ViewProps {
  /**
   * Items to display.
   */
  data: ReadonlyArray<string>;

  /**
   * Selected index.
   */
  selectedIndex?: Int32;

  /**
   * Height of each item in the wheel picker.
   */
  itemHeight?: Int32;

  /**
   * Text size of each item in the wheel picker.
   */
  textSize?: Float;

  /**
   * Text color of each item in the wheel picker.
   */
  textColor?: ColorValue;

  /**
   * Text color of the selected item in the wheel picker.
   */
  selectedTextColor?: ColorValue;

  /**
   * Background color of the wheel picker.
   */
  backgroundColor?: ColorValue;

  /**
   * Number of visible items in the wheel picker.
   */
  visibleItemCount?: Int32;

  /**
   * Whether the wheel picker should loop infinitely.
   */
  loop?: boolean;

  /**
   * Called when the selected item changes.
   */
  onWheelChange?: DirectEventHandler<WheelPickerChangeEvent>;
}

export default codegenNativeComponent<NativeProps>('WheelPicker');
