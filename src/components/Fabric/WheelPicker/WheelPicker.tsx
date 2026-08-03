import React from 'react';
import type { WheelPickerProps } from './types';

import NativeWheelPicker from '../../../../specs/WheelPickerNativeComponent';

const WheelPicker = ({
  data,
  selectedIndex = 0,
  style,
  itemHeight,
  textSize,
  textColor,
  selectedTextColor,
  backgroundColor,
  visibleItemCount,
}: WheelPickerProps) => {
  return (
    <NativeWheelPicker
      style={style}
      data={data}
      selectedIndex={selectedIndex}
      itemHeight={itemHeight}
      textSize={textSize}
      textColor={textColor}
       selectedTextColor={selectedTextColor}
       backgroundColor={backgroundColor}
      visibleItemCount={visibleItemCount}
    />
  );
};

export default WheelPicker;
