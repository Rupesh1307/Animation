import type { ColorValue, StyleProp, ViewStyle } from 'react-native';

export interface WheelPickerProps {
  /**
   * Items to display.
   */
  data: string[];

  /**
   * Initially selected item index.
   */
  selectedIndex?: number;

  /**
   * Height of each item in the wheel picker.
   */
  itemHeight?: number;

  /**
   *  Text size of each item in the wheel picker.
   */
  textSize?: number;

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
  visibleItemCount?: number;

  /**
   * Style applied to the native component.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Whether the wheel picker should loop infinitely.
   * Defaults to true.
   */
  loop?: boolean;

  /**
   * Callback function that is called when the selected item changes.
   * The event object contains the selected index and value.
   */
  onWheelChange?: (event: {
    nativeEvent: { index: number; value: string };
  }) => void;
}
