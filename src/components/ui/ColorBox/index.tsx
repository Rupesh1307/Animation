import React from 'react';
import ColorBoxNativeComponent from '../../../../specs/ColorBoxNativeComponent';

type Props = {
  color: string;
  width?: number;
  height?: number;
};

export default function ColorBox({
  color,
  width = 100,
  height = 100,
}: Props) {
  return (
    <ColorBoxNativeComponent
      color={color}
      style={{
        width,
        height,
      }}
    />
  );
}