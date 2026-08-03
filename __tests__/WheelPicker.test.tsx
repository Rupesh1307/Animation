import React from 'react';
import renderer, {act} from 'react-test-renderer';

import WheelPickerDemo from '../src/components/ui/WheelPicker';

describe('WheelPicker', () => {
  it('renders the initial selected wheel value', () => {
    let tree: renderer.ReactTestRenderer;

    act(() => {
      tree = renderer.create(<WheelPickerDemo />);
    });

    expect(tree!.root.findByType('Text').props.children).toEqual([
      'Selected: ',
      'March',
    ]);
  });
});
